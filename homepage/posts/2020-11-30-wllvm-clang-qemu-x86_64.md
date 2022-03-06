# Clang, wllvm, passes, QEMU for x86_64

In order to run LLVM passes on QEMU, I need to build QEMU with Clang.
One option is to run the passes during the compilation, the other is to
generate an LLVM bitcode file and apply `opt`. The bitcode file can be
extracted by `wllvm`.  Because I'm gonna conduct static analysis for
seaking vulnerabilities rather than code optimization, I choose `wllvm`
and apply `opt` on my extracted bitcode file.

## Build QEMU with Clang

Even though unsmoothy on the internet[^1][^2][^3],
I just made it on QEMU 4.0.0 with clang-3.8.

``` bash
$ clang --version
clang version 3.8.0-2ubuntu4 (tags/RELEASE_380/final)
Target: x86_64-pc-linux-gnu
Thread model: posix
InstalledDir: /usr/bin

$ cd qemu-4.0.0
$ ./configure --target-list=x86_64-softmmu --cc=clang
$ make
```

Nothing bad happened.

## Build QEMU with wllvm [^4]

```
$ pip install wllvm

$ export LLVM_COMPILER=clang
$ # if no clang/clang++ executables
$ # export LLVM_CC_NAME=clang-7
$ # export LLVM_CXX_NAME=clang++-7
$ cd qemu-4.0.0
$ ./configure --target-list=x86_64-softmmu --cc=wllvm
$ make
$ extract-bc x86_64-softmmu/qemu-system-x86_64
$ # You will find the bitcode file x86_64-softmmu/qemu-system-x86_64.bc
```

I met one kind of warnings `WARNING:Did not recognize the compiler flag
"-mcx16"`, but it seemed harmless. I will update more if any flaw caused
by this warning. I met another error `objcopy: src/xxx: failed to find
link section for section xx`.  Please update your objcopy to 2.31 or
upper.

## Run LLVM passes with opt

First trial of a builin pass.

``` bash
$ opt -print-function qemu-system-x86_64.bc -o /dev/null 2>&1 > output.txt
```

What I want is quite simple: print function names and check arguments,
which reminds me of the first `HelloWorld` pass in
[llvm-tutor](https://github.com/banach-space/llvm-tutor).  I found
`llvm-tutor` used `LLVM 11`, updating so quickly, such that I made a
docker image to compile the pass. BTW, it's OK to use `opt-11` in the
docker image and no need to recompile QEMU.

``` Dockerfile
# Dockerfile
FROM ubuntu:18.04

# Uncomment this and update the sources list if you have network problems
# COPY sources.list /etc/apt/sources.list
RUN apt-get update; apt-get install -y build-essential cmake vim

WORKDIR /root

RUN apt-get install -y sudo wget software-properties-common
RUN wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key | sudo apt-key add -; \
sudo apt-add-repository "deb http://apt.llvm.org/bionic/ llvm-toolchain-bionic-11 main"; \
sudo apt-get update; \
sudo apt-get install -y llvm-11 llvm-11-dev clang-11 llvm-11-tools
```

Then, build the docker.

``` bash
$ docker build . -t qemu-spa:latest
```

Next, compile the `HelloWorld` pass.

``` bash
$ git clone https://github.com/banach-space/llvm-tutor.git
$ ls
Dockerfile  build  llvm-tutor  qemu-4.0.0  qemu-4.0.0.tar.xz  sources.list
$ docker run \
    -v /path/to/llvm-tutor:/root/llvm-tutor \
    -v /path/to/build:/root/build \
    -it qemu-spa:latest /bin/bash
# In the docker image
$ llvm-config-11 --prefix
/usr/lib/llvm-11
$ export LLVM_DIR=/usr/lib/llvm-11
# Change CMAKE requirements to 3.10.2
# in /root/llvm-tutor/HelloWorld/CMakeLists.txt
$ cd build
$ cmake -DLT_LLVM_INSTALL_DIR=$LLVM_DIR /root/llvm-tutor/HelloWorld/
$ make
```

Finally, run the pass with opt

``` bash
# cp qemu-system-x86_64.bc to build
# In the docker image
$ cd build && ls
CMakeCache.txt  CMakeFiles  Makefile  cmake_install.cmake  libHelloWorld.so  qemu-system-x86_64.bc
$ opt-11 \
    -load-pass-plugin ./libHelloWorld.so -passes=hello-world -disable-output \
    qemu-system-x86_64.bc
# Expected output
... too many
(llvm-tutor) Hello from: lockcnt_wake
(llvm-tutor)   number of arguments: 1
(llvm-tutor) Hello from: qemu_lockcnt_dec
(llvm-tutor)   number of arguments: 1
(llvm-tutor) Hello from: qemu_lockcnt_dec_and_lock
(llvm-tutor)   number of arguments: 1
(llvm-tutor) Hello from: qemu_lockcnt_dec_if_lock
(llvm-tutor)   number of arguments: 1
(llvm-tutor) Hello from: qemu_lockcnt_lock
(llvm-tutor)   number of arguments: 1
(llvm-tutor) Hello from: qemu_lockcnt_inc_and_unlock
(llvm-tutor)   number of arguments: 1
(llvm-tutor) Hello from: qemu_lockcnt_unlock
(llvm-tutor)   number of arguments: 1
(llvm-tutor) Hello from: qemu_lockcnt_count
(llvm-tutor)   number of arguments: 1
```

## Reference

[^1]: [Red Hat Bugzilla – Bug 1565766 - qemu failing to build with clang; __atomic_fetch_or_4](https://bugzilla.redhat.com/show_bug.cgi?id=1565766) \
[^2]: [Building QEMU with clang](https://lists.freebsd.org/pipermail/freebsd-emulation/2012-June/009859.html) \
[^3]: [Use Clang to compile Qemu](https://lists.nongnu.org/archive/html/qemu-devel/2011-12/msg02909.html) \
[^4]: [SE4VM Detecting Virtualization Bugs in Virtual Machine Platforms: Dev-Harness](https://kangliuga.github.io/SE4VM/dev-harness.html).
