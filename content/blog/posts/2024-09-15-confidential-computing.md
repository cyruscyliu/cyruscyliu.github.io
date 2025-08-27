---
date: 2024-09-15
---

# Quick notes about confidential computing

## Intel TDX

1. What does the Intel TDX protect? Confidential VM's VMCS, page tables,
interrupt status, and memory.

## Confidential Computing on Heterogeneous Systems: Survey and Implications

1. Heterogeneous Computing System: CPU/GPU/ASIC/FPGA/NPU
2. Threats: (data leakage, unauthorized data access) * (software, tenent), side channel attacks
3. Security requirements: confidentiality and integrity
4. Solutions: TEE (hardware and software), Cryptography, Probablity
5. Trend: TEE for CPU to TEE for GPU, say NVIDIA H100
6. GPGPU: The idea is to leverage the power of GPUs, which are conventionally
used for generating computer graphics, to carry out tasks that were
traditionally done by central processing units (CPU).
7. Key points: threat models, compatibility, TCB size, memory encryption, performance/overhead