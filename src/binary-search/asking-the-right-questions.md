# Binary Search: Asking the Right Questions

## Seeing it in a statement

Every problem statement has two parts. What it asks for, the shape of the answer. What it offers, the structure in the input we can lean on. The pattern is where the two meet.

| Asks for | Offers | Use |
|---|---|---|
| A position, first or last occurrence, insertion point | Sorted array | Binary search on indices |
| A position or the minimum | Sorted array, rotated | Binary search on the half that is still sorted |
| The smallest or largest value that works | A check that only gets easier as the guess grows | Binary search on the answer |
| The largest minimum or smallest maximum | A check on a guessed value | Binary search on the answer |

If one check only rules out the element it touched and not a whole side, it is not binary search. Check Two Pointers.

Five problems follow, each read from its statement to the pattern. No code here, the code lives in Implementation and Examples.

## 1. Search a 2D Matrix

**The statement.** [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/description/) gives a grid where each row is sorted and the first value of each row is bigger than the last value of the row above, and asks whether a target is in the grid.

**Asks for.** Whether a target is in the grid.

**Offers.** Sorted rows, each starting above where the last ended. Together they make one sorted list cut into rows.

**Why it fits.** Read the grid row by row, and the values never decrease from the first cell to the last. Number the cells in that order, and every number maps to a row and a column, the row from how many full rows come before it and the column from what is left over. So the candidates are those numbers, the question at each one is whether its value is at least the target, and the answers flip once, exactly as in a sorted array. The grid shape is only a way of storing the list.

## 2. Find Minimum in Rotated Sorted Array

**The statement.** [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/description/) gives an array of distinct values that was sorted and then rotated, so `[0, 1, 2, 4, 5, 6, 7]` might become `[4, 5, 6, 7, 0, 1, 2]`, and asks for the smallest value.

**Asks for.** The minimum value.

**Offers.** A sorted array, rotated, so order is broken in exactly one place, and the minimum sits right after that break.

**Why it fits.** The array is two sorted blocks, every value in the first block is bigger than every value in the second, and the minimum is where the second block starts. Ask of each index whether its value is at most the last value of the array. Every index in the first block says no, every index in the second says yes, so the answers flip once and the minimum is the first yes. Checking the middle against the last value tells us which block the middle is in, and that settles a whole side.

## 3. Find Peak Element

**The statement.** [Find Peak Element](https://leetcode.com/problems/find-peak-element/description/) gives an array with no two equal neighbors and asks for the index of any peak, a value bigger than both its neighbors, with the space beyond each end counted as lower than everything.

**Asks for.** Any one peak.

**Offers.** Neighbors that are never equal, and edges that count as lower than everything. Nothing is sorted, but "any peak" means a side only has to be guaranteed to hold one peak.

**Why it fits.** Compare the middle with its right neighbor. If the neighbor is bigger, walk right from it, and the values either keep rising to the end of the array, where the last value is a peak because the space beyond it counts as lower, or they drop at some point, and the value just before the drop is a peak. Either way, the right side holds a peak, and the left side can be discarded. If the neighbor is smaller, the same argument runs leftward from the middle. The lesson is that binary search needs a guarantee about one side, and sorted order is only one way to get it.

## 4. Koko Eating Bananas

**The statement.** [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/description/) gives piles of bananas and a number of hours. Each hour, Koko picks one pile and eats up to some fixed number of bananas from it. It asks for the smallest eating speed that finishes every pile in time.

**Asks for.** The smallest speed that finishes in time.

**Offers.** A yes or no test for any guessed speed, and a speed that works keeps working when faster. No array, the answer is a number in a range.

**Why it fits.** The candidates are every speed from `1` up to the size of the largest pile, since eating faster than the largest pile gains nothing. If a speed is too slow, every lower speed is too slow as well, and if a speed works, every higher one works too. So the answers run no, then yes, flipping once, and the answer is the first yes. Each guess is tested by working out the hours it would take, and every test settles half of the remaining speeds.

## 5. Magnetic Force Between Two Balls

**The statement.** [Magnetic Force Between Two Balls](https://leetcode.com/problems/magnetic-force-between-two-balls/description/) gives positions of baskets along a line and a number of balls, and asks for the largest possible value of the smallest gap between any two balls once they are all placed in baskets.

**Asks for.** The largest possible minimum gap between balls.

**Offers.** A yes or no test for any guessed gap. Maximizing a minimum directly is hard, but checking whether a gap is achievable is easy.

**Why it fits.** Guess a gap and ask whether all the balls fit with at least that much space between each pair. To test it, sort the positions, place a ball in the first basket, and keep placing each next ball in the first basket at least that gap away. Placing each ball as early as possible always leaves the most room for the rest. If a gap is achievable, every smaller gap is too, and if it is not, no larger gap is. The answers run yes, then no, flipping once, and the answer is the last yes. Sorting here is part of the test, not the thing being searched.

## What the five share

In every one, a single candidate can be tested with a yes or no, an index, a speed, a gap. The answers across all the candidates flip only once, or at least one side is guaranteed to hold an answer, so one check discards a whole side. The candidates are either positions in an array, sorted outright, sorted in pieces, or not sorted at all, or the possible values of the answer itself. When a check can only rule out the one element it touched, the problem is closer to [Two Pointers](../two-pointers/asking-the-right-questions.md).
