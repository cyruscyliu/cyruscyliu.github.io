# Knowledge for System Security Research

In this post, I am maintainling a list of what we should know for system
security research based on my experience.

## Programming Language and Tooling

+ Be familiar with C and Python. Don't use many advanced features of Python in
one project, which otherwise introduces difficulty for code reviewers.

+ Learn basic C++ and basic bash. Enable linters, e.g., shellcheck, to remove
stupid bugs and enable ChatGPT for functionality you do not remember.

+ Learn Java for object-oriented programming. I suggest that even developing in
Python/C++, apply the best practice of OOP in Java that is simple and mostly
efficient.

+ Learn how to develop Dockerfile to make your artifact deployable everywhere.
Learn Docker's entrypoint/arguments/environment variables/volumns/capabilities
and run your program in the Docker container all the time.

+ Learn how to develop Json/Yaml to make your configs universal.

+ To compile C/C++, learn how to use gcc/g++/clang/clang++, how to install and
uninstall these compilers, and how to debug any warnings and errors. Learn
update-alternatives to have multiple versions of the tooling.

+ Learn what is cross compilation and how to use relative compilers.

+ [Optional] Considering the memory safety issues of C/C++, learn memory safe
programming language, e.g., Rust.

## (Linux) utilities

+ ls/mv/pwd/cat/echo/mkdir/rm/touch
+ cd/pushd/popd
+ cp/rsync
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

+PRBLM: Necessarily know what problem is going to address  
-PRBLM: Not necessarily know what problem is going to address  
+IMPL: Necessarily know how to implement it  
-IMPL: Not necessarily know how to implement it

## Data Structure and Algorithm

Textbook: [Introduction to Algorithms (4th)](https://dl.ebooksworld.ir/books/Introduction.to.Algorithms.4th.Leiserson.Stein.Rivest.Cormen.MIT.Press.9780262046305.EBooksWorld.ir.pdf)

+ Sorting algorithms (-PRBLM, -IMPL)

    + Insertion sort, Merge sort, Heapsort, Quick sort, Counting sort, Radix sort, Bucket sort

+ Dynamic sets (+PRBLM, -IMPL)

    + Operations: Search, Insert, Delete, Minimum, Maximum, Successor,
    Predecessor

    + Data structures: Array (Fast lookup), Stack, Matrices, Queue, Linked List
    (Fast addition/removal), Rooted tree, Hash table

    + Data structure: Binary search tree (Binary tree, Left <= Right, Fast
    lookup/addition/removal)

        + Red-black tree

            + Every node in a red-black tree is either red or black, the
            children of a red node are both black, and every simple path from a
            node to a descendant leaf contains the same number of black nodes.
            Red-black trees are one of many search-tree schemes that are
            ``balanced'' in order to guarantee that basic dynamic-set operations
            take O(lgn) time in the worst case.

            + [Rbtress in Linux
            kernel](https://docs.kernel.org/core-api/rbtree.html): Red-black
            trees are a type of self-balancing binary search tree, used for
            storing sortable key/value data pairs. This differs from radix trees
            (which are used to efficiently store sparse arrays and thus use long
            integer indexes to insert/access/delete nodes) and hash tables
            (which are not kept sorted to be easily traversed in order, and must
            be tuned for a specific size and hash function where rbtrees scale
            gracefully storing arbitrary keys). Red-black trees are similar to
            AVL trees, but provide faster real-time bounded worst case
            performance for insertion and deletion (at most two rotations and
            three rotations, respectively, to balance the tree), with slightly
            slower (but still O(log n)) lookup time.

        + AVL tree

            + An AVL tree is a binary search tree that is height balanced: for
            each node x, the heights of the left and right subtrees of x differ
            by at most 1.

+ Graph algorithm (+PRBLM, -IMPL)
    + Search, Topological sort, Strong connected components, Minimum spanning
    tree, Shortest paths, Maximum flow, Matching in bipartitie graphs

+ Advanced data structures (-PRBLM, -IMPL)
    + Augmented red-black tree, B-trees, data structures for disjointed sets

+ Algorithm design and analysis
    + Simulation, Recursive algorithms, Enumeration, Iterative algorithm, Divide
    and conquer, Dynamic programming, Greedy algorithms, Amortized analysis,
    Data structure augment

+ Automata, regular expression, context-free grammar, temporal and spatial complexity, the halting problem over Turing machines

## Architecture and Computation System

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

+ Learn CPU virtualization.
+ Learn virtual devices.

## Computer Networking

+ Learn TCP/UDP programming.

## Database

+ Learn SQL

## Compiler

+ LLVM IR and passes

## Software Security
## Distributed Systems
## Probability
## Graph Theory
## Game Theory