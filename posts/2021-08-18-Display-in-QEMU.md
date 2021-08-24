# Display in QEMU

Gerd Hoffmann has introduced graphics in QEMU here and there[^1], and in this
article, I will do some basic introduction about QEMU displays and QEMU consoles
with QEMU code (QEMU 6.1.0-rc3).

## QEMU Displays

QEMU displays are a set of display change listeners with the support of text or
graphic tools on the host machine.

### QEMU Display options

As claimed [here](https://wiki.gentoo.org/wiki/QEMU/Options), we can send the
QEMU display to sdl/curses/gtk/vnc/spice windows, or just do not display video
output. Only curses supports text mode. "Nothing is displayed when the graphics
device is in graphical mode or if the graphics device does not support a text
mode. Generally, only the VGA device models support text mode."

To talk to the host, each display has a change listener with several callbacks
that would call the relative APIs. For example, `curses_update` will call
[`pnoutrefresh`](https://linux.die.net/man/3/pnoutrefresh).

``` c
static const DisplayChangeListenerOps dcl_ops = {
    .dpy_name        = "curses",
    .dpy_text_update = curses_update,
    .dpy_text_resize = curses_resize,
    .dpy_refresh     = curses_refresh,
    .dpy_text_cursor = curses_cursor_position,
};
```

Here are all change listener callbacks.

```
ui/curses.c:767:static const DisplayChangeListenerOps dcl_ops = {
ui/sdl2.c:761:static const DisplayChangeListenerOps dcl_2d_ops = {
ui/sdl2.c:772:static const DisplayChangeListenerOps dcl_gl_ops = {
ui/spice-display.c:775:static const DisplayChangeListenerOps display_listener_ops = {
ui/spice-display.c:1096:static const DisplayChangeListenerOps display_listener_gl_ops = {
ui/egl-headless.c:154:static const DisplayChangeListenerOps egl_ops = {
ui/cocoa.m:86:static const DisplayChangeListenerOps dcl_ops = {
ui/gtk.c:607:static const DisplayChangeListenerOps dcl_ops = {
ui/gtk.c:635:static const DisplayChangeListenerOps dcl_gl_area_ops = {
ui/gtk.c:656:static const DisplayChangeListenerOps dcl_egl_ops = {
ui/vnc.c:3337:static const DisplayChangeListenerOps dcl_ops = {
```

### In QEMU, the registration process is in the following.

First, `qemu_display_register` will register all `QemuDisplay` objects to
`dpys[DISPLAY_TYPE__MAX]`.

```
static QemuDisplay *dpys[DISPLAY_TYPE__MAX];

void qemu_display_register(QemuDisplay *ui) {
    assert(ui->type < DISPLAY_TYPE__MAX);
    dpys[ui->type] = ui; // S3
}

static QemuDisplay qemu_display_curses = {
    .type       = DISPLAY_TYPE_CURSES,
    .init       = curses_display_init,
};

static void register_curses(void) {
    qemu_display_register(&qemu_display_curses); // S2
}

type_init(register_curses); // S1
```

Second, `qemu_init_displays` will first initialize a global `DisplayState` and
initialize all text consoles if available. Then, `qemu_init_displays` will call
`qemu_display_init`, and then call all `.init` registered if `-display none` is
not set.

``` c
static DisplayState *get_alloc_displaystate(void) {
    if (!display_state) {
        display_state = g_new0(DisplayState, 1);
        cursor_timer = timer_new_ms(
            QEMU_CLOCK_REALTIME, text_console_update_cursor, NULL);
    }
    return display_state;
}

DisplayState *init_displaystate(void) {
    gchar *name;
    QemuConsole *con;

    get_alloc_displaystate();
    QTAILQ_FOREACH(con, &consoles, next) {
        if (con->console_type != GRAPHIC_CONSOLE &&
            con->ds == NULL) {
            text_console_do_init(con->chr, display_state);
        }
        ...
    }
    return display_state;
}

void qemu_display_init(DisplayState *ds, DisplayOptions *opts) {
    if (opts->type == DISPLAY_TYPE_NONE) {
        return;
    }
    assert(dpys[opts->type] != NULL);
    dpys[opts->type]->init(ds, opts);
}
```

## QEMU Console

QEMU consoles are the bridges between video devices and QEMU displays.

### QEMU consoles are defined as a list of `QemuConsole`.

``` c
static QTAILQ_HEAD(, QemuConsole) consoles = QTAILQ_HEAD_INITIALIZER(consoles);
```

+ There is a for-each primitive to traverse each `QemuConsole`.

``` c
QTAILQ_FOREACH(con, &consoles, next) { }
```

+ There are several high-level primitives to access a `QemuConsole` as well.

``` c
qemu_console_lookup_by_index(... index)
qemu_console_lookup_by_device(... dev, ... head)
qemu_console_lookup_by_device_name(... device_id, head) // device_id -> dev
qemu_console_lookup_unused()
```

### QEMU consoles have three types.

``` c
typedef enum {
    GRAPHIC_CONSOLE, TEXT_CONSOLE, TEXT_CONSOLE_FIXED_SIZE
} console_type_t;
```

+ `GRAPHIC_CONSOLE`

``` c
// e.g., ati-vga
ati_vga_realize -> graphic_console_init -> new_console(..., GRAPHIC_CONSOLE, ...)
```

Other examples are in the following.

``` txt
hw/display/pl110.c
hw/display/g364fb.c
hw/display/virtio-gpu-base.c
hw/display/bochs-display.c
hw/display/vga-pci.c
hw/display/vmware_vga.c
hw/display/xlnx_dp.c
hw/display/vga-isa-mm.c
hw/display/cirrus_vga.c
hw/display/ramfb-standalone.c
hw/display/exynos4210_fimd.c
hw/display/macfb.c
hw/display/bcm2835_fb.c
hw/display/cg3.c
hw/display/xenfb.c
hw/display/cirrus_vga_isa.c
hw/display/omap_lcdc.c
hw/display/jazz_led.c
hw/display/tc6393xb.c
hw/display/milkymist-vgafb.c
hw/display/vga-isa.c
hw/display/next-fb.c
hw/display/ssd0323.c
hw/display/ati.c
hw/display/artist.c
hw/display/qxl.c
hw/display/ssd0303.c
hw/display/tcx.c
hw/display/omap_dss.c
hw/display/sm501.c
hw/display/blizzard.c
hw/display/pxa2xx_lcd.c
```

+ `TEXT_CONSOLE[_FIXED_SIZE]`

``` c
// e.g., chardev-vc
vc_chr_open -> new_console(..., TEXT_CONSOLE[_FIXED_SIZE], ...)
```

### QEMU consoles are initialized by `new_console`.

First, `new_console` allocates an object and initializes some fields.

``` c
obj = object_new(TYPE_QEMU_CONSOLE);
s = QEMU_CONSOLE(obj);
qemu_co_queue_init(&s->dump_queue);
s->head = head;
```

Then, if no console is activated, it will choose the first allocated console.
However, a graphic console can override others.

``` c
if (!active_console || ((active_console->console_type != GRAPHIC_CONSOLE) &&
    (console_type == GRAPHIC_CONSOLE))) {
    active_console = s;
}
```

Next, still some fields.

``` c
s->ds = ds; // with display change listeners 
s->console_type = console_type;
s->window_id = -1;
```

Last, `new_console` will insert the allocated object to the list `consoles`.

+ If the list is empty, insert the object directly and then set the index to 0.
+ If the object is not a graphic console and QEMU is in the phase
of `PHASE_MACHINE_READY`, append the object and update its index.
+ If the object is a graphic console, append the object to the last graphic
console and keep the graphic consoles in front of the text consoles. If in this
situation, the text consoles will be renumbered. 

## QEMU consoles, QEMU video devices and QEMU displays

### A typical example would be `graphic_console_init`.

First, by calling `get_alloc_dispaly`, it allocates or gets an allocated
`DisplayState` that is bonded to a list of display change listeners.

``` c
ds = get_alloc_displaystate();
```

Second, it finds an unused QEMU console by `qemu_console_lookup_unused`. A QEMU
console is unused when it is at least not linked to a QEMU video device. If
there is no console available, it will call `new_console` to allocate a graphic
console with the allocated `DisplayState`.

``` c
s = qemu_console_lookup_unused();
if (s) {
    if (s->surface) {
        width = surface_width(s->surface);
        height = surface_height(s->surface);
    }
} else {
    s = new_console(ds, GRAPHIC_CONSOLE, head);
    s->ui_timer = timer_new_ms(QEMU_CLOCK_REALTIME, dpy_set_ui_info_timer, s);
}
```

Third, it links the console to the QEMU video device and registers relative
callbacks.

``` c
graphic_console_set_hwops(s, hw_ops, opaque);
if (dev) {
    object_property_set_link(OBJECT(s), "device", OBJECT(dev), &error_abort);
}
```

Finally, create a surface and notify all QEMU displays through
`s->ds->listeners`.

``` c
surface = qemu_create_placeholder_surface(width, height, noinit);
dpy_gfx_replace_surface(s, surface);
```

Here is a summary.

``` txt
+------------------+           +------------+              +-------------+
+QEMU vidio devices+ <-hw_ops- +QEMU console+ -listeners-> +QEMU dispalys+
+------------------+           +------------+              +-------------+
```

### When it comes to a text console, things are similar.

First, allocate a QEMU console.

``` c
if (width == 0 || height == 0) {
    s = new_console(NULL, TEXT_CONSOLE, 0);
} else {
    s = new_console(NULL, TEXT_CONSOLE_FIXED_SIZE, 0);
    s->surface = qemu_create_displaysurface(width, height);
}
```

Then, link the console with the `ChardevVC`, `DisplayState` if available and 
relative hardware operations.

``` c
static void text_console_do_init(Chardev *chr, DisplayState *ds) {
    s->ds = ds
    ...
    s->hw_ops = &text_console_ops;
    s->hw = s;
    ...
}
```

## Interactions through QEMU consoles 

### First of all, we will figure out when the hw_ops are called.

All hw_ops are defined in the following.

``` c
typedef struct GraphicHwOps {
    int (*get_flags)(void *opaque); /* optional, default 0 */
    void (*invalidate)(void *opaque);
    void (*gfx_update)(void *opaque);
    bool gfx_update_async; /* if true, calls graphic_hw_update_done() */
    void (*text_update)(void *opaque, console_ch_t *text);
    void (*update_interval)(void *opaque, uint64_t interval);
    int (*ui_info)(void *opaque, uint32_t head, QemuUIInfo *info);
    void (*gl_block)(void *opaque, bool block);
    void (*gl_flushed)(void *opaque);
} GraphicHwOps;
```

We can group them according to their usage.

#### Group 1: graphic_hw_xxx

Callbacks in this group will be called by QEMU displays. Graphic displays
usually call `graphic_hw_update`, while text displays would call
`graphic_hw_text_udpate`. A virtual device must tell the corresponding QEMU
displays what should do by implementing these callbacks.

```
graphic_hw_update (gfx_update)
graphic_hw_text_update
graphic_hw_invalidate 
graphic_hw_gl_block
graphic_hw_gl_flushed
```

#### Group 2: gui_update -> update_interval

When `register_displaychangelistener` is called by a QEMU display, it will set a
timer to call `phy_refresh` periodically. A virtual device can implement
`update_interval` to synchronize the interval of the timer.

#### Group 3: dpy_compatible_with and dpy_set_ui_info_timer

The former checks whether a video device is compatible with a QEMU display by
calling `get_flags`. The latter will be triggered when ui info should be told to
the guest.

### Second, we will figure out how the display listener callbacks work.

#### An example of graphic QEMU display

``` c
static const DisplayChangeListenerOps dcl_ops = {
    .dpy_name             = "gtk",
    .dpy_gfx_update       = gd_update,
    .dpy_gfx_switch       = gd_switch,
    .dpy_gfx_check_format = qemu_pixman_check_format,
    .dpy_refresh          = gd_refresh,
    .dpy_mouse_set        = gd_mouse_set,
    .dpy_cursor_define    = gd_cursor_define,
};
```

+ `dpy_gfx_update`, `dpy_gfx_check_format`, `dpy_mouse_set`, and `dpy_cursor_define`
will be called from vedio devices.
+ `dpy_refresh` is illustrated above.
+ `gpy_gfx_switch` will be called in `register_displaychangelistener` or will be
called by QEMU displays.

### What about together?

Let's review the history of graphic devices.

+ 1st gen VGA Card: output images but leave all calculations to CPU
+ 2nd gen Graphics Card: integrate image output and processing
+ 3rd gen Video Card: take over the video coding-encoding from CPU
+ 4th gen 3D Accelerator Card: take over the 3D Accelerator from a special 3D card
+ 5th gen GPU: integrate more generic calculation tasks

Basically, a video device will process and output images.  In QEMU,
periodically, `graphic_hw_update` will be called switching from QEMU displays to
QEMU video devices. The devices will process the image and then call
`dpy_gfx_update` to inform the changes to QEMU displays.

[^1]: [Graphics in QEMU](https://www.kraxel.org/slides/qemu-gfx/)