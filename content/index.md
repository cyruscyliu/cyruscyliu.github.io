## About me

[**whoami**] Hi, I am Qiang Liu, currently a postdoc at EPFL with [Prof.  Mathias
Payer](https://nebelwelt.net/). I obtained my Ph.D. in cybersecurity at Zhejiang
University (ZJU) in 2023, advised by [Prof. Yajin Zhou](https://yajin.org/).
Prior to ZJU, I earned my bachelor's degree at Beijing Institute of Technology
(BIT) in 2018. We have published a few papers at all four top-tier security
conferences, IEEE S&P, Usenix Security, ACM CCS, and ISOC NDSS. To engage the
community, we always open-source our tools and evaluation scripts.

[CV](./Qiang_s_CV.pdf)
[Google Scholar](https://scholar.google.com/citations?user=fa1uB2sAAAAJ&hl=en)
[GitHub](https://github.com/cyruscyliu)

[**history**] Cybersecurity remains an arms race where attackers are inherently
at a disadvantage as they must protect against all vulnerabilities while an
attacker only needs to successfully exploit one. Security therefore requires
thinking outside of the box. My journey began with a Capture the Flag (CTF)
cybersecurity competition, where I learned to break systems and software through
techniques like reverse engineering and exploitation. Over the years,
collaborating with my colleagues, we have developed novel and practical designs
to protect systems and software from attacks. Notably, we have designed advanced
fuzz testing techniques to unveil almost a hundred vulnerabilities in
hypervisors before software is released.

[**help**] My research in cybersecurity aims at building a layered secure
computing system, covering browsers, interpreters, network protocols, OS
kernels, hypervisors, and trusted execution environment (TEE), which requires
the research on the automatic vulnerability detection before the release of
software and vulnerability mitigation at runtime. Ultimately, my research aims
to make the computing system hard to break, benefiting not only individuals but
also organizations.

[**mail**] I am willing to discuss and collaborate on any of the [open projects
listed](./projects.md). Feel free to reach out via this long-term email address:
<cyruscyliu@gmail.com>.

## Awards

+ [HyperPill](./papers/hyperpill-sec24.pdf) won the USENIX Security'24 Best Paper Award
+ [Tango](./papers/tango-raid24.pdf) won the ACM RAID'24 Best Paper Award

## Publication and Tools

[**Interpreter Security**]

+ Reflecta, [paper](./papers/reflecta-asiaccs25.pdf), **AsiaCCS'25**,
leveraging reflection to fuzz arbitry interpreters! (focusing on the libraries)

[**Hypervisor Security**]

+ [Truman](https://github.com/vul337/Truman),
[paper](./papers/truman-ndss25.pdf), **ISOC NDSS'25**, automatic inference of
intra-/inter-message, and state dependencies, more coverage of virtio devices,
53 new bugs in QEMU, VirtualBox, VMware Workstation Pro, and Parallels.
+ [HyperPill](https://github.com/HexHive/HyperPill/tree/artifact-evaluation),
[paper](./papers/hyperpill-sec24.pdf), **USENIX Security'24** (Best Paper),
taking a snapshot at VM-Exit, libFuzzer, QEMU, Hyper-V, and macOS Virtualization
Framework, 26 new bugs
+ [ViDeZZo](https://github.com/HexHive/videzzo),
[paper](./papers/videzzo-sp23.pdf), **IEEE S&P'23**, intra- and inter-message
dependencies, libFuzzer, QEMU/VirtualBox, 28 new bugs
+ [ViDeZZo LLVM Project](https://github.com/cyruscyliu/videzzo-llvm-project)
forked from LLVM Project 13, instrumentation and libFuzzer for ViDeZZo
+ [buildroot-external-packages](https://github.com/cyruscyliu/buildroot-external-packages)
and [virtfuzz-bugs](https://github.com/HexHive/virtfuzz-bugs), PoC

[**Network Protocol Fuzzing**]

+ [Tango](https://github.com/HexHive/tango), [paper](./papers/tango-raid24.pdf),
**ACM RAID'24** (Best Paper), abstract state feedback from edge coverage
feedback, supporting targets in ProFuzzBench (except forked-daap).
+ Development of Peach Pits for layer 3 network protocols. As an intern, I
developed several Peach Pits by reading the specifications of specific network
protocols.

[**Firmware Rehosting**]

+ [ECMO](https://github.com/valour01/ecmo) (**CCS'21**) takes a firmware image
as input, and it can successfully rehost the Linux kernel inside the image to
get the shell. Due to the variety of peripherals in embedded firmware images,
it is rather hard to build a general emulator that supports all kinds of
machines. The basic idea of ECMO is to transplant the peripherals by support
ones into the target Linux kernel, hence solve the problem of peripheral
variety.
+ [FirmGuide](https://github.com/cyruscyliu/firmguide) (**ASE'21**) creates a
QEMU virtual machine for a Linux-based embedded system, especially boosting the
capability of dynamic analysis of the corresponding Linux kernel. In the
emulator, you can debug, trace, and test the Linux kernel to collect runtime
information to understand vulnerabilities, PoCs, root causes of
crashes in the Linux kernel. FirmGuide is an effectively complementary to
Firmadyne that focuses on user space programs - FirmGuide focuses on the Linux
kernel.
+ [pyqemulog](https://github.com/cyruscyliu/pyqemulog) is the qemu-log ported to
Python. It converts the structured trace generated by QEMU with -d to JSON.
+ [llbic](https://github.com/cyruscyliu/llbic), short for LLVM Linux
Build Issues Collection, compiles old Linux kernels in LLVM bitcode. It
replaces GCC to clang and adjusts cflags in the command lines to
generate bitcode files, and then links them all together to a `vmlinux.bc`.
+ [openwrt-build-docker](https://github.com/cyruscyliu/openwrt-build-docker)
supports automatically building the OpenWrt project given a target/subtarget of
a specific OpenWrt revision from 10.03 to 19.07.1.

[**Android Authentication (Archived)**]

This project evaluates existing and proposes new implicit continuous
authentication approaches to serve as a second authentication factor alongside
fingerprint and facial identification. I joined this project as an intern and
then proposed this project as my final project for my bachelor's degree.
Relative research papers are [RiskCog (TMC'20)](./papers/riskcog-tmc20.pdf),
[ESPIALCOG (TMC'20)](./papers/espialcog-tmc20.pdf), [One Cycle Attack
(TIFS'20)](./papers/one-cycle-attack-tifs20.pdf), and [TRAPCOG
(TMC'23))](./papers/trapcog-tmc23.pdf).

