# How to Do [System|Software] (Security) Research

## Where to find a problem
Most practical ideas come from our research activities. Usually, we can read and
propose a new idea after reading a paper. However, there would be a delay.
First, a research paper would be published two years later than its authors came
up with that idea. Second, even though some PC members can check all interesting
papers submitted to a conference, there is about half a year or one-year delay.
How can we fill the gap? No, we cannot unless we are connecting or collaborating
with these scholars. Another source of research ideas is practical requirements
from users. This source is so inefficient unless we are connecting or
collaborating with industry people. **Practical ideas come from our research
activities, and we should be curious about everything in our research activities
all the time.** To make it more clear, we can put it in this way. We can study
everything. Whenever we find or hear of a thing, we should show our interests
and clarify the motivation to study it. **Of course, do not forget our
connection with the academic and industrial community in which inevitable
benefits will come as well.**

## How to define a problem
Before going further, I would like to discuss the types of knowledge. One type
of knowledge looks forward, and the other focuses on backward. Classifying
research ideas in computer science bridges computer science to other
disciplines. Physics looks forward, and history looks backwards. We should also
think in this way during our research activities. Designing a system looks
forward while reviewing literature looks backwards. Learning the history of all
science helps to improve our research quality of ideas, evaluation, and writing.
**Here, we have the first category we should judge for a thing to be studied:
looking forward or looking backwards.**

A thing is an object to be studied. During our activities, we always do
something. We should be curious about a thing since it would be our research
object. An object can be a thing in the real world, for example, a piece of
software; an object can be a process of humans, for example, developing a piece
of software. We can see similarities and differences between them.
Interestingly, if we focus on a thing itself, the research problems would look
forward; if we focus on a human process, the research problems look backwards.
**Here, we have the second category: a thing or a human process.**

Define a looking-forward problem starting from its nature while defining a
looking-backwards problem starting from history. To make our research more
scientific, we should avoid some construction problems that usually make
computer science (and technology) to computer engineering in which all
scientific parts hide. For a looking-forward problem, we have to define what to
predict, and for a looking-backwards problem, we should define what to
summarize.
**Here, we have the third category: nature and history.**

BTW, check [this
article](https://medium.com/digital-diplomacy/how-to-look-for-ideas-in-computer-science-research-7a3fa6f4696f)
to learn the patterns of research and other tips.

## How to evaluate the problems
Now, we have two simple problems: what to predict and what to summarize. We have
to introduce more principles to evaluate our problems because not all problems
are worthy of study.

The first question is whether a problem is generic. **We have to check whether
this problem has many instances in the real world, such that the real impact is
there.**

The second question is whether a problem is solvable. We have to seek help from
the computation theory and estimate what the best we can do. **We should
carefully take reasonable assumptions and think of several
solutions.**

The third question is whether our solutions are applicable to other scenarios.

Other tricks are in the following.
+ Please pay attention to how many papers and how many efforts exist. You may
want to be at the beginning (0-2 papers) or not later than the peak (it
depends.) of the publication wave related to our problems.

## How to evaluate the ideas
Remember that not all ideas can be accepted by top-tier conferences. One is the
**novelty**, and the other is **superiority**. To be novel, we have to do a
literature review and distinguish our idea from others’. Because of the time
budget, we cannot make our idea superior to others in every aspect, and thus we
can choose the core metrics. The core metrics evolve among the development of
the whole community. Some technology becomes mature such that some metrics are
easier to achieve. Such easier metrics are not the core metrics but that we have
to include. Consider all techniques we can use to be superior.

OK. Let us do it! To save time, we are not supposed to make many mistakes.
Nowadays, the computer science research community is competitive because not
only most of the problems are easier to solve but also more and more people join
us. When reviewers scan a manuscript, they pick up our mistakes and reject the
papers that have more. Here are some tips from past research activities to
evaluate our ideas quickly.

### Budge our time
- **Tell ourselves the DDL is two weeks in advance**
- **Always consider what we are doing to be some paragraph in the paper and never do it twice.**
- **Think and ask ourselves about what is the fastest way to do this and then do it.**
- **Spend 30 seconds more to save us from a 30 mins disaster.**
- It is the context switch that wastes a lot of time.
- Spend less than one day on a project we are not the first author.
- Take holidays every four or five months: e.g., Chinese Spring Festivals, Labor Days, and National Holidays. 

### Know what we are going to do
- **Review papers, run their systems, and write the summary (related work)**
- **Identify challenges and evaluate solutions in theory (challenges, insights, solutions)**
- **Design system and evaluate design choices in theory (background, system design)**
- **Implement a generic prototype and write evaluation scripts (implementation, evaluation)**
- **Write our paper in advance and get feedback from others**.

## Some tips about parallel tasks
- Be busy when it is busy and have fun when it is not busy
- Create a task, think about the solutions, importantly, think about why our results are not correct
- Write our task down before we start and close it after we finish it (**I am using Marp (Markdown Slides).**)
- Do not delete any data if we are definitely sure. Just buy more storage!
- Utilize all hardware resources we have.

## How to sell our idea

### Write a good paper
- Keep learning to write a paper
- Reader-centered writing
- Unity, Support, and Coherent
- Revise context and sentences, and do editing

### Advertise
- Homepage
- Twitteriture
- Group
- Main conference session
- Poster session

## How to solve a problem (WIP)

This section is new and inspired by some social science disciplines. In general,
we will define a problem as a computation problem in computer science. In
practice, we will use possible threat models, system primitives, existing tools,
and existing algorithms. Besides, we think about decidability, time, and storage
complexity. However, we can do more than that. 

### Classification

Classification is the first naive and powerful tool we are supposed to use. In
fact, we use this tool implicitly every day. When we are talking about fuzzers,
we will split them into black-box, white-box, and grey-box fuzzers. If someone
asks we what is this, why is this, and how is this, probably the first answer
is to ask what categories are of "this". If someone asks we what our favourite
food is, we may ask: what categories of food we are asking?