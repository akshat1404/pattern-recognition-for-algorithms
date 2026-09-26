# Asking the Right Questions

## The boundary against two pointers

Two pointers and sliding window can walk through an array the same way, same starting point, same direction of travel. What separates them is whether anything has to be tracked and updated across the whole current range, or whether each step only ever needs to look at the two pointers' current positions.

[Move Zeroes](https://leetcode.com/problems/move-zeroes/description/) never tracks anything across a span, `fast` looks at one element, decides keep or skip, nothing about the elements already passed gets revisited or summarized. Plain two pointers, not sliding window, even though it walks through an array one element at a time. [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/) keeps a set of every character currently in the window, and shrinking the window means removing a character from that set, actively undoing part of what's tracked. [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/description/) keeps a running sum of the window, and shrinking means subtracting the departing element back out, the same undo pattern with a number instead of a set.

The question worth asking: when the left edge moves, does anything besides the pointer itself need updating. Nothing to update means [Two Pointers](../two-pointers/intro.md). Something that has to be added on growth and subtracted on shrink means sliding window.

## The boundary against hashing

Does growing the window always move the tracked value in one direction, addition only ever increasing a sum, for instance. If yes, sliding window holds. If the values can push that number either way, negative numbers in a sum being the common case, no amount of window logic fixes it, that's a sign to look at [Hashing](../hashing/intro.md) instead, specifically the Pairing bucket, prefix sums paired with a running count. The intuition chapter walks through why this breaks in more depth.

## When the statement has no window in it

Some problems ask for a maximum or minimum and never mention a subarray, a substring, or any contiguous range, and a window still solves them. Three questions find it.

What is left behind after the choice is made. If elements are taken from the two ends, or from the edges of something, the untouched part is one unbroken block, and that block may be a fixed-size window. [Maximum Points You Can Obtain from Cards](https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/description/) takes cards from both ends of a row, and the cards left in the middle are a window of size `n - k`.

Whether sorting puts the elements that matter next to each other. If elements can only move in one direction, or the goal is to make several of them equal or close, sorting may turn the group that matters into a stretch of the array. [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element/description/) raises elements by one up to a budget, and after sorting, the cheapest group to raise to any target is the stretch just below it.

Whether a shorter list holds the real structure. If the condition is about the count of one special kind of element, the positions of those elements form a list where the window is fixed and simple. [Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays/description/) needs exactly `k` odd numbers, and a window of `k` positions over the list of odd positions counts the answer.

If one of the three produces a window, the rest is the usual question, what moves `left`. If none does, that is a sign to look at another pattern instead, and a greedy choice at each step, like taking the bigger end in the cards problem, is worth checking against a small counterexample before trusting it.
