# Pattern Recognition for Algorithms

This guide starts from two questions I want answered for every problem on NeetCode 250. First, given a problem, how do I map it to the algorithm it actually needs, which means understanding when that algorithm is useful in the first place, not just what it does. Second, once I know which algorithm fits, what shape does the code for it usually take.

So for every pattern, hashing, two pointers, sliding window, whatever comes next, I am not just recording the code that solves a category of problems. I am trying to write down the specific signal in a problem statement that should make a pattern come to mind before any code gets written.

Each pattern gets split into three files, and the split maps onto three separate questions.

`intro.md` answers what the tool actually is, stripped of any problem attached to it. For hashing, that means starting with the plainest possible definition, a hash map is key-value storage, and only then getting into how it behaves in memory and what shape it takes in a specific language.

`intuition.md` answers when the tool applies. This is the file I care about most, since recognition is the harder half once the syntax is memorized. Rather than one broad rule, each pattern gets broken into a small number of plain questions a problem might secretly be asking, seen before, how many times, does something else complete this, which things belong together, for hashing specifically. Each question comes with one real problem worked through in full, no code, just the reasoning for why that problem is that question in disguise.

`implementation.md` answers how the code looks once we already know which question we are answering. These are the skeletons worth knowing from memory, so that recognizing the pattern is the only hard part left, writing it becomes mechanical.

Hashing is finished first, working through Contains Duplicate as the walked example under its matching question. More patterns follow the same three-file shape as they get written.
