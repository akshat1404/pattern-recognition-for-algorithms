# Pattern Recognition for Algorithms

This guide starts from two questions I want answered for every problem I come across. NeetCode 250 is my reference for which patterns to cover, but the problems worked through here can come from anywhere. First, given a problem, how do I map it to the algorithm it actually needs, which means understanding when that algorithm is useful in the first place, not just what it does. Second, once I know which algorithm fits, what shape does the code for it usually take.

So for every pattern, hashing, two pointers, sliding window, whatever comes next, I am not just recording the code that solves a category of problems. I am trying to write down the specific signal in a problem statement that should make a pattern come to mind before any code gets written.

The Decision Tree page is where to start with a problem cold. It asks a small number of questions about the problem statement and narrows down which pattern to open first. Each chapter after it goes deep on one pattern, split into five pages, and the split maps onto five separate questions.

`intro.md` answers what the tool actually is, stripped of any problem attached to it. For hashing, that means starting with the plainest possible definition, a hash map is key-value storage, and only then getting into how it behaves in memory and what shape it takes in a specific language.

`intuition.md` answers when the tool applies. This is the page I care about most, since recognition is the harder half once the syntax is memorized. It builds the reasoning from the brute force up, so the pattern comes out of the problem instead of appearing from nowhere.

`asking-the-right-questions.md` answers how to tell the pattern apart from its neighbors. Two patterns can look the same on the surface, and this page puts real problems on each side of the line, with the question that separates them.

`implementation.md` answers how the code looks once we already know which question we are answering. These are the skeletons worth knowing from memory, so that recognizing the pattern is the only hard part left, writing it becomes mechanical.

`examples.md` works through problems one at a time, easy to hard, with the reasoning and the code together. Some of them reframe the problem first, and some are not on NeetCode 250 at all, since a pattern's difficulty range is wider than any one list.

Hashing, Two Pointers, and Sliding Window are written so far. More patterns follow the same shape as they get written.
