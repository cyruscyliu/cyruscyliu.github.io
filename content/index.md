Qiang Liu is a postdoc at EPFL, working with [Prof. Mathias
Payer](https://nebelwelt.net/) in the HexHive laboratory. He earned his Ph.D. in
2023 from Zhejiang University (ZJU) under the guidance of [Prof. Yajin
Zhou](https://yajin.org/) and a B.S. degree from the Beijing Institute of
Technology (BIT) in 2018. His research in cybersecurity focuses on 1) developing
prior-to/after-release security enforcement of software based on our deep
understanding, and 2) building the chain of trust examined by full-chain
exploits. His work has been recognized at all top security conferences: IEEE
SSP, Usenix Security, ACM CCS, and ISOC NDSS. He received the Best Paper Awards
at USENIX Security'24 and ACM RAID'24. He is also serving on the program
committee for IEEE/ACM ASE'25 and USENIX Security'25 and is a reviewer for ACM
CSUR and ACM TOSEM. 

[CV](./Qiang_s_CV.pdf)
[Google Scholar](https://scholar.google.com/citations?user=fa1uB2sAAAAJ&hl=en)

Qiang Liu's journey began with a Capture the Flag (CTF) competition, where he
learned techniques like reverse engineering and exploitation. During his PhD and
PostDoc, Qiang Liu pioneered innovative solutions, including auto-extracted
input dependencies and a generic executor, to significantly strengthen
hypervisor security. These breakthroughs led to the discovery and mitigation of
nearly 100 hypervisor vulnerabilities prior to software release. TBF.

Feel free to [email me](mailto:cyruscyliu@gmail.com) about the following ongoing
projects.

## [system understanding]

I'd like to build the knowledge database of all the computer system to verify
and prototype our idea as quick as possible.

## [statefulness]

Statefulness is not well defined. Previous work has shown that states can be
accumulated, reached, and formalized. However,  interactive and configurable
protocols pose challenges to the definition of state due to overlooked response
packets and to the exploration of state space due to configuration-based
implementation. We are going to demystify statefulness.

Regarding the definition of states: [Tango](https://github.com/HexHive/tango)
([paper](./papers/tango-raid24.pdf), **ACM RAID'24**, Best Paper Award)
first-in-public defines states with code coverage, which scales to different
software.

## [GPU security]

GPUs, new trust base, are part of a collaborative fabric, but isolation is
little considered. Unluckily, the GPU hardware and software ecosystem is highly
complex such as diverse architectures, proprietary drivers, and non-trivial
programming models. How do we protect CPU-GPU-fusion and isolate
multi-tenant/multi-task sharing?

## [interpreter security]

How do we design a more secure interpreter engine?

The good: Reflecta ([paper](./papers/reflecta-asiaccs25.pdf), **AsiaCCS'25**)
leverages reflection to infer the signatures of APIs to 3rd party libraries.

## [hypervisor security]

It is not hard at all to ensure hypervisor security. We have built a platform
with auto-extracted input dependencies and a generic executor for hypervisors,
so we can apply bug-finding (e.g., fuzzing) and mitigation techniques.

Regarding quality input, [ViDeZZo](https://github.com/HexHive/videzzo)
([paper](./papers/videzzo-sp23.pdf), **IEEE SSP'23**) first proposed intra- and
inter-message dependencies, and then [Truman](https://github.com/vul337/Truman)
([paper](./papers/truman-ndss25.pdf),
**ISOC NDSS'25**) highlighted state-dependency. Truman further explained how to
auto-extract intra-/inter-message, and state dependencies from the Linux kernel
via static analysis.

Regarding generic executors,
[HyperPill](https://github.com/HexHive/HyperPill/tree/artifact-evaluation)
([paper](./papers/hyperpill-sec24.pdf), **USENIX Security'24**, Best Paper
Award) first propose a snapshot-based hypervisor dock, capable of running both
open-source and closed-source and both x86 and aarch64 hypervisors.

Other tools

+ [ViDeZZo LLVM Project](https://github.com/cyruscyliu/videzzo-llvm-project)
forked from LLVM Project 13, instrumentation and libFuzzer for ViDeZZo
+ [buildroot-external-packages](https://github.com/cyruscyliu/buildroot-external-packages)
and [virtfuzz-bugs](https://github.com/HexHive/virtfuzz-bugs), PoC

Open projects

- New target: Rust-based hypervisors (e.g., firecracker)
- New tool: Hyper-Cube for 64, HyperPill for Aarch64
- New attacks: race condition, out-of-resources
- Automatic exploit generation: ref
[1](https://www.usenix.org/system/files/woot19-paper_zhao.pdf)


## [firmware rehosting]

We aim to rehost embedded Linux kernels (the Linux kernels used in embedded
devices). [FirmGuide](https://github.com/cyruscyliu/firmguide)
([paper](./papers/firmguide-ase21.pdf), **ASE'21**) first modeled all interrupt
controllers and timers. Then, [ECMO](https://github.com/valour01/ecmo)
([paper](./papers/ecmo-ccs21.pdf), **CCS'21**) supported other peripherals like
NIC via binary rewriting.

Other tools

+ [pyqemulog](https://github.com/cyruscyliu/pyqemulog) is the qemu-log ported to
Python. It converts the structured trace generated by QEMU with -d to JSON.
+ [llbic](https://github.com/cyruscyliu/llbic), short for LLVM Linux
Build Issues Collection, compiles old Linux kernels in LLVM bitcode. It
replaces GCC to clang and adjusts cflags in the command lines to
generate bitcode files, and then links them all together to a `vmlinux.bc`.
+ [openwrt-build-docker](https://github.com/cyruscyliu/openwrt-build-docker)
supports automatically building the OpenWrt project given a target/subtarget of
a specific OpenWrt revision from 10.03 to 19.07.1.

[**android authentication (archived)**]

This project evaluates existing and proposes new implicit continuous
authentication approaches to serve as a second authentication factor alongside
fingerprint and facial identification. I joined this project as an intern and
then proposed part of it as my final project for my bachelor's degree. Relative
research papers are [RiskCog (TMC'20)](./papers/riskcog-tmc20.pdf), [ESPIALCOG
(TMC'20)](./papers/espialcog-tmc20.pdf), [One Cycle Attack
(TIFS'20)](./papers/one-cycle-attack-tifs20.pdf), and [TRAPCOG
(TMC'23))](./papers/trapcog-tmc23.pdf).

