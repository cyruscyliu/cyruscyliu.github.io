# ASE'21 - FirmGuide

This is the speech text of FirmGuide for ASE'21.

## Text (15 mins, ~1500 words) and [Slides](./2021-11-15-ase-firmguide.pdf)

Hello, everyone. My name is Liu Qiang from Zhejiang University. I'm going to
introduce one of our works on firmware rehosting: FirmGuide. This is joint work
with Cen Zhang, the other co-first author, and other authors from Zhejiang
University, Nanyang Technological University, and The Hong Kong Polytechnic
University.

Now the Linux kernel with drivers is prevalent in the high-end embedded firmware
like routers and cameras. We want to dynamically understand or discover the bugs
or vulnerabilities in the context of embedded systems, however, it is not easy
and scalable due to the hardware requirements. The goal of this paper is then to
rehost the embedded Linux kernels with the best effort.

It has three challenges. First, a System on Chip has numerous peripherals.
Based on the observation that whether a peripheral is critical to the Linux
kernel functionality, we classify peripherals into two types. Type-I
peripheral, such as processors, memory, interrupt controllers, timers, and
UART, is critical to support memory management, scheduling, and user-kernel
interactions. We have to design high-fidelity virtual device models for them.
Others are type-II peripherals that are not necessary to be high fidelity. We
use dummy device models with proper initialized values to pass some checks to
avoid being stuck when the Linux kernel is booting. This classification saves
the time to model every type of peripherals, which is a huge problem that may
take years. The minimum best effort is the first step and enough to start the
dynamic analysis of the embedded Linux kernel. Next, we are going to discuss two
other challenges when modeling the Type-II peripherals.

The second challenge is that even one type of peripherals, e.g., interrupt
controllers, have different models. Do we need to model each interrupt
controller? The answer is no. Based on our observation, the driver of an
interrupt controller must obey the protocol defined by the interrupt subsystem
in the Linux kernel. To solve this challenge, we extract generic state machines
from the Linux kernel subsystems for further high fidelity model construction.

The third challenge is that each peripheral has complex interactive semantics.
For example, to mask an interrupt source, an interrupt controller will read the
mask register, mask one specific bit, and then write the value back to the
register M. To load an interrupt request number (IRQ), an interrupt controller
will load the corresponding value, parse it, and invoke the relative interrupt
service routine. We observe that the driver of an interrupt controller has to
implement the callbacks defined in the subsystem. Each specific driver interface
callback embeds such complex interactive semantics via MMIO read and write
sequences. We analyze the drivers of Type-I peripherals and extract MMIO read
and write sequences from these callbacks to complete the state machine extracted
from the interrupt subsystems.

In our paper, we propose a new technique named model-guided kernel execution.
The idea is that we can leverage a state machine model to guide the kernel's
execution. The peripheral model consists of two parts. The first part is the
model template, that is, a state machine. It is manually constructed by experts.
Note that the transition condition is blank. The second part is MMIO read and
write sequences as transition conditions. This part can be automatically
inferred by analyzing the source code of the drivers. How does the model-guided
kernel execution work? In a virtual device, we monitor the execution of the
Linux kernel, compare the MMIO read and write sequences encoded in the state
machine, and then transit to the corresponding states. Finally, the Linux kernel
will successfully boot and spawn an interactive shell.

Here is a running example. The left figure has two representative callback
functions of an interrupt controller driver in the Linux kernel. The right
figure shows how the peripheral model works. In the irq_mask_callback function,
it first issues an MMIO read. In the peripheral model, we monitor this MMIO
read. Give a concrete irq, we do mask a specific bit in mask, and then issue an
MMIO write. The peripheral model detects this read and finds that a sequence of
MMIO read and write with specific values are triggered. The peripheral model can
infer the specific interrupt request number and then mask it. Similarly, the
callback function handle_irq_callback reads the current pending interrupt
sources. After monitoring it, the peripheral model will check the current state
machine and return the number of the pending interrupt. The example shows that
the MMIO read and write sequences from the Linux kernel can be recognized to
drive the state machine of our emulated peripherals, which is the core idea of how the
model-guided kernel execution works.

How to construct the peripheral model? In the above row, we first manually
analyze the Linux kernel subsystems and construct the model template manually.
In the bottom row, we parse the device tree blob to get some parameters,
such as the number of interrupts that an interrupt controller can support, then
automatically analyze the driver code. The automated inference has three parts.
The first part is the basic MMIO read and write sequence extraction via symbolic
execution. The second part is to handle CFSV. CFSV are kernel-maintained shared
variables. They will cache the value of the MMIO registers. We have to analyze
them and consider them as part of the peripheral model. The third part is to
infer the semantic difference between the hardware and the Linux kernel.
Specifically, the time unit used by the hardware and the Linux kernel is
different. We have to calculate the difference and convert it to
hardware-recognized or kernel-recognized value. Then, we have the MMIO read and
write sequences with more information for each state transition. Finally, we
convert the peripheral model to QEMU virtual device. In general, we
semi-automatically build the state machine of each peripheral with a general
model template and model parameters.

Here is our system design and implementation. FirmGuide consists of two
components. The first component named "offline model generation" analyzes the
Linux kernel source code and generate virtual devices. The components use LLVM
pass for preprocessing, KLEE for MMIO read and write sequences analysis, and
Python scripts for gluing. The second component named "online kernel booting",
accepts the binary firmware, lists the peripherals in its device tree blob, and
composes the whole virtual machine. This component uses Python for main logic and
take template-render pattern for code generation.

The first question in our evaluation is what peripherals models FirmGuide can
generate. As shown in the first table, FirmGuide can support five different
families of SoCs, covering six interrupt controllers and five timers. In the
parameter inference, the symbolic execution engine can solve the first solution
within 1 hour. We also count the number of CFSV and timer semantic-aware values.
Our experiences show that these peripheral models can support the basic
functionality of a rehosted embedded Linux kernel. In the second table, we list
the number of Type-II peripherals and the number of initialized values we should
handle to avoid being stuck when the Linux kernel is booting. In general,
because the number of initial values is limited, even the number of Type-II
peripherals is an order of magnitude of Type-I peripherals, they are easy to
handle.

The second evaluation is what embedded Linux kernel we can rehost. In the
figure, we list the number of unpacked firmware, the number of extracted
kernels, the number of embedded kernels that go to the user space, and the
number of embedded kernels that spawn shells. Given more than six thousand of
firmware crossing ten vendors, three architectures, and 22 Linux kernel
versions, FirmGuide can successfully rehost more than 96% of them, showing the
scalability of FirmGuide.

The third question is about the functionality or fidelity of the rehosted
embedded Linux kernels via the system call testing tools in the Linux Test
Project. We manually develop a QEMU virtual machine with well-constructed Type-I
peripherals and compare the result with the one FirmGuide generates. Results in
the table show that FirmGuide generated virtual machines has the same fidelity
as manually developed QEMU virtual machine regarding the system calls. The
fourth question is the applications of FirmGuide.  We use FirmGuide to reproduce
and develop exploits for six Linux kernel CVEs.  We also leverage fuzzing to
test the rehosted embedded Linux kernel.

Here we are. First, we proposed a novel technique. Second, we design and
implement the first semi-automatic framework for embedded Linux kernel
rehosting. Last, we apply FirmGuide to analyze and discover the bugs in the
embedded Linux kernel.

At last, I'd like to discuss the limitation of FirmGuide and future work.
First, we need experts to extract the state machine from the Linux kernel
subsystems manually. It depends on a well-formed abstraction. It is still
challenging to infer the peripheral model automatically for more complicated
peripherals. Second, FirmGuide cannot support the high fidelity of Type-II
peripherals due to our minimum best efforts strategy. It is an important problem
to support more Type-II peripherals and enable more analysis of Type-II
peripheral drivers in the embedded Linux kernel.

Thank you!