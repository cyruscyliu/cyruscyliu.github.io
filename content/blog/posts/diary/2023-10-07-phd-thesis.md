---
date: 2023-10-07
categories:
    - diary
---

# Ph.D. Thesis

Please download [my thesis](zjuthesis-20231007.pdf) and [slides](PhD-Defense.pdf).

<!-- more -->

The Internet of Things (IoT) is widely used in our daily life. Among them,
Linux-based IoT devices are the most prevalent and of high security risks, and
thus their security needs to be analyzed and strengthened urgently. Since
hardware is not always available, not scalable, and hard to debug,
virtualization technology is required to rehost Linux-based IoT devices on
virtual execution environment (VEE). Virtualization for Linux-based IoT devices
has two objectives.  First, keep the fidelity of the VEE, that is, the VEE
should be as close as possible to the physical Linux-based IoT device; second,
keep the security of the VEE, that is, each virtual Linux-based IoT device
should be well isolated. Since Linux-based IoT devices consist of multiple
complicated peripherals, i.e., Linux-based peripherals, virtual Linux-based
peripherals become the main component and the biggest attack surface of the
VEE.  Therefore, to realize the two objectives, focusing on the Linux-based
peripherals, we propose two new technologies, respectively, 1) model-guided
kernel execution, which ensures the fidelity of the whole VEE by constructing
high-fidelity virtual Linux-based peripherals; 2) dependency-aware message
model, which maintains the security of the whole VEE by fuzzing virtual
Linux-based peripherals.

First, we propose a new technique named model-guided kernel execution to keep
the fidelity of the VEE. This technique builds state machines with Linux
subsystems and extracts state transition conditions from the corresponding
low-level drivers, addressing the problem that existing technologies cannot
rehost Linux-based IoT device kernels. Evaluations show that the prototype
FirmGuide generates 9 fully functional Type-I virtual peripherals and 64
minimally functional Type-II virtual peripherals, supporting 26 System on
Chips; successfully rehosts over 95% of the Linux-based IoT device kernels,
covering two architectures and 22 kernel versions.

Second, we propose a new technique named dependency-aware message model and
design a virtual peripheral fuzzing framework to keep the security of the VEE.
We model the input dependencies to the virtual peripherals as intra-message and
inter-message dependencies. The framework extracts the intra-message
dependencies from the virtual peripheral source code and learns the
inter-message dependencies by three new mutators, addressing the problem that
existing virtual peripheral fuzzers are low efficient due to the input
dependencies. Evaluations show that the prototype ViDeZZo is both scalable,
covering two hypervisors, four architectures, five device classes, and 28
virtual devices and efficient, achieving competitive code coverage faster
compared to previous work. ViDeZZo reproduced 24 reported bugs and discovered 28
new bugs. We also provided seven patches merged into the hypervisor mainstream.

Through the above two novel methods, this paper finally realizes a high-fidelity
and high-security VEE to analyze and mine vulnerabilities for Linux-based IoT
devices, which helps with the further development and application of Linux IoT
device security research.

Please download [my thesis](zjuthesis-20231007.pdf) and [slides](PhD-Defense.pdf).

To whom it may concern, if you feel that Chapter 3/4 are not easy to follow,
since they are translated from two individual papers
[FirmGuide](../../../papers/firmguide-ase21.pdf) and [ViDeZZo](../../../papers/videzzo-sp23.pdf),
please read the original ones.
