# Sliding Window: Asking the Right Questions

## Seeing it in a statement

Reverse engineering a sliding window problem starts with the shape of the answer. The wording cues are "subarray", "substring", "contiguous", or "consecutive elements", together with "longest", "shortest", "at most `k`", "of size `k`", or "contains all of". These say the answer is one unbroken stretch of the input, and the plain solution tries every start and every end.

Next, look at what the problem tracks about a stretch, a sum, a count, a set of characters. The question to ask is whether adding an element on the right always pushes that value one way, and removing one on the left always pushes it back. A sum of non-negative values passes, a count passes, a sum with negative values does not. If it passes, a stretch that went bad can always be fixed by trimming its left end.

The link to the pattern is made by naming what moves the left edge. The right edge advances every step, and the left edge moves when the stretch passes a given size, while it is invalid when the goal is the longest, or while it is still valid when the goal is the shortest. If that rule can be stated in a sentence, the problem is a sliding window.

Some statements never mention a stretch. If elements are taken from the two ends, the part left in the middle is a stretch. If sorting puts the elements that matter next to each other, the sorted order holds one. The last check rules out the neighbors, a tracked value that can move either way sends the problem to [Hashing](../hashing/asking-the-right-questions.md), and nothing to undo when a pointer moves sends it to [Two Pointers](../two-pointers/asking-the-right-questions.md).

Five problems follow, each read from its statement to the pattern with this chain. For every one, what the statement says, the words that give the pattern away, and the logic that confirms it. No code here, the code lives in Implementation and Examples.

## 1. Find All Anagrams in a String

**The statement.** [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/description/) gives two strings, `s` and `p`, and asks for every starting index in `s` where an anagram of `p` begins.

**What gives it away.** An anagram of `p` is a substring of `s`, so the answer is about contiguous stretches. And an anagram has exactly `p`'s length, so the size of the stretch is handed over.

**Why it fits.** Every stretch of `s` with `p`'s length is a candidate, and each one is checked by comparing letter counts with `p`, a Frequency question from hashing. Sliding forward by one changes exactly two letters, one leaves and one enters, so the counts are adjusted rather than rebuilt. The left edge moves whenever the stretch grows past `p`'s length. Hashing decides what a match is, the window decides how every position gets checked.

## 2. Fruit Into Baskets

**The statement.** [Fruit Into Baskets](https://leetcode.com/problems/fruit-into-baskets/description/) describes a row of trees, each with one type of fruit, and two baskets that each hold one type. Starting at any tree and moving right, one fruit is picked from every tree, stopping at the first tree whose fruit fits in neither basket. It asks for the most fruit that can be picked.

**What gives it away.** The story hides the stretch. "Start at any tree, move right, pick from every tree, stop" describes a contiguous run of trees. "Two baskets, one type each" says the run can hold at most two different types. "The most fruit" asks for the longest such run. Stripped of the story, the question is the longest subarray with at most two distinct values.

**Why it fits.** Adding a tree can only keep or raise the number of distinct types, and dropping the leftmost tree can only keep or lower it, so the direction holds. This is the maximizing form, the right edge always advances, and the left edge moves only while the run holds three types, with a count map tracking how many of each type are inside.

## 3. Minimum Window Substring

**The statement.** [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/description/) gives two strings, `s` and `t`, and asks for the shortest substring of `s` that contains every character of `t`, duplicates included.

**What gives it away.** "Shortest substring" is a best size over a contiguous stretch. "Contains every character" is a threshold to reach, which makes this the minimizing form.

**Why it fits.** Adding a character to the stretch can only cover more of `t`, and removing one can only cover less, so the direction holds. The right edge advances until the stretch covers all of `t`. Then the left edge moves while the stretch still covers it, and each of those steps is a chance at something shorter. A count of how many of `t`'s characters are fully covered makes "is it still valid" a single comparison.

## 4. Subarray Product Less Than K

**The statement.** [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k/description/) gives an array of positive integers and a number `k`, and asks how many contiguous subarrays have a product less than `k`.

**What gives it away.** "Contiguous subarrays" is the stretch. The answer is a count, not a best size, which looks unlike the other forms at first. The word that settles it is "positive".

**Why it fits.** Every value is at least `1`, so multiplying in a new value can never shrink the product, and dividing out the leftmost value can never grow it. That is the direction check, and it passes. For each right edge, the left edge moves until the product drops below `k`. At that point every stretch that ends at the right edge and starts anywhere from the left edge onward is valid too, since removing values from the left of a valid stretch only lowers its product, so all of them are counted at once.

The same problem with negative numbers or zeros allowed fails the check, since a product could flip sign or collapse to zero as the stretch grows. [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/description/) fails it for the same reason, and goes to [Hashing](../hashing/asking-the-right-questions.md).

## 5. Minimum Operations to Reduce X to Zero

**The statement.** [Minimum Operations to Reduce X to Zero](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/description/) gives an array of positive integers and a number `x`. Each operation removes the leftmost or rightmost element and subtracts it from `x`. It asks for the fewest operations that bring `x` to exactly `0`, or `-1` if it cannot be done.

**What gives it away.** No subarray is mentioned, and the removed elements come from two ends, so they are never one contiguous stretch. What stays behind is. Removing from both ends always leaves one unbroken block in the middle. The wording cue is "leftmost or rightmost".

**Why it fits.** The removed elements sum to `x`, so the block left behind sums to the total minus `x`. Fewest operations means removing as few elements as possible, which means the longest block in the middle with that exact sum. All values are positive, so the direction holds. This is the maximizing form, with the left edge moving while the block's sum is too big. A pointer at each end taking the larger value, which two pointers would suggest, has no safety argument here, since a small value at an edge can hide exactly the value needed behind it.

## What the five share

Every one is about a contiguous stretch, written in the statement, hidden in a story, or hidden in what is left behind. In every one, adding an element moves the tracked value one way and removing one moves it back, and the problem stops at that check whenever negative numbers or zeros could break it. Once both hold, the remaining question is what moves the left edge, a given size, an invalid stretch, or a stretch that is still valid. When moving a pointer undoes nothing, the problem belongs to [Two Pointers](../two-pointers/asking-the-right-questions.md) instead.
