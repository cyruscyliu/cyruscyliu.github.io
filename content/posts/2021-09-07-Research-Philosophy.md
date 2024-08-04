# How to do system and software security research?

## What is system and software security?

We in system and software security aims to break and protect the assets that
leverage hardware and software to provide widely-used services, such as
browsers, compilers/interpreters, network protocols, operating systems,
hypervisors, trust execution environment, and processors, based on thread models
that define who will be trusted or not.

- A group of people are also interested in sound and electromagnetic waves,
leveraging a complete different field of knowledge -- signal processing. Their
research is likely offensive. By definition, I think such research is a branch
of system and software security. The biggest problem IMO is whether they can
gain write primitives besides breaking the confidentiality and availability.

- Pure cryptography is mathematics. Applied cryptography has a small overlap
with system and software security -- we apply very basic cryptography as a
mechenism to provide confidentiality.

- System people build systems and consider security as one of the properties
their systems should have. My gut feeling is that system people is used to
taking coarse-grained threat models when considering security compared to
security people. Additionally, security people also build systems to break and
protect assets.

- Software engeering research is around software development lifecycle (SDLC).
Similary, they also consider security as one of the properties they want to have
in the SDLC. We security people emphasize vulnerabilities and exploitations.

- Privacy preserving computation focuses on the privacy problem during the
computation, exchanging, and storage of data. It might needs system and software
security techniques, but that's it.

- AI research is about data, models, and computing power. AI security aims to
break and protect the high-dimensional function of the model. Importantly, AI
infrastructure security has a overlap with system and software security, such as
AI compiler security, GPU virtualization and isolation, and LLM prompt sandbox.

- Technically, blockchain is about consensus. In practice, blockchain has
abundant applications in finance, which is impressive. Similary, blockchain
infrastructure security has a overlap with system and software security, such as
smart contract security.

## Where are the ideas from?

An idea consists of a problem and a solution.

First, we can read and propose a new idea after reading a paper. However, there
will be a delay. One the one hand, a research paper is published two years later
than its authors came up with that idea. One the other hand, even though some PC
members can check all interesting papers submitted to a conference, there is
about half a year or one-year delay. Can we fill the gap? No, we cannot unless
we are connecting or collaborating with these authors.

Ideas can also come from users, which is so inefficient unless we are connecting
or collaborating with industry people.

In practice, the first idea comes from our advisors. Later, practical ideas come
from our research activities, and we should be curious and critical thinkers
about everything in our research activities all the time. Whenever we study, or
find or hear of a thing, we should show our interests: What security problems
are there? How to address them?

Check [this
article](https://medium.com/digital-diplomacy/how-to-look-for-ideas-in-computer-science-research-7a3fa6f4696f)
to learn the patterns of research and other tips.

## There are too many ideas and how to decide?

The security research community has grown a lot. More PhD students generate more
papers due to cheap resources (computing power, ChatGPT, etc.). Rat-race is
going on and we have to fast forward our visibility by building our brand. In
practice, we have to choose a topic where we can do resesarch for four to five
years continously. Ask our advisors.

In terms of a specific topic, we have to evaluate our ideas because not all of
them are worthy of our effort.

Principle 1: choose a good problem

- think about the problem first instead of having a solution first
- a new problem is always better
- the problem is easy to understand and has clear benefits
- choose a problem with large security impact if the novelty is little

Principle 2: choose a solvable problem

- solving a easy problem does not need a paper
- take reasonable assumptions and come up with several solutions
- know the optimal: consider the computation theory and estimate what the best we can do
- choose a solution with large security impact if the novelty is little
- seperate design and implementation

Principle 3: must read related work to see how far they have gone. Please pay
attention to how many research papers and industry blogs exist. You want to lead
the research (there are only 0-2 papers) instead of following others. Do not be
ignorant and remember your personal experience is biased.

## Tips to do research

### Budge our time

- Mark the DDL two weeks in advance
- Spend 30 seconds more to save us from a 30-minute disaster
- Do not do many context switches, which wastes a lot of time
- Spend less than one day on a project we are not the first author
- Be busy when it is busy and have fun when it is not busy
- Take holidays and weekends after submissions

### What we are going to is what we are going to write

- Review papers, run their systems, and summarize (RW)
- Identify challenges and evaluate solutions in theory (challenges, insights, solutions)
- Design system and evaluate design choices in theory (system design)
- [Coding](./2021-09-03-Summary-Research-SE.md) and write evaluation scripts (IMPL, evaluation)
- Write the paper at the same time and get feedback from others

### Set up servers

- What architectures should we use? How many servers do we have?
- Are we in the `sudo` group?
- Save runtime/intermediate data on SSD and save results on HDD.
- Do we need to disable the hyper-threading?
- Buy more CPU, RAM, and storge. 

### Do evaluation

- All in Docker container
- Make it parallel
- Obtain quick results first, middle-long results for writing, then long time evaluation for submission
- Go for diversity first, then quantity
- Do not delete any data if we are sure. Just buy more storage!
- Do not make the hardware have a rest.

## Write a good paper

- Tell a well-constructed story (information-flow, the pyramid principle)
- Conduct reader-centred writing: straightforward and clear
- Writing process
    + drafting: everyone is good!
    + revising: focus, support, coherence
        - a paragraph should have one topic sentence
        - multiple topic sentences should be logical
        - support material must be specific
        - logic should be clear
    + editing: grammar, word choice, sentence skill
        + pay attention to a/an/the, single/plural, could/should
        + choose words for all levels of reviewers
        + choose a word that has only one meaning
        + use few metaphors
        + don't have formal analysis
    + proofreading: everyone is good!
- Minimize disadvantages
- Our solutions apply to other scenarios
- Our tools have good usability

### Necessity for reader-centred writing

- Too many papers submitted but not enough reviewers
- Too many DDLs so that a reviewer at most up to 1 day (maybe half) to figure
out what we did. Good-writing paper save reviewer's time. Otherwise, he will
leave a message "I couldn't figure out the contributions due the bad writting".
