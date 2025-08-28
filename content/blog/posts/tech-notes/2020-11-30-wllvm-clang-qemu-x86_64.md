---
date: 2020-11-30
categories:
    - tech-notes
---

# Clang, wllvm, passes, QEMU/Linux kernel for x86_64

Building QEMU/Linux kernel with Clang enables running LLVM passes on these code
and performing static analysis. One option is to run the passes during the
compilation, the other is to run the passes (opt) on an generated LLVM bitcode
file (wllvm).

This blog is planning to show both, but with limited time bugdet, I will first
explain how to run the passes on the generated bitcode files.

## Build QEMU with Clang

``` bash
$ clang --version
Ubuntu clang version 14.0.0-1ubuntu1.1
Target: x86_64-pc-linux-gnu
Thread model: posix
InstalledDir: /usr/bin

$ cd qemu
$ cat VERSION
8.2.50
$ ./configure --target-list=x86_64-softmmu --cc=clang
$ make
```

## Build Linux kernel with Clang

[Offical Documentation](https://docs.kernel.org/kbuild/llvm.html)

## Build QEMU with wllvm

```
$ pip install wllvm

$ export LLVM_COMPILER=clang
$ # if no clang/clang++/llvm-link/llvm-ar executables
$ # export LLVM_CC_NAME=clang-14
$ # export LLVM_CXX_NAME=clang++-14
$ # export LLVM_LINK_NAME=llvm-link-14
$ # export LLVM_AR_NAME=llvm-ar-14
$ cd qemu-4.0.0
$ ./configure --target-list=x86_64-softmmu --cc=wllvm
$ make
$ extract-bc build/qemu-system-x86_64
$ # You will find the bitcode file build/qemu-system-x86_64.bc
```

I met one kind of warnings `WARNING:Did not recognize the compiler flag
"-mcx16"`, but it seemed harmless. I will update more if any flaw caused by this
warning. I met another error `objcopy: src/xxx: failed to find link section for
section xx`.  Please update your objcopy to 2.31 or upper.

## Build Linux kernel with wllvm

``` bash
#!/bin/bash -x

# python3 -m pip install wllvm
# assume clang/llvm 14

LINUX_TAG=$1

if ! test -d linux-$LINUX_TAG ; then
    git clone --depth 1 --branch v$LINUX_TAG \
        git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git \
        linux-$LINUX_TAG
fi

export LLVM_COMPILER=clang
export LLVM_CC_NAME=clang-14
export LLVM_CXX_NAME=clang-14
export LLVM_LINK_NAME=llvm-link-14
export LLVM_AR_NAME=llvm-ar-14

pushd linux-$LINUX_TAG
make HOSTCC=wllvm CC=wllvm x86_64_defconfig
make HOSTCC=wllvm CC=wllvm -j20
extract-bc vmlinux
popd
```
## Run LLVM passes with opt

First, try a builtin pass on `PLACEHOLDER.bc` (either vmlinux.bc or
qemu-system-x86_64.bc). LLVM has a new pass manager but the documentation of opt
is outdated. Please check
[this](https://llvm.org/docs/NewPassManager.html#invoking-opt) for more
information.

``` bash
opt-14 -passes='instcount' PLACEHOLDER.bc -o /dev/null 2>&1 -debug-pass-manager
```

Second, develop your own LLVM pass and load it with opt.

I usually use [llvm-tutor](https://github.com/banach-space/llvm-tutor) to
quickly develop external LLVM passes.

``` bash
$ # install llvm-17
$ export LLVM_DIR=/usr/lib/llvm-17
$ mkdir build
$ cd build
$ cmake -DLT_LLVM_INSTALL_DIR=$LLVM_DIR /path/to/llvm-tutor/HelloWorld/
$ make
$ # run this LLVM pass
$ $LLVM_DIR/bin/opt \
    -load-pass-plugin ./libHelloWorld.so -passes=hello-world -disable-output \
    PLACEHOLDER.bc
```

## Debug LLVM passes

https://releases.llvm.org/1.5/docs/WritingAnLLVMPass.html#debughints
