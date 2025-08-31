---
date: 2021-10-27
categories:
    - tech-notes
---

# Introduction to Bhyve

In this short article, I'm going to introduce what is Bhyve, how it works, and
how to modify it.

<!-- more -->

## What is Bhyve?[^1][^2][^3]

+ Bhyve, pronounced "beehive", is a hypervisor for FreeBSD.
+ Bhyve runs on x86_64 host and supports i386 and x86_64 guests.
+ Bhyve requires VT-x/EPT CPU support (core i*).
+ Bhyve consists of a kernel module: `vmm.ko`, a library `libvmmapi`, and some
utilities `bhyve`, `bhyveload`, and `bhyvectl`. Yes, it works as a kernel model
like `KVM`.
+ The source code is in the FreeBSD SVN source repository: sys/amd64/vmm/,
usr.sbin/bhyve/, usr.sbin/bhyveload/, usr.sbin/bhyvectl/, and lib/libvmmapi/
+ Variants: [xhyve](https://github.com/machyve/xhyve)[^4], [Pluribus
Netvisor](https://www.pluribusnetworks.com/products/white-box-os/), [bhyve in
Illumos-based distributions](https://bhyvecon.org/bhyvecon2018-Gwydir.pdf).

## Components[^5]

|component|functionality|
|:---:|:---:|
|vmm.ko|VT-x, local APCI, VT-d for PCI pass-thru, guest phymem mgmt, user-space cdev-interface|
|bhyveload|user-space bootloader, userboot lib + bhyve API, creates VM, lays out kernel + metadata, sets up initial VM register state|
|bhyve|user-space run loop, PCI bus/device emulation, device backends, threads for vCPU, i/o devs, kqueue loop|
|bhyvectl|dump/modify VM state, dump VM stats, delete VMs|
|libvmmapi|userland API|

## Dismistafication

+ vhyveload only supports FreeBSD, grub2-bhyve can load Linux and OpenBSD
+ each /dev/vmm/${vmname} contains each VM instance state
+ VMX-root: hypervisor, VMX-non-root: VM

## VMX (VMCS-maintenace) instructions

+ VMPTRLD — It makes the referenced VMCS active and current.
+ VMPTRST — The current-VMCS pointer is stored into the destination operand.
+ VMCLEAR — The instruction sets the launch state of the VMCS referenced by the operand to “clear”, renders that VMCS inactive, and ensures that data for
the VMCS have been written to the VMCS-data area in the referenced VMCS region. If the operand is the same as the current-VMCS pointer, that pointer is made invalid.
+ VMREAD — This instruction reads a component from a VMCS.
+ VMWRITE — This instruction writes a component to a VMCS.
+ **VMLAUNCH** — This instruction launches a virtual machine managed by the VMCS. A VM entry occurs, transferring control to the VM.
+ **VMRESUME** — This instruction resumes a virtual machine managed by the VMCS. A VM entry occurs, transferring control to the VM.
+ VMXOFF — This instruction causes the processor to leave VMX operation.
+ VMXON — It causes a logical processor to enter VMX root operation. (vmm_init -> vm_init -> vm_enable -> vmxon)
+ INVEPT — This instruction invalidates entries in the TLBs and paging-structure caches that were derived from extended page tables (EPT).
+ INVVPID — This instruction invalidates entries in the TLBs and paging-structure caches based on a VirtualProcessor Identifier (VPID).
+ **VMCALL** — This instruction allows software in VMX non-root operation to call the VMM for service. A VM exit occurs, transferring control to the VMM.
+ **VMFUNC** — This instruction allows software in VMX non-root operation to invoke a VM function (processor functionality enabled and configured by software in VMX root operation) without a VM exit.

## Some data structs

``` c
#define	VM_MAXCPU	8
struct vm_exit {
	enum vm_exitcode	exitcode;
	int			        inst_length;	/* 0 means unknown */
	uint64_t		    rip;
	union {
		struct {} inout; // direction, how many bytes, port number, eax for out
		struct {} paging;
		struct {} vmx;
		struct {} msr;
	} u;
};
struct vm_exit vmexit[VM_MAXCPU];
```

The above code defines exit information for each virtual cpu.

## BHyve VMExit code

|code|handler|description|next|
|:---:|:---:|:---:|:---:|
|VM_EXITCODE_INOUT|vmexit_inout|in and out instructions|VMEXIT_CONTINUE or VMEXIT_ABORT|
|VM_EXITCODE_VMX|vmexit_vmx|vm exit|VMEXIT_ABORT|
|VM_EXITCODE_BOGUS|vmexit_bogus||VMEXIT_RESTART or VMEXIT_SWITCH|
|VM_EXITCODE_RDMSR|vmexit_rdmsr|Local APIC|VMEXIT_ABORT|
|VM_EXITCODE_WRMSR|vmexit_wrmsr -> emulate_wrmsr|Local APIC|VMEXIT_CONTINUE or VMEXIT_SWITCH|
|VM_EXITCODE_MTRAP|vmexit_mtrap||VMEXIT_RESTART|
|VM_EXITCODE_PAGING|vmexit_paging -> emulate_instruction||VMEXIT_CONTINUE or VMEXIT_ABORT|

### Example: vmexit_inout

``` c
static int
vmexit_inout(struct vmctx *ctx, struct vm_exit *vme, int *pvcpu)
{
    // ignore ins/outs
	if (vme->u.inout.string || vme->u.inout.rep)
		return (VMEXIT_ABORT);
    // reset: out 0x64, 0xFE -> vmexit_catch_reset -> VMEXIT_RESET
	if (out && port == 0x64 && (uint8_t)eax == 0xFE)
		return (vmexit_catch_reset());
    // host notification: out 0x488, {0, 1, 5} -> VMEXIT_CONTINUE
    if (out && port == GUEST_NIO_PORT)
            return (vmexit_handle_notify(ctx, vme, pvcpu, eax));
    // handle other in/out
	error = emulate_inout(ctx, vcpu, in, port, bytes, &eax, strictio);
	if (error == 0 && in)
		error = vm_set_register(ctx, vcpu, VM_REG_GUEST_RAX, eax);
	if (error == 0)
		return (VMEXIT_CONTINUE);
	else {
		return (vmexit_catch_inout()); // VMEXIT_ABORT
	}
}
```

## Some data structs

``` c
#define SET_DECLARE(set, ptype)					\
	extern ptype *__CONCAT(__start_set_,set);	\
	extern ptype *__CONCAT(__stop_set_,set)
#define SET_BEGIN(set)							\
	(&__CONCAT(__start_set_,set))
#define SET_LIMIT(set)							\
	(&__CONCAT(__stop_set_,set))
#define SET_FOREACH(pvar, set)					\
	for (pvar = SET_BEGIN(set); pvar < SET_LIMIT(set); pvar++)
#define SET_ITEM(set, i)						\
	((SET_BEGIN(set))[i])
#define SET_COUNT(set)							\
	(SET_LIMIT(set) - SET_BEGIN(set))

SET_DECLARE(pci_devemu_set, struct pci_devemu);

struct pci_devemu {
	char      *pe_emu;		/* Name of device emulation */
	/* instance creation */
	int       (*pe_init)(struct vmctx *, struct pci_devinst *, char *opts);
	/* config space read/write callbacks */
	int		  (*pe_cfgwrite)(...)
	int	      (*pe_cfgread)(...)
	/* I/O space read/write callbacks */
	void      (*pe_iow)(...)
	uint32_t  (*pe_ior)(...)
};

#ifdef __GNUCLIKE___SECTION
#define __MAKE_SET(set, sym)						\
	__GLOBL(__CONCAT(__start_set_,set));				\
	__GLOBL(__CONCAT(__stop_set_,set));				\
	static void const * const __set_##set##_sym_##sym 		\
	__section("set_" #set) __used = &sym
#else /* !__GNUCLIKE___SECTION */
#ifndef lint
#error this file needs to be ported to your compiler
#endif /* lint */
#define __MAKE_SET(set, sym)	extern void const * const (__set_##set##_sym_##sym)
#endif /* __GNUCLIKE___SECTION */

#define TEXT_SET(set, sym)	__MAKE_SET(set, sym)
#define DATA_SET(set, sym)	__MAKE_SET(set, sym)
#define BSS_SET(set, sym)	__MAKE_SET(set, sym)
#define ABS_SET(set, sym)	__MAKE_SET(set, sym)
#define SET_ENTRY(set, sym)	__MAKE_SET(set, sym)

PCI_EMUL_SET(pci_xxx);
```

The above code defines name and callbacks of each PCI devices.

## Virtual devices (dummy means very low fidelity) (Old BHyve)

|peripheral|file|description|
|:---:|:---:|:---:|
|atpic|usr.sbin/bhyve/atpic.c|dummy|
|console|usr.sbin/bhyve/consport.c|ttyread\|ttywrite|
|gdbport|usr.sbin/bhyve/dbgport.c|bind, listen, accept, read\|write|
|elcr|usr.sbin/bhyve/dbgport.c|dummy|
|pit 8254|usr.sbin/bhyve/pit_8254.c|pit_8254_handler|
|post|usr.sbin/bhyve/post.c|dummy|
|rtc|usr.sbin/bhyve/rtc.c|rtc_addr_handler\|rtc_data_handler|
|uart|usr.sbin/bhyve/uart.c|dummy|
|pci-dummy|usr.sbin/bhyve/pci_emul.c|pci_emul_dinit\|pci_emul_diow\|pci_emul_dior|
|pci-hostbridge|usr.sbin/bhyve/pci_hostbridge.c|pci_hostbridge_init|
|pci-passthru|usr.sbin/bhyve/pci_passthru.c|/dev/pci, /dev/io|
|pci-uart|usr.sbin/bhyve/pci_uart.c|pci_uart_init\|pci_uart_write\|pci_uart_read|
|pci-virtio-blk|usr.sbin/bhyve/pci_virtio_block.c|pci_vtblk_init\|pci_vtblk_write\|pci_vtblk_read|
|pci-virtio-net|usr.sbin/bhyve/pci_virtio_net.c|pci_vtnet_init\|pci_vtnet_write\|pci_vtnet_read|

### Virtual device initialization

``` txt
while (c = getopt())
	switch (c)
		case 's':
			pci_parse_slot(optarg, 0); // not legacy
			break;
		case 'S':
			pci_parse_slot(optarg, 1); // legacy
			break;
		// ------------------------------
		// pci_parse_slot
		// ------------------------------
		// snum is from 0 to 31
		// 0,hostbridge
		// 1,virtio-net,tap0
		// pci_slotinfo[snum].si_name = emul; // hostbridge, virtio-net
		// pci_slotinfo[snum].si_param = config; // null, tap0
		// pci_slotinfo[snum].si_legacy = legacy; // 0, 1
init_inout
	install handler for each port: 
		atpic, console, gdbport, elcr, pci_emu, pit 8254, post, rtc, and uart.
init_pci
	// it depends on opts
	pde = pci_emul_finddev(si->si_name);
	if (pde != NULL) {
		pci_emul_init(ctx, pde, i, si->si_param); // invoke ->init
```

## Extend BTest (like QTest) to BHyve

The idea of BTest is to implement the same primitives as QTest. We can leverage
the PCI interfaces because we are doing in-memory fuzzing rather than doing
traps.

[^1]: [Homepage of Bhyve](https://bhyve.org/)
[^2]: [Wikipedia of Bhyve](https://en.wikipedia.org/wiki/Bhyve)
[^3]: [Q&A of Byyve](https://wiki.freebsd.org/bhyve)
[^4]: [xhyve](https://www.vpsee.com/2015/06/mac-os-x-hypervisor-xhyve-based-on-bhyve/)
[^5]: [Extending bhyve beyond FreeBD guests](https://people.freebsd.org/~grehan/talks/eurobsdcon_2013_bhyve.pdf)