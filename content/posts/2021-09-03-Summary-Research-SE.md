# Coding for Research

Solid implementation in limited time makes us competitive in research.

- Artifact evaluation is introduced to overcome the "reproducibility issue".
- The security community is third times than five years ago.

System research needs solid implementation. To pass the artifact evaluation, we
would better spend more time to improve the usability. Quick and dirty
implementation saves time but has lower usability and thus the time is not saved
at al.  Why not considered the usability in the beginning of the development? We
are also encouraged to open source our tools, which requires a higher quality
implementatio with lower number of flaws in our tools.

System research takes time. We need to understand how an unfamiliar system
software or hardware work, try it, re-understand, re-try, and so on. In half of
your time, we are compiling things and during the rest of time, we are making
mistakes.

However, as the community has grown so much, we want to get our ideas
implemented as soon as possible. I propose a two-step model. First, we build our
toolbox and implement our idea in a quick and dirty way. This step is for senior
students or junior professors to make sure our ideas work. Second, we take a
enough and quick coding philosophy that indicates us to develop an algorithm or
tool with enough functionality and low complexity. In this way, we can pass the
artifact evaluation without overengineering, open source our tool directly, and
save time. This step is for everyone who is doing the project.

### Enough functionality

Think about the least set of functionalities we want and list there, including
not only the core functionalities but also the functionalities to make sure this
tool is easy to use, debug, and evaluate.

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

Based on my personal experience, the coding skills have two levels.

+ Level 1, project management
+ Level 2, new techniques and vision

### Level 1

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

### Level 2

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