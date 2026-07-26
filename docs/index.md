---
hide:
  - navigation
  - toc
  - footer
---

<style>
  /* Hide this page's first H1 */
  .md-typeset h1:first-of-type { display: none !important; }
  /* Optional: hide the floating action buttons next to the H1 */
  .md-content__button { display: none !important; }
</style>

## Qiang Liu

**_PostDoc in System Security at EPFL._**

[CV](./Qiang_s_CV.pdf) /
[:simple-googlescholar: Google Scholar](https://scholar.google.com/citations?user=fa1uB2sAAAAJ&hl=en) /
[:simple-github: GitHub](https://github.com/cyruscyliu) /
[:material-email: Email](mailto:cyruscyliu@gmail.com) /
[:material-linkedin: LinkedIn](https://www.linkedin.com/in/qiang-liu-744272406/)

_<u>About</u>_ · [Publications](publications/index.md) · [Projects](projects/index.md) · [Services](services/index.md)

## Research Vision

I propose **_the OME framework to Observe, Model, and Enforce the trustworthiness
of computer systems at runtime_**. Grounded in dynamic analysis, OME treats trust
as a measurable property of execution rather than a static design assumption. I
currently apply it to low-level system software, such as the Linux kernel and
hypervisors, within a single machine. The same observation, modeling, and
enforcement pipeline can scale to higher-level components (e.g., interpreters,
browsers, and AI agents) and to distributed and heterogeneous environments
(e.g., xPU, remote resources, and network protocols).

Beyond dynamic analysis, I aim to take **_multiple complementary approaches to
support the full lifecycle of system trust_**, such as secure programming
languages such as Rust, large-scale static analysis, secure boot and
attestation, and minimal recovery systems, from build to deployment, execution,
and recovery.

Ultimately, my goal is to make computer systems measurably trustworthy,
difficult to compromise, and secure to rely on for different classes of
stakeholders.

### Remarks on AI

- **Humans remain the central subject**, while AI acts as an extension of human
capability. Although AI can accelerate many human tasks, humans retain unique
strengths such as value judgment, responsibility, critical thinking, and
innovation. What AI can do, humans can also do; what AI cannot do, humans can
still do.

- **AI does not and cannot turn undecidable problems into decidable ones**, and
there is no universal automatic method that can determine whether any program
satisfies all nontrivial security semantic properties.

- AI can be understood through four components: data, algorithms, computing
power, and agent frameworks. Its effectiveness is constrained by data quality
(garbage in, garbage out), algorithmic limits (it appears to reason),
computational cost, intention drift, limited memory and sensing (incomplete
knowledge of the world, not everything programable), and imperfect verification.

- **AI is still not perfect, and it is
still not sufficient in niche domains**.

## Biography

Qiang Liu is a postdoc at EPFL, working with [Prof. Mathias
Payer](https://nebelwelt.net/) in the [HexHive
laboratory](https://hexhive.epfl.ch/). He earned his Ph.D. in 2023 from Zhejiang
University (ZJU) under the guidance of [Prof. Yajin Zhou](https://yajin.org/).
His research interest is system security that seeks to establish chain of trust
spanning the entire technology stack, from low-level software to user
applications, and from individual computers to large-scale distributed and
heterogeneous systems, grounded in a deep understanding of hardware and
software. His work has been recognized at all the top security conferences: IEEE
S&P, Usenix Security, ACM CCS, and ISOC NDSS. He received the Best Paper Awards
at USENIX Security'24 and ACM RAID'24. He is also serving on the program
committee for IEEE/ACM ASE'25 and USENIX Security'25 and has reviewed for
journals including IEEE TIFS, ACM CSUR, and ACM TOSEM.
