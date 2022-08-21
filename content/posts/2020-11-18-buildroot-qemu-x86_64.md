# Buildroot, QEMU and Linux kernel for x86_64

How to build a minimum Linux kernel with customized rootfs and run it with QEMU?

## Download Buildroot

Please go [here](https://buildroot.org/download.html) to download the latest
Buildroot package and decompress it.

## Add new external packages (user-space program and kernel module) (optional)

We want to write an external user space program or install an external kernel
module to test some features, e.g., to reproducing a bug. I refer to
[this](https://buildroot.org/downloads/manual/manual.html#adding-packages) and
[this]
(https://stackoverflow.com/questions/40307328/how-to-add-a-linux-kernel-driver-module-as-a-buildroot-package)
and summarize here.

Please `git clone https://github.com/cyruscyliu/buildroot-external-packages.git`.

## Compile Buildroot

The directory layout is like below.

``` txt
.
├── buildroot-2022.02.4
└── buildroot-external-packages
```

1. Go to `buildroot`

2. If no external packages, just `make qemu_x86_64_defconfig`, otherwise, `make
BR2_EXTERNAL="$(pwd)/../buildroot-external-packages" qemu_x86_64_defconfig`

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
    -kernel ./output/images/bzImage \
    -drive file=./output/images/rootfs.ext2,if=virtio,format=raw \
    -append "root=/dev/vda console=ttyS0" \
    -net nic,model=virtio -net user \
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

## Reference

[buildroot编译运行QEMU X86_64](https://jgsun.github.io/2020/05/28/qemu-x86-64/) 

[How to add a linux kernel driver module as a buildroot
package](https://stackoverflow.com/questions/40307328/how-to-add-a-linux-kernel-driver-module-as-a-buildroot-package)

[cve-2020-14364]: An out-of-bounds read/write access flaw was found in
the USB emulator of the QEMU in versions before 5.2.0. This issue occurs
while processing USB packets from a guest when USBDevice `setup_len`
exceeds its `data_buf[4096]` in the `do_token_in`, `do_token_out`
routines. This flaw allows a guest user to *crash the QEMU process,
resulting in a denial of service, or the potential execution of
arbitrary code with the privileges of the QEMU process on the host*.