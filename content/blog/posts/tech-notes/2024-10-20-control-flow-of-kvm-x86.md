---
date: 2024-10-20
categories:
    - tech-notes
---

# Control flow of KVM

## KVM_RUN

kvm_vcpu_ioctl() in virt/kvm/kvm_main.c handles generate cmds like KVM_RUN,
while kvm_arch_vcpu_ioctl() in arch/x86/kvm/x86.c handles arch-specific cmds
like KVM_SET_CPUID.

```
kvm_vcpu_ioctl(): virt/kvm/kvm_main.c
    case KVM_RUN:
        kvm_arch_vcpu_ioctl_run(): arch/x86/kvm/x86.c
            vcpu_run(): -
                vcpu_enter_guest():
                    vcpu_run() (-> vmx_vcpu_run()):
                            arch/x86/kvm/vmx/vmx.c
                        vmx_vcpu_enter_exit(): - (ASM)
                    handle_exit() (-> vmx_handle_exit()): -
```

## KVM_RUN for ARM

```
kvm_arch_vcpu_ioctl_run()
  -> while (ret > 0)
    -> ret = kvm_arm_vcpu_enter_exit()
    | -> __kvm_vcpu_run()
    | | -> __kvm_vcpu_run_vhe()
    | | | -> do { exit_code = __guest_enter() }
    | | | | -> el1_sync // vmexit
    | | | | | -> el1_trap
    | | | | | -> return exit_code=ARM_EXCEPTION_TRAP
    | | | | -> return exit_code=ARM_EXCEPTION_TRAP
    | | | -> while(fixup_guest_exit())
    | | | | -> kvm_hyp_handle_exit()
    | | | | | -> kvm_hyp_handle_dabt_low()
    | | | | |   -> __populate_fault_info()
    | | | | |     -> __get_fault_info()
    | | | | -> return false
    | | | -> return exit_code
    | | -> return exit_code
    | -> return exit_code
    -> handle_exit()
```