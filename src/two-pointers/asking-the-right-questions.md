# Two Pointers: Asking the Right Questions

Two pointers rarely shows up by name in a statement. What shows up is data in a particular order and a question that could be answered by comparing positions. Five questions asked of the statement find it. The first three decide whether it fits, the fourth names which of the three shapes it is, and the fifth separates it from sliding window.

## Question 1: does position tell us something true about a value?

In ordered data, where a value sits says something about it without a lookup. Take the sorted array `[2, 7, 11, 15]` with target `9`. The pointer at the far right holds `15`, the largest value still in range. Paired with `2`, the smallest value in range, it is already too big, so paired with anything else in range it is too big too. `15` can be discarded without checking a single other pair, purely because of where it sits.

The same array unsorted tells us nothing from position. Index `3` could hold anything, and the only way to learn what completes a value is to remember what has been seen, which is [Hashing](../hashing/asking-the-right-questions.md). Order does not have to mean sorted by value, either. [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/description/) has a fixed first and last character with no numeric order at all, and [Move Zeroes](https://leetcode.com/problems/move-zeroes/description/) only needs the original relative order kept.

## Question 2: would the obvious approach pair up every position, or build a structure to remember something?

Write the plain first solution. For two pointers it takes one of two forms. One compares every position against every other position, as in [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/), where every pair is a candidate. The other builds an extra array or map to hold what the walk has passed, as in compacting an array into a second array, or keeping arrays of the tallest wall to the left and to the right of every position in [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/description/).

Two pointers fits when the order makes that structure unnecessary. The pointers' own positions carry the information the pairs or the extra array would have held. If the plain solution needs neither, for example it inspects each element once and moves on, the question is simpler than this pattern.

## Question 3: can I argue that moving one pointer never loses a better answer?

This is the test that decides it. At each step one pointer has to move, and the move is only safe if we can prove nothing better sits behind it. In [Container With Most Water](https://leetcode.com/problems/container-with-most-water/description/), the area is capped by the shorter of two walls. Moving the taller wall inward can only shrink the width and cannot raise the cap, so the shorter wall is the one that must move, and the proof is one sentence.

When no such argument exists, the pattern does not apply, even if the problem looks like it should. [Maximum Points You Can Obtain from Cards](https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/description/) takes cards from the two ends, which suggests a pointer at each end taking the bigger card. A small card at an edge can sit right in front of a huge one. On `[1, 2, 100000, 3, 4, 5]` with `k = 3`, taking the bigger end each time gives `12` when the best is `100003`. The safety argument fails, so the pointers are the wrong tool, and the chapter on [Sliding Window](../sliding-window/asking-the-right-questions.md) covers what fits.

## Question 4: which shape is it?

Three shapes cover the pattern, and each has its own cues.

**Two ends moving inward.** A sorted array and a target condition over a pair or a triplet. Words like "pair that sums to", "three numbers that", "the most water between two lines", or "is it a palindrome". [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/), [3Sum](https://leetcode.com/problems/3sum/description/), [Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/description/), and [Boats to Save People](https://leetcode.com/problems/boats-to-save-people/description/) all sit here. The decision at each step is a comparison of the two pointers' values against a target.

**Both pointers from the same end.** A statement that asks to change an array in place, with no extra space, in one pass. Words like "remove", "move to the end", "keep only", or "in place". One pointer reads every element and the other marks where the next kept element goes. [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/description/), [Move Zeroes](https://leetcode.com/problems/move-zeroes/description/), and [Sort Colors](https://leetcode.com/problems/sort-colors/description/) are this shape.

**Two pointers at different speeds.** Anything with only a "next" step and no way to jump to an index, such as a linked list, or a process that can loop. Words like "cycle", "middle", "the `n`th node from the end", or "where two lists meet". [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/description/), [Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/description/), and [Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/description/) are the list forms. [Happy Number](https://leetcode.com/problems/happy-number/description/) is the same idea on a sequence of numbers that may loop.

## Question 5: does anything have to be undone when a pointer moves?

This separates two pointers from sliding window, which walks through an array the same way. In two pointers, a step only needs the values or positions the pointers currently sit on, and moving a pointer leaves nothing behind to correct. Move Zeroes looks at one element at a time and decides keep or skip, with nothing about the elements already passed revisited.

In sliding window, the range between the pointers is tracked as a whole, and shrinking it means undoing part of what was tracked. [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/) keeps a set of the characters in the range, and moving the left pointer removes one from it. [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/description/) keeps a running sum and subtracts the departing element. Anything to undo on a move means [Sliding Window](../sliding-window/asking-the-right-questions.md).

A small running value that only grows and never needs correcting is allowed. Trapping Rain Water carries the tallest wall seen from each side, and neither number is ever revised downward, so it stays two pointers.

## Putting it together

Two pointers fits when position carries information, the plain solution would pair positions or build a structure the order makes unnecessary, a safety argument for each move can be stated, one of the three shapes matches the wording, and nothing has to be undone when a pointer moves. The answer itself is not always the two pointers' final values. 3Sum keeps a third value fixed outside the moving pair, and in-place compaction produces its answer from the whole pass, not from one comparison.
