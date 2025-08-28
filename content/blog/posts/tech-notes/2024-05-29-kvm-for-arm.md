---
date: 2024-05-29
categories:
    - tech-notes
---

# [KVM/ARM](https://dl.acm.org/doi/pdf/10.1145/2644865.2541946)

+ Why KVM for ARM? Easy to have a hypervisor enabled for every SoC.
+ Security monitor cannot support trap-and-emulate. Hypervisor mode was
then introduced as a trap-and-emulate mechanism to support virtualization in
the non-secure world
    + To run VMs, the hypervisor must at least partially reside in Hyp mode.
    + From kernel mode: the hypervisor can configure the hardware to trap
    from kernel mode into hypervisor mode on various sensitive instructions and
    hardware interrupts.
    + From user mode: can trap into kernel mode or hyp mode directly. The ARM
    architecture allows each trap to be configured to trap directly into a VM’s
    kernel mode instead of going through Hyp mode. For example, traps caused by
    system calls or page faults from user mode can be configured to trap to a
    VM’s kernel mode directly so that they are handled by the guest OS without
    intervention of the hypervisor.  This avoids going to Hyp mode on each
    system call or page fault, reducing virtualization overhead. Additionally,
    all traps into Hyp mode can be disabled and a single non-virtualized kernel
    can run in kernel mode and have complete control of the system.
    + Has less control registers to use and share no page tables with host user
    space programs  (but share page tables with the host kernel)
+ Memory virtualization
    + Stage-2 page tables, which translate from Intermediate Physical
    Addresses (IPAs), also known as guest physical addresses, to physical
    addresses (PAs), also known as host physical addresses.  Stage-2
    translation can be completely disabled and enabled from Hyp mode.
    Stage-2 page tables use ARM’s new LPAE page table format, with subtle
    differences from the page tables used by kernel mode.
+ Comparison to x86
    + Hyp mode, which is a separate and strictly more privileged CPU mode
    than previous user and kernel modes. In contrast, Intel has root and
    non-root mode, which are orthogonal to the CPU protection modes. A
    crucial difference between the two hardware designs is that Intel’s root
    mode supports the same full range of user and kernel mode functionality
    as its non-root mode, whereas ARM’s Hyp mode is a strictly different CPU
    mode with its own set of features. A hypervisor using ARM’s Hyp mode
    has an arguably simpler set of features to use than the more complex
    options available with Intel’s root mode.
    + No VMCS that is automatically saved and restored when switching to and
    from root mode. In contrast, any state that needs to be saved and
    restored must be done explicitly in software, which is flexible and
    potentially faster if no additional state to save.
    + ARM and Intel are quite similar in their support for virtualizing
    physical memory.
+ (split-mode virtualization) the lowvisor and the highvisor
    + Lowvisor
        + (Setup) First, the lowvisor sets up the correct execution context by
        appropriate configuration of the hardware, and enforces protection
        and isolation between different execution contexts.
        + (World Switch) Second, the lowvisor switches from a VM execution
        context to the host execution context and vice-versa. The host
        execution context is used to run the hypervisor and the host Linux
        kernel.
        + (Limited trap handlers) Third, the lowvisor provides a
        virtualization trap handler, which handles interrupts and exceptions
        that must trap to the hypervisor.
    + Highvisor implements other functionalitys like handling Stage-2 page
    faults from the VM and performing instruction emulation
    + (Double-traps) A trap to the highvisor while running the VM will first
    trap to the lowvisor running in Hyp mode (from user/kernel). The lowvisor
    will then cause another trap to run the highvisor. Similarly, going from the
    highvisor to a VM requires trapping from kernel mode to Hyp mode, and then
    switching to the VM (to user/kernel). Hyp mode is not bypassed.
    + (Identy mapping) 1) the Hyp mode cannot reuse kernel's paga table because
    Hyp mode uses a different page table format, 2) the highvisor explicitly
    manages the Hyp mode page tables to map any code executed in Hyp mode and
    any data structures shared between the highvisor and the lowvisor to the
    same virtual addresses in Hyp mode and in kernel mode.
+ CPU virtualization
    + Not trapping
        + Set of Stage-1 page table base register
        in most guest OSes.
    + Hyp Mode -> VM World
        + (1) store all host GP registers on the Hyp stack
        + (2) configure the VGIC for the VM
        + (3) configure the timers for the VM
        + (4) save all host-specific configuration registers onto the Hyp stack
        + (5) load the VM’s configuration registers onto the hardware, which can be done without affecting current execution, because Hyp mode uses its own configuration registers, separate from the host state
        + (6) configure Hyp mode to trap floating-point operations for lazy
        context switching, trap interrupts, trap CPU halt instructions
        (WFI/WFE), trap SMC instructions, trap specific configuration register
        accesses, and trap debug register accesses
        + (7) write VM-specific IDs into shadow ID registers
        + (8) set the Stage-2 page table base register (VTTBR) and enable
        Stage-2 address translation
        + (9) restore all guest GP registers
        + (10) trap into either user or kernel mode
    + VM World -> Hyp Mode -(123456789)-> Kernel Mode
        + (0) trap to Hyp Mode due to a Stage-2 page fault, or a hardware interrupt
        + (1) store all VM GP registers
        + (2) disable Stage-2 translation
        + (3) configure Hyp mode to not trap any register access or instructions
        + (4) save all VM-specific configuration registers
        + (5) load the host’s configuration registers onto the hardware
        + (6) configure the timers for the host
        + (7) save VM-specific VGIC state
        + (8) restore all host GP registers,
        + (9) trap into kernel mode
+ Memory virtualization
    + (stage-2 translation) stage-2 translation can only be configured in
    hypervisor mode, and accesses not allowed will cause stage-2 page faults
    which trap to the hypervisor (although both the highvisor and VMs share the
    same CPU modes). Stage-2 translation is disabled in the non-VM world (when
    running in the highvisor and lowviser), and is enabled when in the VM world.
    + (stage-2 page table) KVM/ARM handles Stage-2 page faults by considering
    the IPA of the fault, and if that address belongs to normal memory in the VM
    memory map, KVM/ARM allocates a page for the VM by simply calling an
    existing kernel function, such as get_user_pages, and maps the allocated
    page to the VM in the Stage-2 page tables.
+ I/O virtualization
    + (virtual devices) QEMU and Virtio virtual devices in host userspace
    + (interfaces) load/restore to MMIO device regions, no in/out
    + (enforcement) Except the passthroughed devices, KVM/ARM uses stage-2
    translations to ensure that physical devices cannot be accessed directly
    from VMs. Any access outside of RAM regions allocated for the VM will trap
    to the hypervisor, which can route the access to a specific emulated device
    in QEMU based on the fault address.
+ Key ideas of nested virtualization
    + Guest Hypervisor runs in vEL2 that is in EL1
        + ARMv8.3 supports to trap EL2 operations/eret to EL2 from vEL2
    + Virtual exceptions are enforced by
        + trapping to Host hypervisor (EL2) first and then farwarding the
        exception to Guest Hypervisor
    + The virtual second-stage page tables are software-implemented shadow pages
    + Exit Multiplication Problem: Guest Hypervisor has to access EL1 registers
    and EL2 registers that all traps -> [NEVE](https://dl.acm.org/doi/pdf/10.1145/3132747.3132754)
        + access EL1 registers -> access memory: similar to VMCS
        + access EL2 registers -> redirect to EL1 registers
        + 5 times faster
    + Good images: https://developer.arm.com/documentation/102142/0100/Nested-virtualization

+ It seems the split-mode lowvisor/highvisor thing has been deprecated. Now,
Linux kernel supports nVHE/hVHE/VHE.
    + nVHE and VHE: KVM/arm64 supports different execution modes depending on
    the availability of certain CPU features, namely, the Virtualization Host
    Extensions (VHE) (ARMv8.1 and later). In one of those modes, commonly known
    as the non-VHE mode, the hypervisor code is split out of the kernel image
    during boot and installed at EL2, whereas the kernel itself runs at EL1.
    Although part of the Linux codebase, the EL2 component of KVM is a small
    component in charge of the switch between multiple EL1s.  The hypervisor
    component is compiled with Linux, but resides in a separate, dedicated
    memory section of the vmlinux image.

    + And for nVHE, there is a protected mode enabled by kvm-arm.mode=protected.
    nVHE-based mode with support for guests whose state is kept private from the
    host. Not valid if the kernel is running in EL2.

    + hVHE: enable VHE for split hypervisor mode
