# Buildroot, QEMU and Linux kernel for x86_64

How to build a minimum Linux kernel with customized rootfs and run it with QEMU?

## Download Buildroot

Please go [here](https://buildroot.org/download.html) to download the latest
Buildroot package and decompress it.

## Add new external packages (user-space program and kernel module) (optional)

To write an external user space program or install an external kernel module to
validate your idea, e.g., to reproducing a bug, I refer to
[this](https://buildroot.org/downloads/manual/manual.html#adding-packages) and
[this](https://stackoverflow.com/questions/40307328/how-to-add-a-linux-kernel-driver-module-as-a-buildroot-package).

I have created a repo with support of the external user space program and kernel
module. Please `git clone
https://github.com/cyruscyliu/buildroot-external-packages.git`.

## Compile Buildroot

The directory layout is like below.

``` txt
.
├── buildroot-2022.02.4
└── buildroot-external-packages
```

1. Go to `buildroot`

2. If no external packages, just `make qemu_x86_64_defconfig`, otherwise, `make
BR2_EXTERNAL="$(pwd)/../buildroot-external-packages" qemu_x86_64_defconfig`. If there is an old config,
`make oldconfig` or `make BR2_EXTERNAL="$(pwd)/../buildroot-external-packages" oldconfig`.

3. Before going on, we should update the C library and the TTY target by `make
menuconfig`.

    + `Toolchain` -> `C library` -> `glibc`
    + `System Configuration` -> `Run a getty (login prompt) after boot`
    -> `TTY port` -> `ttyS0`

    We can optionally enable `lspci -v` to show more information on PCI devices.

    + `Target Packages` -> `Hardware Handling` -> `pciutils`

    We can optionally enable the external packages.

    + `External options` -> check what you want

3. `make` with `-jN` to accelerate your compilation.

## Launch all of them

``` bash
qemu-system-x86_64 \
    -M pc \
    -kernel ./path/to/bzImage \
    -drive file=./path/to/rootfs.ext2,if=virtio,format=raw \
    -append "root=/dev/vda console=ttyS0" \
    -net user,hostfwd=tcp:127.0.0.1:3333-:22 \
    -net nic,model=virtio \
    -nographic
```

If the external packages exist, please do as follows.

``` bash
$ modprobe hello
hello: loading out-of-tree module taints kernel.
hello init
$ desg
...
hello: loading out-of-tree module taints kernel.
hello init
$ userspace_program 
Hello World!
```