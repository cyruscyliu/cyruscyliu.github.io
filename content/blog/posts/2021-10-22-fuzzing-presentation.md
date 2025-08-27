# CS-725 Presentation - Fuzz Testing

This is the text of my speech in CS-725. This text is about fuzz testing, its
terminologies, a generic model fuzzer with different design choices, and some
discussion about the future work. This text is mainly based on one survey[^1]
and take some content from another review article[^2].

## Text (25 min: ~2800 words) and [Slides](./2021-10-22-fuzzing-presentation.pdf)

Hello every. I'm going to present some slides on fuzzing, or fuzz testing, based
on one survey paper (reading its name on Slide~1) that was accepted by TSE'19
and one review article (reading its name on Slide~1) written by Patrice
Godefroid, working at Microsoft Research, a pioneer of white-box fuzzing.
Mostly, slides are from the first survey paper because it's a journal paper
through peer reviews. Some slides are from the second review article and I will
let you know by an asterisk (*) symbol. (90/170, 40 s)

(skipped) Let's start. Let's think about how we mine vulnerabilities in general.
As Patrice said in its review paper, we could first apply static program
analysis.  We can do static program analysis when compiling a binary. As we all
know, both GCC and Clang have many checkers. For instance, Clang has checks of
insecure APIs, float loop counters, in its current implementation. Compared to
run-time solutions, these checkers are fast and good at shallow bugs. However,
they suffer from false alarms will miss deeper bugs. Second, we could manually
review the code. Apparently, it is flexible and applicable because we do not
need much tooling to start if we have the source code or any disassembly. With
manual inspection, we can even find deep coding errors and even design flaws.
However, this approach is labor-intensive, expensive, and not scalable to lot of
software at the same time. The third major approach is fuzzing or fuzz testing,
which is also the topic of this presentation. Patrice suggests using fuzzing
because they can always find bugs when they fuzz projects in Microsoft, showing
the effectiveness of fuzzing. Meanwhile, fuzzing doesn't report false alarms
mostly.  Fuzzing has its drawbacks. Fuzzing requires test automation and
requires each test to run fast and the application state to be reset after each
iteration. It is difficult to set up and expensive. Fuzzing can miss bugs as
well.  In practice, fuzzing is so effective that has been widely deployed by
attackers, security competitions, and companies like Microsoft and Google.

The fuzzing community is very vibrant. GitHub itself hosts over a thousand
public repositories related to fuzzing and as counted in the survey paper, from
2008 to 2019, the big-4 security conferences and three major software
engineering conferences have witnessed more than 110 fuzzers. Recently, the
number of fuzzing-related papers is 78. Are there any problems?  First, the
description of fuzzers doesn't go much beyond their source code and manual page.
It is easy to lose track of the design decisions and potentially important
tweaks (or improvements) in these fuzzers over time. Furthermore, various
fuzzers do not always use the same terminologies. AFL uses "test case
minimization" to refer to a technique that reduces the size of a crashing input.
The same technique in funfuzz is called "test case reduction".  This kind of
hinders our communication and the progress of knowledge. According to the above
two problems, we need to consolidate the distill a large amount of progress in
fuzzing, and hopefully improve it. (160/568, 1 min)

Here is the outline of this presentation. First, I will introduce a serial of
terminologies in fuzz testing and then introduce a unified fuzzing model that
covers different stages when we do fuzzing, such as preprocessing and input
evaluation.  The major and final part of this presentation is to introduce the
design choices in each stage and trade-offs we can and should make. (60/634, 30 s)

Let's review some terminologies in fuzzing. Before some definitions, let's see
what is a PUT: A PUT is a program under test, which I think is from the software
engineering aspect. So, what is fuzzing? Fuzzing is the execution of the PUT
using input(s) sampled from an input space that protrudes the expected input
space of the PUT. The key word here is protruding, reflecting the meaning that
an unexpected input makes a PUT performs incorrectly and unintended. The fuzz
testing is then the use of fuzzing to test if a PUT violates a correctness
policy; the fuzzer is then a program that performs fuzz testing on a PUT; the
fuzzing campaign, namely, is a specific execution of a fuzzer on a PUT with a
specific correctness policy. The next important definition is "bug oracle",
which defines how a fuzzing campaign violates a correctness policy. The
correctness policy reflects the bug oracle rather than, say, performance issues.
Fuzzing itself can be applied in other non-security scenarios by altering the
corresponding policy. A fuzzer requires not only the PUT but also some extensive
information, e.g., coverage information, that is, fuzz configuration. These are
parameter values that control the fuzz algorithm. A seed pool is another kind of
fuzz configuration. (210/842, 2 min)

Here is the model fuzzer, the algorithm in the figure. This algorithm is generic
enough to accommodate existing fuzzing techniques, including black-, grey-, and
white-box fuzzing. Let's check this algorithm. It has two inputs, a set of fuzz
configurations and a timeout. Its output is a set of bugs. The algorithm has two
parts. The first part is to preprocess the fuzz configurations, such as PUT
instrumentation. The second part goes into a loop.  In this loop, the model
fuzzer will schedule the fuzz configurations, generate an input, evaluation the
input, and update the configuration set. I will explain them one by one in the
following. Before going on, I'd like to introduce three groups of fuzzers that
would be used in the following presentation. Based on the granularity of
semantics fuzzers can obverse, they have three groups. The black-box fuzzer
doesn't see the internals of the PUT, that is, it can only observe the input/out
behaviors of the PUT. At the other extreme, white-box fuzzing generates test
cases by analyzing the internals of the PUT and gathering the information when
executing the PUT with symbolic execution or taint analysis. What in the middle
is the grey-box fuzzer. They may perform lightweight static analysis on the PUT
and/or gather dynamic information about its execution, such as code coverage.
The distinction is not always clear.  Sometimes, it needs human's judgment.
(230/1077, 2 mins)

Some fuzzers have to preprocess the set of configurations. They usually
instrument the PUT, select seeds, trim seeds, and sometimes use a driver
application to dispatch seed when it is hard to directly fuzz the PUT. The
survey paper didn't say much about the driver application, such that I'd like
put it shortly in advance. The driver application is usually manually
constructed, which is a one-time effort. Recently, several papers tried to
automatically construct the driver application, e.g., FuzzGen, WINNE, APICraft.
The driver application is diverse in implementation, which depends on the PUT
you'd like to fuzz.  (100/1171, 40 s)

Let's check the design decisions in instrumentation. Program instrumentation can
be either static or dynamic. The former happens before the PUT runs. It can
operate source code, IR, or binary. The latter happens while the PUT is running.
The static instrumentation generally imposes less run-time overhead. The dynamic
instrumentation is good at handling libraries. What are the usage scenarios of
the instrumentation? First, instrumentation can be used to collect execution
feedback. AFL, libFuzzer, and its descendants compute the branch coverage and
store the coverage in a compact bit vector. It is straightforward but has path
collisions. Second, instrumentation can be used to schedule threads to trigger
different non-deterministic program behaviors. In practice, random scheduling
works effectively to discover race condition bugs. The final one is in-memory
fuzzing. Sometimes, we want to test a portion of a large PUT to save the time of
initialization or startup. Two popular techniques are snapshot and fork server.
The former usually has one process, and the latter creates new processes. Next,
what if we don't restore the state of the PUT after each iteration, which is
named in-memory API fuzzing. A particular example is AFL persistent mode. This
technique has side effects: bugs (or crashes) may not be reproducible. In
ViDeZZo, we take this technique to accelerate the fuzzing campaign. If the bug
or crash cannot be reproducible, we will save all test cases in order, and use
delta-debugging to find all necessary test cases.  (250/1420, 2 mins)

The second and third parts of preprocessing are seed selection and seed
trimming. We don't want all the seeds when the number of seeds is large and each
of them doesn't equally contribute. The common approach is minset, which tries
to find a minimal set of seeds that maximizes a coverage metric. What can be the
coverage metric? AFL's minset is based on branch coverage with a logarithmic
counter. The rationale behind this is to consider branch counts as different
only when they differ in their orders of magnitude. Honggfuzz computes coverage
based on the number of executed instructions, executed branches, and unique
basic blocks. This metric allows the fuzzer to add longer executions to the
minset. When it comes to seed trimming, the goal is to make seeds smaller
because they are likely to consume less memory and entail higher throughput.
Different tools have different intuitions. AFL reduces the size of a seed by the
code coverage. A USec'14 paper shows that the seed with a smaller size might be
better. MoonShines tells us we should keep the dependent syscalls.  BTW, both of
them can be performed in the fuzzing loop, in UpdateConf, after the input
evaluation. (200/1621, 2 mins)

Fuzzing scheduling means selecting a fuzz configuration for the next fuzz
iteration. For more and more advanced fuzzers, a major factor to their success
lies in their innovative scheduling algorithms. They usually optimize for the
number of bugs or code coverage. They select a better seed entailing more bugs
and coverage. From the aspect of game theory, there is a scheduling problem.
Fundamentally, every scheduling algorithm confronts the same exploration v.s.
exploitation conflict - time can either be spent on gathering more accurate
information on each configuration to inform future decisions or on fuzzing the
configurations that are currently believed to lead to more favorable outcomes.
In the model fuzzer, the schedule function accepts three inputs: the current
configuration C with new information gathered in preprocessing or conf updating,
the current time, and the total time budget. For black-box fuzzers, the only
information is the fuzz outcomes, the number of crashes and bugs and the amount
of time spent on it so far. For grey-box fuzzers, they can obtain richer
information about each configuration, e.g., the code coverage. AFL, the pioneer,
is based on an evolutionary algorithm. Intuitively, an EA maintains a population
of configurations, each with some values of fitnesses. Fitness defines how
better a test case is. (230/1850, 2 min)

The input generation is the most influential design decision in a fuzzer because
the content of the input directly triggers a bug. In general, the input
generation can be model-based or model-less, which is also named generation- or
mutation-based. Model-based or generation-based input generation uses a given
model that describes the inputs that the PUT may accept. The model can be
predefined. The model can be tool-specific, or grammar, or protocol, or system
call templates, or file formats. It depends on the type of input of your PUT.
Predefined models are reasonable when the number of models is limited. Patrice
said in his review article that how to xxx is another challenge. The model
inference can happen in either preprocessing or conf updating. In reprocessing,
the model can be inferred from the binary itself, from seeds, or from API logs.
In configuration updating, the model can be from kinds of dynamic behaviors.
Another type of model is the encoder model. What is an encoder? Many file
formats have their decoders and corresponding encoders. The idea behind this is
if we can mutate the encoder, we can generate semantic-aware inputs. This design
choice can be implemented with program slicing. The model-less input generation,
or mutation-based input generation, is a part of the evolutionary algorithm.  It
can perform bit-flipping. As shown in previous papers, each PUT has a specific
mutation ratio. It can perform arithmetic mutation. The mutation first cast 4
bytes to an integer and then does plus or minus operation. It can also perform
block-based mutation. Namely, a block is several bytes. The mutation can add,
append, delete, replace, shuffle, or crossover these blocks.  It can also use
the dictionary. The dictionary has a set of strings or bytes that are difficult
to guess but helpful to breakthrough some checks. (300/2151, 3 mins)

What about the white-box fuzzers? White-box fuzzers generate test cases via
dynamic symbolic execution. It is expensive. As said in the review article
written by Patrice, how to. In practice, we can specify uninterested parts of a
PUT or alternate between concolic testing and grey-box fuzzing. The concolic
testing is on-demand when the fuzzer needs it to solve some constraints. Some
fuzzers leverage static or dynamic program analysis to boost the fuzzing
effectiveness. They usually have two steps. Step 1: heavy program analysis; step
2: test case generation. For example, some fuzzers use taint analysis to
identify hot bytes in an input. The hots bytes flow to target APIs or syscalls.
Some fuzzers extract the control or data flow features of the PUT and guide the
input generation. Another interesting direction is to change the PUT and recover
it when reproducing. For example, we can remove the checksum checks in the PUT
and add them when reproducing a crash. We can also remove the non-critical
checks to boost the fuzzing outcomes. (200/2352, 2 mins)

After the input generation, the fuzzer executes the PUT on the input and decides
what to do the resulting execution. This process is called input evaluation.
Here, we have bug oracles, execution optimization, and triage in the next slide.
At the very beginning, fuzz testing considers every PUT terminates by a fatal
signal. This policy is simple and easy to enforce. However, it cannot detect
memory bugs. As mitigation, researchers have proposed a variety of efficient
program transformations to detect unsafe or unwanted program behaviors and abort
the program. These are often called sanitizers. Memory safety errors can be
spatial and temporal. AddressSanitizer is useful to detect many memory safety
errors. Besides, CFI enforcement is another class of memory safety protection.
For other undefined behaviors, uninitialized memory, etc., can be detected by
MSAN and UBSAN. In addition to sanitizers, fuzzers can validate input by
manually specific patterns or differential testing. As we talked about in the
instrumentation, to optimize the execution, fuzzers can use fork-server or
in-memory fuzzing to avoid wasting the time of initialization or PUT reset.
(150/2489, 1 min)

The final part is to triage. It has three steps: deduplication, prioritization,
and minimization. Deduplication is the process to remove the test case in the
output that causes the same bug. Three are three techniques. First, stack
backtrace hashing. It is widely used but "some xxx", which means that some test
cases are not going to be removed. Second, coverage-based deduplication. The
crash covered a previously unseen edge is a new test case that should be kept.
Third, semantic-aware deduplication. This technique tries to find the root cause
of a bug then remove the duplicated test cases. Next, how to prioritize the test
cases due to the conflict of the number of bugs found and limited human
resources. The prioritization is usually based on exploitability. This is fair,
but we have to decide whether the bug can be exploited, which is another
challenging problem. The final is to minimize the test cases. We mentioned test
case minimization and trimming in preprocessing. The difference is that test
case minimization here can leverage the bug oracle. This design choice can be
implemented via delta-debugging or some other specific approaches, like
C-Reduced. (200/2680, 2 min)

Finally, we come to the configuration updating. Mostly black-box fuzzer don't
update configuration because they are not aware of any execution information.
White-box fuzzers generate a configuration for each generated test case. For an
evolutionary algorithm, one of the most important parts is to add a new test
case in the seed pool. Each test case has a fitness. The common approach is to
check whether this test case contributes node or branch coverage. The fitness
function is usually refined in many ways. For instance, AFL takes the number of
token branches into consideration. VUzzer considers the weights of each BB. To
avoid creating too many configurations, the fuzzer should maintain a minset.
There are many variants here. We can either remove the configurations that not
in the minset or mark them in-favorable. (130/2817, 1 min)

All in all, the survey paper introduced rich taxonomy, a general-purpose model
fuzzer, and design decision in each stage. Hopefully, it can bring more
uniformity, particularly in the terminology and presentation of fuzzing
algorithms. (30/2854, 30 s)

## Some selected comments

CFI here is shitty for fuzzing, which should not be listed here.

The initial set is under-valued. In this presentation, the initial set is part
of the configuration. However, when we provide a good set of initial seeds, the
fuzzer can only focus on exploitability.

Pay attention to what are the problems in this field, what are solved, and what
are not solved.

Do you think this paper is useful for terminology uniformity? Answer: Yes, but I
do not think we have the agreement in practice. Scholars create their own
terminologies all the time.

[^1]: [The Art, Science, and Engineering of Fuzzing: A Survey](https://arxiv.org/pdf/1812.00140.pdf)
[^2]: [Fuzzing: Hack, Art, and Science](https://wcventure.github.io/FuzzingPaper/Paper/CACM20_Fuzzing.pdf)