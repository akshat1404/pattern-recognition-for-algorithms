# Binary Search: Asking the Right Questions

Binary search rarely announces itself. A sorted array is the common cue, but plenty of problems that use it have no array to search, and plenty of sorted arrays do not call for it. Five questions asked of the statement find the pattern whether or not an array is in sight. The first three decide whether it applies, the fourth names which form it takes, and the fifth says when a match ends the search.

## Question 1: can I ask a yes or no question about a single candidate?

A candidate is whatever could be the answer. In a sorted array it is an index, and the question is whether the value there is at least the target. In a problem about a speed or a capacity, it is a number, and the question is whether that speed gets the job done in time. If a candidate can be tested alone, with a clear yes or no, the first requirement is met.

If the only way to judge a candidate is to look at several others at once, there is no single-candidate question to ask. [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/) is like this, since whether an index is part of the answer depends on what it pairs with, so no yes or no exists for one index alone.

## Question 2: does the answer flip only once across all the candidates?

This is the question that licenses everything else. Line the candidates up in order. The yes or no answers have to run as false for a while and then true from some point on, or the reverse, and never switch back and forth. The sort order of an array gives this for free, since "is this value at least the target" is false up to the target's position and true after it.

Nothing needs to be sorted for it to hold. In [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/description/), a speed that is too slow to finish in time stays too slow at any lower speed, and a speed that works keeps working at any higher one. No array of speeds exists, yet the answers still run false then true. If the answers could go yes, no, yes as the candidate grows, one check would say nothing about its neighbors, and the pattern does not apply.

## Question 3: does one check settle a whole side, or only the element it touched?

This separates binary search from [Two Pointers](../two-pointers/asking-the-right-questions.md), which also narrows a range over ordered data. After a check in two pointers, one position is ruled out and the other positions stay open. After a check in binary search, everything on one side of the candidate is ruled out together, because the single flip from Question 2 guarantees how the whole side would have answered.

[Search Insert Position](https://leetcode.com/problems/search-insert-position/description/) is binary search for this reason. One look at the middle value discards half the array. Two Sum II compares two live positions to a target, and each comparison only tells us to move one pointer by one step. The test to run on a problem: after the check, how many candidates are gone.

## Question 4: is the thing being searched an array, or the range of possible answers?

The pattern comes in two forms, and the wording separates them.

**An array is given.** Words like "sorted", "find the position of", "first and last occurrence", "where it would be inserted", or "rotated". The candidates are the indices. [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/description/) is the plain case. [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/description/) has a sort order that is partly broken, and it still fits, because every split has one half that is sorted and that half gives back a trustworthy check.

**The answer itself is a number in a range.** Words like "the minimum capacity such that", "the smallest speed that", "the largest minimum distance", or "the least number of days". There is no array in the statement. The candidates are all the values the answer could take, bounded by the smallest and largest it could possibly be, and the yes or no question is whether a given value is feasible. [Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/description/) and [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/description/) are this form. The part that takes thought is arguing Question 2 for them, for instance that a larger capacity can only make shipping easier.

## Question 5: is the answer a match, or the edge where the answers flip?

If the statement asks for any position holding a value, a match ends the search. Most problems ask for more. Words like "first", "last", "smallest such that", "minimum that works", or "where it would be inserted" ask for the edge where the answers change from false to true, and a match is only a clue that the edge is at that spot or past it.

On `[8, 8, 8, 8]` with target `8`, the middle index is a match and is neither the first nor the last occurrence. A match found in a problem like this is recorded, and the search keeps going toward the edge. In the answer-in-a-range form this is always the case, since the question is the smallest (or largest) candidate that passes, and every passing candidate is only a clue that a better one may lie further along.

## Putting it together

Binary search fits when a single candidate can be tested with a yes or no, the answers across all candidates flip only once, one check settles a whole side, and the candidates are either the indices of an array or the possible values of the answer. The last question only changes what happens at a match. Implementation shows the three forms that follow.
