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

## Data Structure and Algorithm

+ Be familiar with Stack, Queue, Tree, and Graph.
+ Learn HashMap and Bitmap.
+ Learn automata and context-free grammar.
+ Learn temporal and spatial complexity.
+ Learn the halting problem over Turing machines.

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