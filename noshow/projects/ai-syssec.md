# AI System Security

## Machine Learning Model Obfuscation

* Point of contact: [Qiang Liu](mailto:qiang.liu@epfl.ch)
* Suitable for: BSc semester project, potentially BSc thesis, MSc semester project or thesis
* Keywords: AI compiler, ML models, ML binaries, obfuscation

AI compilers transform scripts that describe machine learning models (ML models)
into hardware-executable binaries (ML binaries). Examples include PyTorch Glow,
TensorFlow XLA, Apache TVM, and NVIDIA cuDNN. The compilation process typically
lowers models through multiple stages: first into high-level intermediate
representations (IRs), then into low-level IRs, and finally into machine code
[1]. High-level IRs usually take the form of computation graphs that represent
the structure of the ML model. They are generally hardware-agnostic, meaning
they don’t assume a specific execution platform. Low-level IRs, on the other
hand, are generally framework-agnostic, meaning they can be generated from
different front-end frameworks but are more closely tied to specific hardware
backends. In some cases, ML models can also be compiled to WebAssembly (Wasm), which
provides relatively fast performance and is portable across different platforms.

While ML models rely on massive amounts of data and computing resources, they
are extremely valuable assets, and once deployed, their confidentiality must be
preserved. However, this guarantee can be undermined through techniques such as
model de-compilation [2] or side-channel information leakage [3].

Our goal is to explore obfuscation techniques for ML models, and more broadly,
to develop general capabilities for security optimization of ML models by
extending and modifying compiler infrastructures. Since this project is in an
early stage, the objectives are to:

* Compile diverse ML models with different compilers to obtain the corresponding
  binaries across multiple backends
* Analyze the execution of these binaries on CPU/GPU, focusing on their runtime
  behavior, memory access patterns, and data sharing mechanisms
* Study existing machine learning–based de-compilation techniques and explore
  ways to break their assumptions or patterns by modifying compilers such that
  the generated binaries are resistant to decompilation

Recommended readings:

[1] [A friendly introduction to machine learning compilers and
optimizers](https://huyenchip.com/2021/09/07/a-friendly-introduction-to-machine-learning-compilers-and-optimizers.html)  
[2] [NEUROSCOPE: Reverse Engineering Deep Neural Network on Edge Devices using
Dynamic
Analysis](https://www.usenix.org/system/files/conference/usenixsecurity25/sec24winter-prepub-338-wu-ruoyu.pdf)  
[3] [GPUHammer: Rowhammer Attacks on GPU Memories are Practical](https://gpuhammer.com/)