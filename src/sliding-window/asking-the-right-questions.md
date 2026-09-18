# Asking the Right Questions

## The boundary against two pointers

Two pointers and sliding window can walk through an array the same way, same starting point, same direction of travel. What separates them is whether anything has to be tracked and updated across the whole current range, or whether each step only ever needs to look at the two pointers' current positions.

[Move Zeroes](https://leetcode.com/problems/move-zeroes/description/) never tracks anything across a span, `fast` looks at one element, decides keep or skip, nothing about the elements already passed gets revisited or summarized. Plain two pointers, not sliding window, even though it walks through an array one element at a time. [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/) keeps a set of every character currently in the window, and shrinking the window means removing a character from that set, actively undoing part of what's tracked. [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/description/) keeps a running sum of the window, and shrinking means subtracting the departing element back out, the same undo pattern with a number instead of a set.

The question worth asking: when the left edge moves, does anything besides the pointer itself need updating. Nothing to update means [Two Pointers](../two-pointers/intro.md). Something that has to be added on growth and subtracted on shrink means sliding window.

## The boundary against hashing

Does growing the window always move the tracked value in one direction, addition only ever increasing a sum, for instance. If yes, sliding window holds. If the values can push that number either way, negative numbers in a sum being the common case, no amount of window logic fixes it, that's a sign to look at [Hashing](../hashing/intro.md) instead, specifically the Pairing bucket, prefix sums paired with a running count. The intuition chapter walks through why this breaks in more depth.
