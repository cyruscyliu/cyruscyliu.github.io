# How to Do [System|Software] (Security) Research

## Where to find a problem

Most practical ideas come from our research activities.

Usually, we can read and propose a new idea after reading a paper. However,
there would be a delay. First, a research paper would be published two years
later than its authors came up with that idea. Second, even though some PC
members can check all interesting papers submitted to a conference, there is
about half a year or one-year delay. How can we fill the gap? No, we cannot
unless we are connecting or collaborating with these scholars.

Another source of research ideas is the practical needs of users. This source is
so inefficient unless we are connecting or collaborating with industry people.

**Practical ideas come from our research
activities, and we should be curious and critical thinkers about everything in
our research activities all the time.** To make it more clear, we can put it
this way. Whenever we study, or find or hear of a thing, we should show our
interests and clarify the motivation behind it by asking **why**.

Of course, do not forget our connection with the academic and industrial
community.

## How to define a problem

**Look forward or look backwards** Before going further, I would like to discuss
*the types of knowledge. One type
of knowledge looks forward, and the other focus backwards. Classifying research
ideas in computer science bridges computer science to other disciplines. Physics
looks forward, and history looks backwards. We should also think in this way
during our research activities. Designing a system looks forward while reviewing
literature looks backwards. Learning the history of all science helps to improve
our research quality of ideas, evaluation, and writing.

**A thing or a human process** A thing is an object to be studied. We should be
*curious about anything since it would be our research
object. An object can be a thing in the real world, for example, a piece of
software; an object can be a process of humans, for example, developing a piece
of software. Interestingly, if we focus on a thing itself, the research problems
would look forward; if we focus on a human process, the research problems look
backwards.

**Define a looking-forward problem starting from its nature while defining a
looking-backwards problem starting from history**. To make our research more
scientific, we should avoid some construction problems that usually make
computer science (and technology) into computer engineering in which all
scientific parts hide. For a looking-forward problem, we have to define what to
predict, and for a looking-backwards problem, we should define what to
summarize.

BTW, check [this
article](https://medium.com/digital-diplomacy/how-to-look-for-ideas-in-computer-science-research-7a3fa6f4696f)
to learn the patterns of research and other tips.

Now, we have two simple problems: what to predict and what to summarize. We have
to introduce more principles to evaluate our problems because not all problems
are worthy of study.

The first question is whether a problem is generic (or important). **We have to
check whether this problem has many instances in the real world, such that the
real impact is there.**

The second question is whether a problem is solvable. We have to seek help from
the computation theory and estimate what the best we can do. **We should
carefully take reasonable assumptions and think of several solutions.**

The second question is whether existing solutions have solved the problem
already. **We should tell a clear and convincing story.**

Other tricks are in the following.

+ Please pay attention to how many papers and how many efforts exist. You may
want to be at the beginning (0-2 papers) or not later than the peak (it depends
on the publication wave related to our problems).

## How to evaluate the ideas

Remember that not all ideas can be accepted by top-tier conferences. One is the
**novelty**, and the other is **superiority**. To be novel, we have to do a
literature review and distinguish our idea from others’. Because of the time
budget, we cannot make our idea superior to others in every aspect, and thus we
can choose the core metrics. The core metrics evolve among the development of
the whole community. Some technology becomes mature such that some metrics are
easier to achieve. Such easier metrics are not the core metrics, but that we
have to include. Consider all techniques we can use to be superior and tell why.

Besides, it's better to have the following achievements.

+ Our solutions apply to other scenarios.
+ Our tools can solve real-world problems and have good usability.

OK. Let us do it! We have to be quick, and we are not supposed to make many
mistakes. Nowadays, the computer science research community is competitive
because not only most of the problems are easier to solve but also more and more
people join us. When reviewers scan a manuscript, they pick up our mistakes and
reject the papers that have more. Here are some tips from past research
activities to evaluate our ideas quickly.

### Budge our time

- **Tell ourselves the DDL is truly two weeks in advance.**
- Always consider what we are doing to be some paragraph in the paper and never do it twice.
- Think and ask ourselves about what is the fastest way to do this and then do it.
- Spend 30 seconds more to save us from a 30 mins disaster.
- It is the context switch that wastes a lot of time.
- Spend less than one day on a project we are not the first author.
- Take holidays every four or five months: e.g., Chinese Spring Festivals, Labor Days, and National Holidays.

### Know what we are going to do

- **Review papers, run their systems, and write the summary (related work)**
- **Identify challenges and evaluate solutions in theory (challenges, insights, solutions)**
- **Design system and evaluate design choices in theory (background, system design)**
- **Implement a generic prototype and write evaluation scripts (implementation, evaluation)**
- **Write our paper in advance and get feedback from others**.

### Set up servers

- What architectures should you use? How many servers do you have?
- If you are in the `sudo` group?
- **Save runtime/intermediate data on SSD and save results on HDD.**
- If there is no storage? Buy more!
- If you disabled the hyper-threading?

### Write evaluation scripts

- **All in Docker container.**
- **Make it parallel.**
- **Quick results first, middle-long results for writing, then long time evaluation for submission.**
- **Diversity first, then quantity.**

## Some tips about parallel tasks

- Be busy when it is busy and have fun when it is not busy
- Create a task, think about the solutions, importantly, think about why our results are not correct
- Write our task down before we start and close it after we finish it (**I am using Marp (Markdown Slides).**)
- Do not delete any data if we are sure. Just buy more storage!
- Utilize all hardware resources we have. Do not make them have a rest.

## How to sell our idea

### Write a good paper

- Tell a well-constructed story
- Conduct reader-centred writing: straightforward and clear
- Write in unity, support, and coherence
- Find reviewers who haven't joined your discussion
- Revise context and sentences, and do editing
- Minimize disadvantages.

### A detailed analysis at the story level

1. What we cannot control
    - How many papers were submitted to a conference and the target acceptance rate.
    - Which reviewers would revise our paper, and how they know about what we are doing.
2. What we can control
    - Importance/Novelty/Superior
    - Reasonable techniques and good enough implementation
    - Clear writing
    - Handle small flaws
3. Storyline
    - Importance, limitations of existing work, new theory and new techniques, evaluation
4. Title: Summary of our work; Be attractive; No details
5. Abstract: 2-minute storyline; Use hypernyms; No technical details;
6. Introduction: 10-minute storyline; Show rationals; No concrete details;
7. Background: Big background; Terminologies; Motivating Example
8. System, Implementation, and Evaluation: Problems -> Approaches -> Why -> How well
9. Related work: Introduce related works and Highlight the difference
10. Discussion: Answer reviewers' questions and hint the future work
11. Conclusion: Summarize and extract new knowledge

### Clear writing in the section and paragraph-level

- Each paragraph has its goal. Make sure the topic sentence highlights the goal.
- Schema of a concept: Concept Name: Definition of concept. Example of Concept.
- A strong argument includes 1) point, 2) theoretical argument (papers), 3)
factual argument (data).
    - Be confident but do not overclaim.
    - Be critical but be not rude.
- Schema of the introduction of a section: Description; Importance; Links.

## Advertise

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
asks us what is this, why is this, and how is this, probably the first answer is
to ask what categories are of "this". If someone asks us what our favourite food
is, we may ask: what categories of food we are asking?