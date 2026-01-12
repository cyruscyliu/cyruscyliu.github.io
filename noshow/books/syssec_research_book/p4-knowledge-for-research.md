# Doing Research - Part 4: Build the Knowledge Database

I'd like to build the knowledge database which can be accessed by any system
security scholars, which will save a lot of their time.

<!-- more -->

However, this knowledge database cannot offer creativity.

We must at least know something, something important.

1. Program = Data structure + Algorithm
2. All problems in computer science can be solved by another level of
indirection... Except ... too many layers of indirection.

## Programming Language and Tooling

+ Be familiar with C and Python. Write self-explainable code. Don't use rarely
used advanced features of Python in one project

+ Learn basic C++ and basic bash. Use ChatGPT for quick prototyping and enable
linters, e.g., shellcheck, to remove stupid bugs.

+ Learn Java for object-oriented programming. I suggest that even developing in
Python/C++, apply the best practice of OOP just like coding in Java, which is
simple and easy to understand.

+ Learn how to develop Dockerfile to make your artifact deployable everywhere.
Learn Docker's entrypoint/arguments/environment variables/volumns/capabilities
and run your program in the Docker container all the time.

+ Learn how to develop Json/Yaml to make your configs universal.

+ To compile C/C++, learn how to use gcc/g++/clang/clang++, how to install and
uninstall these compilers, and how to debug any warnings and errors. Learn
update-alternatives to have multiple versions of the tooling. Have gdb-gef
enabled.

+ Learn what is and how to use cross-platform compilers.

+ Enable ASAN or UBSAN to mitigate your C/C++ bugs, or learn Rust.

## (Linux) utilities

+ ls/mv/pwd/cat/echo/mkdir/rm/touch/hexdump
+ cd/pushd/popd
+ cp/rsync/dd
+ vim
+ git
+ sudo/chmod/chown
+ ps/kill/pkill
+ find/grep
+ tree/htop/df/du/timeout/watch/locate/head/tail/diff/ping/history/man
+ tar/zip
+ ssh/scp/rsync
+ screen
+ apt-get/apt-cache
+ source/bash/hash/ldconfig/update-grub
+ file/readelf
+ nm/ldd/objcopy

## Data Structure and Algorithm

Textbook: [Introduction to Algorithms
(4th)](https://dl.ebooksworld.ir/books/Introduction.to.Algorithms.4th.Leiserson.Stein.Rivest.Cormen.MIT.Press.9780262046305.EBooksWorld.ir.pdf)

Textbook: [Hello Algo](https://www.hello-algo.com/en/chapter_hello_algo/)

Training: [Leetcode Top interview 150](https://leetcode.com/studyplan/top-interview-150/)

+ Dynamic sets

    + Operations: Search, Insert, Delete, Minimum, Maximum, Successor,
    Predecessor

    + Data structures: Array (list), Stack (deque), Matrices, Queue (deque),
    Linked List , Rooted tree, Heap (heapq), Hash table

    + Data structure: Binary search tree (Binary tree, Left <= Right, Fast
    lookup/addition/removal)

        + Red-black tree (RB tree)

            + Every node in a RB tree is either red or black, the children of a
            red node are both black, and every simple path from a node to a
            descendant leaf contains the same number of black nodes.  RB trees
            are one of many search-tree schemes that are balanced in order to
            guarantee that basic dynamic-set operations take O(logn) time in the
            worst case.

            + [Rbtress in Linux
            kernel](https://docs.kernel.org/core-api/rbtree.html): RB trees are
            a type of self-balancing binary search tree, used for storing
            sortable key/value data pairs. This differs from radix trees (which
            are used to efficiently store sparse arrays and thus use long
            integer indexes to insert/access/delete nodes) and hash tables
            (which are not kept sorted to be easily traversed in order, and must
            be tuned for a specific size and hash function where rbtrees scale
            gracefully storing arbitrary keys). RB trees are similar to AVL
            trees, but provide faster real-time bounded worst case performance
            for insertion and deletion (at most two rotations and three
            rotations, respectively, to balance the tree), with slightly slower
            (but still O(log n)) lookup time.

        + AVL tree

            + An AVL tree is a binary search tree that is height balanced: for
            each node x, the heights of the left and right subtrees of x differ
            by at most 1.

+ Graph

    + Search, Topological sort, Strong connected components, Minimum spanning
    tree, Shortest paths, Maximum flow, Matching in bipartitie graphs

+ Advanced data structures
    + Augmented RB tree, B-trees, data structures for disjointed sets

+ Sorting algorithms

    + Insertion sort, Merge sort, Heapsort, Quick sort, Counting sort, Radix sort, Bucket sort

+ Searching algorithms

    + Linear search, Breadth-first search, Depth-first search, Binary search,
    Hash search, Tree search

+ Algorithm design and analysis
    + The halting problem over Turing machines
    + Temporal and spatial complexity, Amortized analysis
    + Simulation, Enumeration, Iterative algorithm (e.g., when handling linked
    lists), Divide and conquer (recursive, e.g., when handing binary trees),
    Backtracking algorithm (recursive), Dynamic programming, Greedy algorithms,
    Data structure augment

+ Automata, Regular expression, Context-free grammar

## Architecture and Computation System

+ x86 shits
    + segments
        + segment selector: cs/ds/ss, es/fs/gs, indexing segment descriptor
        + segment descriptor/cache segment descriptor: base, limit
        + segment descriptor table
            + gdt: all processes can access this
            + ldt: a system can have one or multiple ldts; a process can
            exclusively use an LDT or use the ldt shared by multiple processes
            + To quickly access GDT and LDT, gdtr and ldtr are leveraged
        + To demystify
            + gdt: array, gdtr stores where the gdt is
            + ldt: array, ldtr stores where the ldt for the current process is
    + logical address must exist (since x86 cannot disable segments)
        + inside the program, a pointer stores the offset to a segment
        + iirc, ldt is not enabled, gdt is transparent
    + logical address -> linear address -> physical address
        + logical address -> segment selector -> gdt/ldt -> linear address
        + w/o paging, linear address = physical address
        + w/ paging, linear address (virtual address) -> page table -> physical address
    + four modes
        + Real mode: linear address = physical address, 1MB
        + Protect mode: the commonly used mode
        + Virtual 8086 mode, provide a real mode on the protect mode (for compatibility)

+ Be familiar with x86/x86, arm/aarch64, and riscv assembly.
+ Learn ISA extension for security (PAC).
+ Learn processor design and pipelines.
+ Learn cache and cache coherence.
+ Learn magnetic storage and solid-state drive (SSD).
+ Learn PCI/USB/Wi-Fi/BE/BLE/BaseBand controllers.
+ Learn hardware for virtualization (VT-x/VT-d/EPT/SMMU/IOMMU).
+ Learn hardware for security (SGX/TrustZone/TDX/SEV/Realm/HSM/TPM).

## Operating System

+ Learn process management.
+ Learn memory management.
+ Learn file and filesystems
+ Learn access control.
+ Learn hardening techniques.

## Virtualization

VMX = Virtual Machine Extension

### Intel VT-x

+ Trap-and-emulation requires all sensitive instructions to be privilege instructions
+ Challenges
    + Not all sensitive instructions are privilege instructions
    + Cannot trigger an exception to be compatible with existing software
+ Add one more mode
    + VMX Root Operation: when the VMM is running, compatible to existing software
    + VMX Non-Root Operation: when the guest is running
        + All sensitive instructions are re-designed
    + VMM Operations are orthogonal to Ring 0 and 3
+ Specifically
    + vmxon -> VMX Root Operation -> vmlaunch/vmresume -> VM-Entry -> VMX
    Non-Root Operation -> Some sensitive instructions/MMIO/EPT Violation ->
    VM-Exit -> VMX Root Operation -> vmxoff

    + VM-Exit
        + sysenter won't introduce a VM-Exit, even it is a sensitive instruction
        + cpuid must introduce a VM-Exit
        + The behaviors of some sensitive instructions are controlled by VMCS

    + VMCS (Virtual-Machine Control Structure)
        + VMCS is stored in memory, different from the guest memory
        + VMCS and a physical CPU are 1-1 mapping
            + vmptrld addr_of_vmcs/vmcleaer
            + VMCS migration may be not implemented
        + VMCS includes
            + Guest-state area - registers
                + VM-Exit -> save, VM-Entry -> restore
                + Including LDTR
            + Host-state area
                + VM-Exit -> restore
                + Not including LDTR, CS:RIP is where the VM-Exit is handled
            + VM-Entry control field
                + VMM can inject event (exception/external interrupts/NMI)
                into the guest vCPU, say when a DMA operation is completed.
            + VM-Execution control field
                + External-interrupt/Exception bitmap -> VM-Exit?
                + HLT/INVLPG/WBINVD/RDPMC/RDTSC/... -> VM-Exit?
                + Unconditional I/O exiting/Use I/O bigmaps/Use MSR bitmaps -> VM-Exit?
            + VM-Exit control field (seems not interesting)
            + VM-Exit information field
                + Exit reason
                + Exit qualification
                + VM-Exit interrupt information/interrupt error code for
                external interrupts/exceptions, and NMI
                + Guest linear address/instruction length/instruction
                information for the sensitive instruction that triggers the VM-Exit

        + vmread/vmwrite to configure VMCS
    + VT-x requires that the paging must be enabled in Non-Root operation

### EPT

+ GVA -> GPA -> HPA
+ Challenges
    + Shadow page table is very complicated and expensive
+ Add one more hardware: EPT
+ Specifically, given a GVA, 5 queries in total
    + Guest CR3 (GPA) -> EPT TLB -> EPT page table (EPT MMU) -> HPA or EPT Violation (1)
    + GVA + L4 GHA -> L3 GPA or page fault (no VM-Exit) -> HPA or EPT Violation (2)
    + GVA + L3 GHA -> L2 GPA or page fault (no VM-Exit) -> HPA or EPT Violation (3)
    + GVA + L2 GHA -> L1 GPA or page fault (no VM-Exit) -> HPA or EPT Violation (4)
    + GVA + L1 GHA -> GPA or page fault (no VM-Exit) -> HPA or EPT Violation (5)
+ Specifically
    + EPT is configured (enabling and address) in VMCS's VM-Execution control field
+ EPT Violation happens when
    + GPA's address is large
    + Guest is reading a not readable page
    + Guest is writing a not writable page
    + Guest is executing a not executable page

### Nested Virtualization

[Slide 1](https://www.linux-kvm.org/images/3/33/02x03-NestedVirtualization.pdf)
[Paper 1](https://www.usenix.org/legacy/event/osdi10/tech/full_papers/Ben-Yehuda.pdf)

## Computer Networking

+ Learn TCP/UDP programming.

## Database

+ Learn SQL

## Compiler

+ LLVM IR and passes

## Distributed Systems

## Software Security

## Other tools

+ Fuzzer: AFL++/libFuzzer/Syzkaller
+ Symbolic execution: KLEE
+ Compiler: LLVM
+ Operating System: Linux Kernel
+ Virtualization: QEMU/VirtualBox

## Think about some metrics

+ CPU utilization
+ Cache optimization
+ Memory consumption
+ Disk consumption
