---
date: 2025-04-16
categories:
    - how-to-do-research-series
---

# Doing Research - Part 2: How to do system security research?

## What is system security?

We aims to break and protect the assets that leverage hardware and software to
provide widely-used services, such as browsers, compilers/interpreters, network
protocols, operating systems, hypervisors, trust execution environment, and
processors, based on thread models that define who will be trusted or not.

<!-- more -->

### Algorithms

- Pure cryptography is mathematics. Applied cryptography has an overlap with
system and software security -- we apply very basic cryptography as a mechenism
to provide confidentiality.

- Privacy preserving computation focuses on the privacy problem during the
computation, exchanging, and storage of data.

- Trustworthy AI foundamentally aims break and protect the high-dimensional
function of the model.

### Software and hardware

- System people build systems and consider security as one of the properties
their systems should have. Instead, security people do not care too much about
the business.

- Software engeering research is around software development lifecycle (SDLC).
Similary, they also consider security as one of the properties they want to have
in the SDLC. Security people emphasize vulnerabilities and exploitations.

### Niche systems

- Cloud, embedded devices, and personal computers are fully connected, which
requires secure collaborative computing.

- Blockchain is about consensus. In practice, blockchain has abundant
applications in finance, which is impressive.

- AI systems differ from traditional IT systems due to the change in the whole
software and hardware stack.

## Where are the ideas from?

An idea consists of a problem and a solution.

- Business metrics driven: the ideas are from industry. We work in industry, or
we get gift funding from industry.

- National research funding driven: the ideas are shaped by the national funding
agencies, who are responsible for implementing national stratigies.

- Paper driven: we can read and propose a new idea after reading a paper.
However, there will be a delay. One the one hand, a research paper is published
two years later than its authors came up with that idea. One the other hand,
even though some PC members can check all interesting papers submitted to a
conference, there is about half a year or one-year delay.

- Research activity driven: The first idea may come from our advisors.  Later,
practical ideas are from our research activities, and we should be critical
thinkers.

Check [this
article](https://medium.com/digital-diplomacy/how-to-look-for-ideas-in-computer-science-research-7a3fa6f4696f)
to learn the patterns of research. 

## There are too many ideas and how to decide?

The security research community has grown a lot. More PhD students generate more
papers due to cheap resources (computing power, ChatGPT, etc.). Rat-race is
going on and we have to fast forward our visibility by building our brand. In
practice, we have to choose a topic where we can do resesarch for four to five
years continously. Ask our advisors.

In terms of a specific topic, we have to evaluate our ideas because not all of
them are worthy of our effort.

Principle 1: choose a good problem

- problem first then solution
- a new problem is always better
- the idea is easy to understand and has clear benefits
- should have large security impact if the novelty is little

Principle 2: choose a hard problem

- solving a easy problem does not need a paper
- take reasonable assumptions and come up with several solutions
- know the optimal: consider the computation theory and estimate what the best
we can do, then do an approximation

Principle 3: must read related work to see how far they have gone. Please pay
attention to how many research papers and industry blogs exist. You want to lead
the research (there are only 0-2 papers) instead of following others. Do not be
arrogant and remember your personal experience is biased.

## Tips to do research

### Budge our time

- Mark the DDL two weeks in advance
- Spend 30 seconds more to save us from a 30-minute disaster
- Do not do many context switches, which wastes a lot of time
- Spend less than one day on a non-first-author project
- Be busy when it is busy and have fun when you should have fun
- Take holidays and weekends after submissions (for PhDs)

### What we are going to is what we are going to write

- Review papers, run their systems, and summarize (RW)
- Identify challenges and evaluate solutions in theory (challenges, insights, solutions)
- Design system and evaluate design choices in theory (design)
- [Coding](p5-Summary-Research-SE.md) and write evaluation scripts (IMPL, evaluation)
- Write the paper at the same time and get feedback from others

### Do evaluation

- All in Docker container
- Make it parallel
- Obtain quick results first, middle-long results for writing, then long time evaluation for submission
- Go for diversity first, then quantity
- Do not delete any data if we are sure. Just buy more storage!
- Do not make the hardware have a rest.

## Write a good paper

- Tell a well-constructed story (the pyramid principle)
- Conduct reader-centred writing: straightforward and clear
- Minimize disadvantages
- Writing process
    + drafting: everyone is good!
    + revising: focus, support, coherence
        - a paragraph should have one topic sentence
        - support material must be specific
        - multiple topic sentences should be logical
    + editing: grammar, word choice, sentence skill
        + pay attention to a/an/the, single/plural, could/should
        + choose words for all levels of reviewers
        + choose a word that has only one meaning
        + use few metaphors
        + don't have formal analysis
    + proofreading: get first around feedback from "reviewers"

### Necessity for reader-centred writing

- Too many papers submitted but not enough reviewers
- Too many DDLs so that a reviewer at most up to 4 hours to figure out what we
did. Save their time!
