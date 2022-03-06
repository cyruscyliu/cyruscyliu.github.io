# Buildroot, QEMU and Linux kernel for x86_64

Usually, we need a dynamic analysis platform for a Linux kernel for
x86_64. The direct idea is to run a Linux kernel on QEMU. In this post,
I will introduce how to quickly build such a platform with Buildroot.

## Download Buildroot

Please go [here](https://buildroot.org/download.html) to download the
latest Buildroot package and decompress it.

## [Optional] Prepare Kernel Module

Usually, we write a Linux kernel module to test some features.
Leveraging Buildroot, it is quite easy to achieve that. Please refer to
[this
post](https://stackoverflow.com/questions/40307328/how-to-add-a-linux-kernel-driver-module-as-a-buildroot-package)
as the original post. I fixed two typos only. Skip this section if you
don't need a kernel module.

### Create several files like this

``` txt
kernel_module/
├── Config.in
├── Makefile
├── external.desc
├── external.mk
└── hello.c

0 directories, 5 file
```

### Config.in
Note that each line should start with a tab.

``` bash
config BR2_PACKAGE_KERNEL_MODULE
    bool "kernel_module"
    depends on BR2_LINUX_KERNEL
    help
    Linux Kernel Module Cheat.
```

### Makefile

``` Makefile
obj-m += $(addsuffix .o, $(notdir $(basename $(wildcard $(BR2_EXTERNAL_KERNEL_MODULES_PATH)/*.c))))
ccflags-y := -DDEBUG -g -std=gnu99 -Wno-declaration-after-statement

.PHONY: all clean

all:
    $(MAKE) -C '$(LINUX_DIR)' M='$(PWD)' modules

clean:
    $(MAKE) -C '$(LINUX_DIR)' M='$(PWD)' clean
```

### external.desc

Please look at [this](https://buildroot.org/downloads/manual/manual.html#outside-br-custom) for more information.

```
name: KERNEL_MODULES
```

### external.mk

``` Makefile
################################################################################
#
# kernel_module
#
################################################################################

KERNEL_MODULE_VERSION = 1.0
KERNEL_MODULE_SITE = $(BR2_EXTERNAL_KERNEL_MODULES_PATH)
KERNEL_MODULE_SITE_METHOD = local
KERNEL_MODULE_LINUX_LICENSE = GPL-2.0
KERNEL_MODULE_LINUX_LICENSE_FILES = COPYING

$(eval $(kernel-module))
$(eval $(generic-package))
```

### hello.c

``` c
#include <linux/module.h>
#include <linux/kernel.h>

MODULE_LICENSE("GPL");

static int myinit(void)
{
    printk(KERN_INFO "hello init\n");
    return 0;
}

static void myexit(void)
{
    printk(KERN_INFO "hello exit\n");
}

module_init(myinit)
module_exit(myexit)
```

The change is from `BR2_EXTERNAL_KERNEL_MODULE_PATH` to
`BR2_EXTERNAL_KERNEL_MODULES_PATH`.

## Compile Buildroot

The several components are arranged like below.

``` txt
.
├── buildroot-2020.02.8
└── kernel_module
```

1. Go to `buildroot`

2. If no kernel module, just `make qemu_x86_64_defconfig`, otherwise,
`make BR2_EXTERNAL="$(pwd)/../kernel_module" qemu_x86_64_defconfig`

3. Before going on, we should update the C libary and the tty target by
`make menuconfig`.

    + `Toolchain` -> `C library` -> `glibc`
    + `System Configuration` -> `Run a getty (login prompt) after boot`
    -> `TTY port` -> `ttyS0`

    [Optional] We can enable `lspci -v` to show more information on PCI
    devices.

    + `Target Packages` -> `Hardware Handling` -> `pciutils`

    + If any kernel module, `echo 'BR2_PACKAGE_KERNEL_MODULE=y' >>
    .config`

3. `make` with `-jN` to accelerate your compilation.

## Launch all of them

``` bash
qemu-system-x86_64 \
    -M pc \
    -kernel ./output/images/bzImage \
    -drive file=./output/images/rootfs.ext2,if=virtio,format=raw \
    -append "root=/dev/vda console=ttyS0" \
    -net nic,model=virtio -net user \
    -nographic
```

If there exists a Linux kernel module, please do as follow.

``` bash
$ modprobe hello
hello: loading out-of-tree module taints kernel.
hello init
$ desg
...
hello: loading out-of-tree module taints kernel.
hello init
```

## Reference

[buildroot编译运行QEMU
X86_64](https://jgsun.github.io/2020/05/28/qemu-x86-64/) [How to add a
linux kernel driver module as a buildroot
package](https://stackoverflow.com/questions/40307328/how-to-add-a-linux-kernel-driver-module-as-a-buildroot-package)

[cve-2020-14364]: An out-of-bounds read/write access flaw was found in
the USB emulator of the QEMU in versions before 5.2.0. This issue occurs
while processing USB packets from a guest when USBDevice `setup_len`
exceeds its `data_buf[4096]` in the `do_token_in`, `do_token_out`
routines. This flaw allows a guest user to *crash the QEMU process,
resulting in a denial of service, or the potential execution of
arbitrary code with the privileges of the QEMU process on the host*.