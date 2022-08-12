# Code Skills for Research

We'd like to see a novel idea along with cost-effective implementation. This
means we should follow an enough and quick coding philosophy. Besides, I
introduce instructions to learn to code at the end of this article.

## Enough and quick

System research takes time. We need to understand how an unfamiliar system work,
try it, re-understand, re-try, and so on. Usually, we need to interact with
hardware, which sounds hard and is tough.

We need to be enough and quick. We want to develop a tool or something similar
that has enough functionality and finish it in time. In this way, we can pass
the artifact evaluation, and beat other quick and dirty projects.

I have proposed several strategies to achieve this.

### Enough functionality

Think about the least set of functionalities we want and list there. This
includes not only the core functionalities but also the functionalities to make
sure this tool is easy to use, debug, and evaluate.

### Quick development

+ First, we need to control lines of code (LoC) a student contribute. We want a
student to code for around two months. If the code space seems larger, we should
invite more students to join us. As we split tasks into a group of students,
each one should share any tricks and tweaks used in the implementation.

+ Second, we need to control the number of bugs. The trick is to build the
smallest SDK with limited but enough unit tests. We then build upper
applications where the changes should usually happen. Keep in mind to move
commonly used code in the applications to the SDK and don't code too much in
rapid changing applications.

+ Third, we need to follow a fixed coding routine and update it as time goes. 
For example, we should have a meeting at the beginning, onboard the new member,
create `project-xxx` to hold all code related to the same project, create
`evaluation` for evaluation, and so on.

## Train ourselves in coding

Based on my personal experience, the coding skills have three levels.

+ Level 1, knowledge in computer science courses
+ Level 2, project management
+ Level 3, new techniques and vision

### Level 1

Be familiar with theories and design decisions in computing systems.

Students who major in computer science and technology (in general) have to take
the following courses. Videos are available on the internet.

+ Programming Language
+ Data Structure and Algorithm
+ Architecture and Computation System
+ Network
+ Operating System
+ Database

To go future, a student can choose the following sources.

+ Advanced Algorithm
+ Computation Theory
+ Compiler
+ Information Security
+ Distributed Systems

Some mathematics are also recommended.

+ Probability
+ Graph Theory
+ Game Theory

### Level 2

Be familiar with the project management process.

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
    + Refactoring and Design Pattern
    + Debug and Patch
+ Discussion: Issue, Mailing-list, and Forum
+ Package Manager: npm, pip, snap, apt

### Level 3

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

Going further, we can follow a list to learn their code spaces.

+ User Application: QT, Android
+ Web Server: Flask, Django
+ Message Queue: Kafka
+ Container: Docker
+ Operating System: Linux Kernel
+ Virtualization: QEMU