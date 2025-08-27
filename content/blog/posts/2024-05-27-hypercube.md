---
date: 2024-05-27
---

# Notes about HyperCubeOS for x86_64

There are some notes when I update
[HyperCubeOS](https://github.com/RUB-SysSec/Hypercube) to support x86_64.

Key conclusion: 1) boot the HyperCubeOS for x86_64 to long mode with Limine, 2)
enable the identity mapped paging, 2) set up exception/interrupt handlers.

## Boostrapping

Overall, HyperCubeOS (which is in fact an ELF) is bootstrapped by a bootloader
(e.g., [GRUB2](https://www.gnu.org/software/grub/)).

Bootstrapping is way too arch-specific. It is just painful to revisit
x86/x86_64's ISAs. Here is a short summary of different CPU modes.

+ System Management Mode -> Real mode -> Protected Mode <-> Virtual 8086 Mode
+ Protected Mode <-> Long Mode (64-bit Mode <-> Compatibility Mode)
+ Virtual 8086 Mode is designed to run real mode program
+ Protected mode cannot support 64-bit OS
+ Long mode can support both 64-bit (64-bit mode) and 32-bit (compatibility
mode) userspace applications
+ In the long mode, registers are 64-bit
+ The long mode has 16 general purpose registers to use (while aarch64 has 31)

|Operating Mode|Shilf-and-add Segmentation|Paging|
|:---:|:---:|:---:|
|Real Mode|Enabled|Not existing|
|Protected Mode (80286)|Enabled|Optional|
|Protected Mode (80386 and above)|Enabled|Optional|
|Compatibility Mode|Enabled|Enabled|
|64-Bit Mode|Bypassed|Enabled|

GRUBT2 boostraps the OS to 32-bit protected mode, but we need the CPU running in
the long mode to support 64-bit mode. Specifically, to run 64-bit programs, we
need to switch the CPU to the long mode with paging enabled manually. Prior to
switching to the long mode, GRUB2 sets up two arguments that matter, 1) $eax
(the magic value "0x36d76289" that indicates that the HyperCubeOS was loaded by
a MultiBoot2-compiant boot loader) and 2) $eax (a 32-bit physical address of the
Multiboot2 information structure defined in [Multiboot2 Specification version
2.0](https://www.gnu.org/software/grub/manual/multiboot2/multiboot.html#Boot-information-format).
I tried to save $eax and $ebx, set up the page table (cr3 -> pml4t -> pdpt ->
pdt -> pt), and set up the GDT
[manually](https://wiki.osdev.org/Setting_Up_Long_Mode#The_Switch_from_Protected_Mode),
but I found it very problematic to use GRUB2 (a discussion is also available
[here](https://wiki.osdev.org/Creating_a_64-bit_kernel)). I chose
[Limine](https://wiki.osdev.org/Limine) as an alternative.

Luckily, Limine has identity mapped the lower 4G.

## Interrupts

Important data structures.

+ ISRs are stored in the Interrupt Descriptor Table (IDT) when you're in
Protected mode, or in the Interrupt Vector Table (IVT) when you're in Real Mode.
+ IDTR has two fields, limit and base. IDTR.limit constraints the number of IDT
entries and IDTR.base points to the first IDT entry. Each IDT entry has the
interrupt handler address and a few flags. Note that, IDT entry is 16-byte in
x86_64, while it is 8-byte in x86. Note that compilers may have problems with
assembly to write the interrupt handler, so take a two-stage assembly wrapping
(see [this](https://wiki.osdev.org/ISR)).

