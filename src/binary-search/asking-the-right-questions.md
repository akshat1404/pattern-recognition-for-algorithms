# Asking the Right Questions

## The boundary against two pointers

Both patterns work over ordered data and narrow a range as they go. The difference is how much gets thrown away per check. Two pointers moves one pointer by one position at a time, based on comparing the values currently under both pointers against each other. Binary search throws away roughly half of everything still in play, based on one check at the middle, without ever comparing two live positions to each other.

[Two Sum II (Input Array Is Sorted)](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/) compares the sum of two positions against a target, and that comparison only tells us to move one pointer one step, `left` up or `right` down. Nothing gets discarded beyond the single position that moved. [Search Insert Position](https://leetcode.com/problems/search-insert-position/description/) checks one middle value against a target, and that single check discards everything on one side, half the array gone from one comparison. The question worth asking: does the last check rule out only the one element it touched, or does it rule out an entire side at once. One element at a time is two pointers. A whole side at once is binary search.

## When there's no array to search

Some problems never hand over a sorted array at all. What's being searched is the space of possible answers, a capacity, a speed, a count of days, and those values were never built into a list to index into.

[Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/description/) never sorts anything. It guesses an eating speed and checks whether that speed finishes all the bananas within the hour limit. A slower speed that already fails will keep failing, and a faster speed that already works will keep working, so the guesses behave exactly like a sorted array would, false up to a point and true after it, even though no array of speeds was ever built. The cue: a minimum or maximum being asked for a quantity that was never given as an array, paired with a yes or no check on any single guess that only gets easier or only gets harder as the guess grows.
