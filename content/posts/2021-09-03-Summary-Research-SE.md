# Programming Skills for Research

We'd like to see a novel idea along with solid implementation. To achieve this,
we need specific skills and efficient collaboration due to the time budget (6-12
months/person).

## Specific skills

Based on my personal experience, I think the programming skills can be grouped
into four levels.

+ Level 1, knowledge in computer science courses
+ Level 2, project management
+ Level 3, the coding style for research projects
+ Level 4, new techniques and vision

### Level 1

Be familiar with theories and design decisions in computing systems.

Students who major in computer science and technology (in general) have to take
the following sources.

+ Programming Language
+ Data Structure and Algorithm
+ Architecture and Computation System
+ Network
+ Operating System
+ Database

For students who are from other disciplines, you are encouraged to train
yourself in the courses above. You can find videos on the internet.

To go future, a student can choose the following sources.

+ Advanced Algorithm
+ Computation Theory
+ Compiler
+ Information Security

### Level 2

Be familiar with the problem management process.

We must develop a project, so we have to know each step of the project
management.

+ Requirements Analysis
+ Architecture Design
+ Framework Selection
+ Time/Risk Control
+ Programming
    + Code Style
    + README and Documentation
    + Version Control: Pull, Commit, Push or Pull Request
    + Testing and Automation
    + Debug and Patch
+ Discussion: Issue, Mailing-list, and Forum
+ Package Manager: npm, pip

### Level 3

Be familiar with the standard of research code.

Recently, authors of a paper are required to submit an artifact to allow
reviewers to reproduce the evaluation of the study. This motivates reproducible
research but requires quality and usable research code.

#### Quality

First, we need to control the number of bugs. The trick is to build the smallest
SDK with limited but enough unit tests. We then build upper applications where
the changes should usually happen. Keep in mind to move commonly used code in
the applications to the SDK and don't code too much in rapid changing
applications.

#### Usability

Second, we need to ease the evaluation and deployment of the system for the
study. Create `evaluation` and `project-xxx` at the same time with the same
Docker container.

### Level 4

Be curious and a critical thinker.

IT technologies evolve so fast, and we are supposed to make progress at the same
time.

First, we can start to learn existing wheels and their details. For instance, we
can learn how Flask and Django web servers work. We would know the design
choices, their pros/cons, and how to set up a minimum web quickly.

Meanwhile, think about some metrics.

+ CPU utilization
+ Cache optimization
+ Memory consumption
+ Disk consumption

Going further, we can follow a list in the following.

+ User Application: QT, Android
+ Web Server: Flask, Django
+ Message Queue: Kafka
+ Container: Docker
+ Operating System: Linux Kernel
+ Virtualization: QEMU

## Collaboration

TBD

## Time Budget

I found it is risky to miss the submission DDL due to "incomplete coding". The
reasons may be 1) too many and too few requirements, 2) refactoring, 3) dirty
code for a key requirement.

### Too many and too few requirements

Think about the evaluation for the study and how you will sell your work.

### Refactoring

Design careful and don't refactor your code dramatically.

### Dirty code for a key requirement

This part is tricky. Maybe we should code from the most difficult part.