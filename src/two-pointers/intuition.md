# Intuition

## The trade

A brute force approach to most two-pointer problems checks every pair of positions against each other, an index `i` against every other index `j`, O(n^2). Two pointers replaces that nested loop with two positions moving through the data once, but only when the data has enough order to justify it.

The condition to check for this pattern: at every step, can we prove that moving one specific pointer can never cause us to miss a better answer. If yes, two pointers is safe. If that argument can't be made, the data isn't ordered enough, and two pointers isn't the right tool.

## Position carries information

The reason order matters this much comes down to one thing, in ordered data, knowing where a value sits tells us something true about it, without needing to look anything up.

Take a sorted array, `[2, 7, 11, 15]`, target `9`. `left` at index `0` holds `2`, `right` at index `3` holds `15`, sum `17`, too big. Because the array is sorted, `nums[right]` being at the far right guarantees it's the largest value remaining in range, and it's already too big paired with `2`, the smallest value remaining. Every other value left in range is at least `2`, so pairing `15` with any of them can only produce a sum of at least `17`, still too big. We know this for every remaining index without checking a single one of them, purely because `15`'s position told us it was the max.

Compare that to an unsorted array. Knowing something sits at index `3` tells us nothing about its size relative to index `0`. We'd have to actually read both values, position and value are unrelated. That's what a hash map exists to fix in the unordered case, a lookup instead of a positional guarantee. When the data is ordered, position already gives us that guarantee for free, and the lookup structure becomes redundant.

Order doesn't have to mean sorted by value, either. Sorted is the strong case, value order and position order match exactly, which is what lets a problem reason directly about a target sum from the two pointers' values. But a weaker, still sufficient version of order shows up often too, a fixed sequence with nothing scrambled about which position comes before which. [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/description/) has positional order with no numeric order at all. [Container With Most Water](https://leetcode.com/problems/container-with-most-water/description/) gets its width for free from position, `right - left`, and a safety argument, the shorter wall caps the area no matter what's on the other side, from the values, neither needs sorting. [Move Zeroes](https://leetcode.com/problems/move-zeroes/description/) only needs the original relative order preserved, nothing numeric at all.

## When to reach for it

Two questions, in order. First, is the data ordered, sorted, or at least laid out in a fixed sequence where position means something. If no, two pointers is off the table. Second, would this problem otherwise need a hash map or an extra array to remember something, and does the data's order make that memory redundant. If both answers are yes, that's two pointers.

## The three shapes

Two of these live on arrays and strings, and share a mechanism, random access, the ability to jump to any index or compare two positions directly. The third lives on a linked list, and works differently by necessity, no random access, no stepping backward, only `.next`.

1. Converging: one pointer at each end of ordered data, moving inward. The decision at each step comes from directly comparing the values at `left` and `right` (or their sum) against a target. Signal: sorted array, looking for a pair or triplet meeting some target condition. Two Sum II, 3Sum, Container With Most Water.

2. Fast and Slow (compaction): both pointers start at the same end, moving the same direction. The decision comes from looking at the single value under `fast`, compared against whatever's already been kept at `slow`. Signal: modify or filter an array in place, without extra space, in one pass. Remove Duplicates from Sorted Array, Move Zeroes.

3. Linked List: both pointers start at the same node, moving at different speeds or from staggered starts. No index comparison is possible here, only relative position or relative speed. Signal: a linked list problem asking about a cycle, a middle node, or a node a fixed distance from the end. Cycle detection, finding the middle of a list.

Across all three, the decision at every step comes from the pointer values themselves, or a direct comparison between them, at most alongside a small monotonic running value that only ever grows and never needs correcting, like Trapping Rain Water's running `maxLeft` and `maxRight`.

## Where the answer actually comes from

It's tempting to assume the final answer is always just whatever the two pointers point to when they stop, but that's only true for some of these problems.

For a single matching pair, Two Sum II, Container With Most Water, the answer really is built entirely from `left` and `right`, nothing else. But 3Sum keeps a third value, `nums[i]`, fixed outside the two moving pointers, and the real answer is all three values together. Fast/Slow compaction's answer, the final array or its length, is the accumulated result of every decision made across the whole pass, not a comparison of two current values. Valid Palindrome's `true` case is the absence of any mismatch across the entire walk, only a `false` result traces back to one specific pointer pair.

So the reliable claim is narrower than it first seems: each step's decision comes from the two pointer values. The final answer sometimes is that same comparison, sometimes needs an extra anchor alongside it, and sometimes is a property of the whole walk rather than any single step.

## The boundary against sliding window

Two pointers and sliding window can look identical at a glance, same starting position, same direction of travel. The difference is what decides the next move. Two pointers decides from the pointer values directly, or a running value that only ever grows. Sliding window decides from an aggregate over the entire current window, a sum, a count, a frequency map, and that aggregate has to be actively adjusted both ways, added to when the window grows, subtracted from when it shrinks. If undoing part of what's being tracked is ever necessary when a pointer moves, that's sliding window, not two pointers.
