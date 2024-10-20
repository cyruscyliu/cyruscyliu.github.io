# Tech notes on 20240508

+ [Exploring Linux's New Random Kmalloc Caches](https://sam4k.com/exploring-linux-random-kmalloc-caches/)
    + Strategic defense: mitigate entirely, make it as hard as possible -> bespoke approach for each bug
    + 16 caches for a size are still limited since it does not touch the page_allocator.
+ [Your NVMe Had Been Syz’ed: Fuzzing NVMe-oF/TCP Driver for Linux with
Syzkaller](https://www.cyberark.com/resources/threat-research-blog/your-nvme-had-been-syzed-fuzzing-nvme-of-tcp-driver-for-linux-with-syzkaller)
    + Remote KCOV is supported by kcov_remote_start()/kcov_remote_stop().
    + This blog shows how to pass the REMOTE_HANDLE to a new subsystem.
+ [Programmable System Call Security with eBPF](https://arxiv.org/pdf/2302.10366)
    + Syscall filter -> Least priviliedge
    + BPF: Bytecode v.s. JIT
    + Seccomp-BPF (cBPF) -> Seccomp-eBPF (eBPF)
+ [sysfilter: Automated System Call Filtering for Commodity Software](https://www.usenix.org/system/files/raid20-demarinis.pdf)
    + Invoke seccomp directly (sandboxing) v.s. Inject seccomp via patch-elf (sandboxed)
+ [SafeFetch: Practical Double-Fetch Protection with Kernel-Fetch Caching](https://www.usenix.org/system/files/sec24fall-prepub-1439-duta.pdf)
    + [Zero copy](https://en.wikipedia.org/wiki/Zero-copy)
    + Fetch-side cache v.s. Write-side cache (Midas)
+ [Python Garbage Collector](https://devguide.python.org/internals/garbage-collector/)
    + Reference count, mark-and-sweep
+ [Stack Unwinding](https://www.ibm.com/docs/en/zos/2.4.0?topic=only-stack-unwinding-c)
    + When an exception is thrown and control passes from a try block to a
    handler, the C++ run time calls destructors for all automatic objects
    constructed since the beginning of the try block.  This process is called
    stack unwinding.
    + If during stack unwinding a destructor throws an exception and that
    exception is not handled, the terminate() function is called.
+ [The Magic Behind Python Generator Functions](https://hackernoon.com/the-magic-behind-python-generator-functions-bc8eeea54220)
    + Python stack frames are not allocated on stack memory. Instead, they are
    allocated on heap memory. What this essentially means is that python stack
    frames can outlive their respective function calls.
+ [setjmp/longjmp](http://groups.di.unipi.it/~nids/docs/longjump_try_trow_catch.html)
    + setjmp and longjmp mechanism works as follows: when setjmp is invoked the
    first time it returns 0 and fill the jmp_buf structure with the calling
    environment and the signal mask. The calling environment represents the
    state of registers and the point in the code where the function was called.
    When longjmp is called the state saved in the jmp_buf variable is copied
    back in the processor and computation starts over from the return point of
    setjmp function but the returned value is the one passed as second argument
    to longjmp function.
+ [SoK: On the Analysis of Web Browser Security](https://arxiv.org/pdf/2112.15561)
+ Some staff related to KVM: Linux Kernel's KVM for x86_64 includes kvm.o,
kvm_intel.o, and kvm_amd.o.
+ Ways to pass data from Linux Kernel to user space: procfs (maps kernel
variable to usespace, mostly readonly), sysctl (/proc/sys, readable/writeable),
sysfs (/sys, driver-specific), netlink (socket, net-tools->procfs deprecated,
iproute2->netlink, sota), uio (map physical address and interrupts), ioctl,
[mmap](https://stackoverflow.com/questions/10760479/how-to-mmap-a-linux-kernel-buffer-to-user-space),
debugfs (very easy to use and very recommanded).