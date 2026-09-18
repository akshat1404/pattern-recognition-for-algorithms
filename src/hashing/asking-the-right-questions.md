# Asking the Right Questions

## The boundary against two pointers

Everything in the intuition chapter assumes position doesn't matter, only the value does. That assumption is worth checking explicitly, because the moment position starts carrying information on its own, a hash map stops being the cheapest tool, even for a problem that looks identical on the surface.

[Two Sum](https://leetcode.com/problems/two-sum/description/) is the clearest case. The array is unsorted, so nothing about where a value sits tells us anything about its size relative to another value, the only way to know if a complement exists is to have recorded it, a hash map. [Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/) asks the exact same question, does some pair sum to a target, but the array is sorted now. Position tells us something for free, the rightmost value in range is the largest remaining, so two pointers converging from both ends replaces the map entirely, no lookup needed.

[Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/description/) is worth including here because it looks positional and isn't. The word "sequence" suggests order matters, but the array is unsorted and stays that way, what the problem actually asks is whether consecutive values exist, `n`, `n + 1`, `n + 2`, regardless of where they sit in the input. That's still a pure value question, seen-before, answered with a set, nothing about position or sorting required.

So the test, in order: does the problem only care about a value's existence, count, or what completes it, with array order irrelevant to the answer. If yes, hashing. If sorting the input would let position itself answer part of the question, that's the signal to check [Two Pointers](../two-pointers/intro.md) instead.
