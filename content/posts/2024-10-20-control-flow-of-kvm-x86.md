# Control flow of KVM/x86

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

## Model of race conditions

```
+-----------+           +-----------+
|   vcpu1   | --------- |   vcpu2   |
+-----------+ \       / +-----------+
               x-----x   
+-----------+ /       \ +-----------+
| INTERUPT1 |           | INTERUPT2 |
+-----------+           +-----------+

+-----------+           +-----------+
|   pcpu1   |           |   pcpu2   |
+-----------+           +-----------+
```
