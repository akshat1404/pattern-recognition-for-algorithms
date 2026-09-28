# Intuition

## When to reach for it

Two questions, in order. First, can a yes or no check be defined on any single candidate, a value, an index, a guess. Second, is that check's answer monotonic across the full range of candidates, false then true, or true then false, never flipping more than once. If both hold, binary search applies, whether or not the thing being searched is literally a sorted array.

## The trade

A brute force check tests every candidate one at a time, whether that's every index in an array or every possible value in a range, O(n) over an array or O(range) over a space of possible answers. Binary search replaces that scan with a single halving step, but only when checking the middle also tells us something true about everything on one side of it, without needing to check those elements one by one.

## The one property that has to hold

The real requirement isn't that the array is sorted. Sorted is one way to get there, but what actually licenses discarding a whole half is a monotonic condition, some yes or no check on a single candidate that comes out false up to a point and true from there on, or the reverse, with no flipping back and forth across the range.

In a sorted array searching for a target, the check "is this value at least the target" is false, then true, exactly once, moving from left to right, because the array is sorted. That single flip is what makes the middle's answer tell us the answer for an entire side without looking at it.

## The shapes

1. Classic search: find a target's position in a sorted array, or the position it would sit at, a first or last occurrence, an insertion point. The monotonic check comes straight from the sort order.

2. Search on answer: the thing being searched isn't given as an array at all, it's the range of possible answers, a capacity, a speed, a number of days, a distance. The check becomes "is this guess feasible," and feasibility has to be monotonic in the guess, a higher guess only ever helps or only ever hurts, never both, for the halving to be safe.

The next chapter, Asking the Right Questions, covers how to tell binary search apart from a neighboring pattern when a problem could plausibly go either way.
