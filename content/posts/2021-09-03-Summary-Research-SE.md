# Coding for [System|Software] (Security) Research

Solid implementation in limited time makes us competitive in research.

- Artifact evaluation is introduced to overcome the "reproducibility issue".
- The security community is third times than five years ago.

System security research needs solid implementation. To pass the artifact
evaluation, we would better spend more time to improve the usability. Quick and
dirty implementation saves time but has lower usability and thus the time is not
saved at all. Why not considered the usability in the beginning of the
development? We are also encouraged to open source our tools, which requires a
higher quality implementation with lower number of flaws in our tools.

System security research takes time. We need to understand how an unfamiliar
low-level software or hardware work, try it, re-understand, re-try, and so on.
In half of our time, we are compiling things and during the rest of time, we are
making mistakes.

However, as the community has grown so much, we want to get our ideas
implemented as soon as possible. I propose a two-step model. First, we build our
toolbox and implement our idea in a quick and dirty way. This step is for senior
students or junior professors to make sure their ideas work. Second, we follow
an enough and quick coding philosophy, that is to say, to develop a tool with
enough functionality quickly. In this way, we can pass the artifact evaluation
without overengineering, open source our tool directly, and save time.


### Toolbox

- Fuzzing
- Static program anlysis
- Symbolic execution

### Enough functionality

Think about the least set of functionalities, including not only the core
functionalities but also the functionalities to make sure this tool easy to use,
debug, and evaluate.

### Quick development

Software engineering has many best practices to save time.

#### Design architecture then select framework

The design and the implementation are different. Usually the design shows how to
address a problem and we need to choose the most proper way to implement our
design.

#### Control time and risk

We should avoid overengineering. Young developers are likely overengineering
because they want to apply as many tricks as possible they know and they forget
the time limit. Design pattern is what we can try but to address some issues
rather than to show off. If we try to avoid overengineering and the
implementation still seems complex, we should invite more collaborators. For any
other uncertain staff, make backup plans.

#### Add README

#### Use a version control tool

Use git or any other tools. Don't copy and paste or use suffix like xxx-v1.0.

#### Follow reasonable patching process

#### Use issue/mailinglist/forum to discuss

#### Follow the same code style in one project

#### Add unit tests and enable debugging

This can avoid buggy implementation. Try to build the smallest SDK with limited
but enough unit tests. Then build upper applications that are not stable. Keep
in mind to move commonly used code in the applications to the SDK and don't code
too much in rapidly changing applications.

#### Be more automatic

## Training of coding

### Train ourselves the basics

First, we should review the data structure and algorithm once a year. It's not
necessary to remember the implementation of each algorithm, like the quick sort.
Instead, it's important for us to understand how to design new algorithm and how
to optimize it.

Then, we should learn existing system software/hardware such that we can quickly
rewrite part of it to validate our ideas. It rarely happens but sometimes what
we want is not implemented by anyone else. Our knowledge will help us quickly
create a wheel.

+ Fuzzer: AFL++/libFuzzer/Syzkaller
+ Symbolic execution: KLEE
+ Compiler: LLVM
+ Operating System: Linux Kernel
+ Virtualization: QEMU/VirtualBox

Meanwhile, think about some metrics.

+ CPU utilization
+ Cache optimization
+ Memory consumption
+ Disk consumption

### Make progress as technologies evolve so fast

Solve CTF challenges. I feel some CTF challenges are close to the recent
technologies, e.g., recent attacks, exploitation, and popular software.