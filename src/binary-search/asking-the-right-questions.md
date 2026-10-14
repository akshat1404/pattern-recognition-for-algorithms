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

**Asks for.** Any one peak, in `O(log n)`.

**Offers.** Edges that count as `-INF`, so walking uphill always ends on a peak, and permission to return any peak, so a side only has to be guaranteed to hold one.

**Why it fits.** The first instinct is a single pass, walk left to right and return the first element bigger than the one after it. That is correct, and without the `O(log n)` requirement it would be the answer. The requirement is what pushes us to look for a way to discard half the array at once.

Picture the array padded as `[-INF, ...array..., -INF]`. Two extreme cases show what the padding does. In `[-INF, 1, 2, 3, 4, 5, -INF]` the values only rise, and the peak is the `5` at the right end, since it is bigger than the `-INF` after it. In `[-INF, 5, 4, 3, 2, 1, -INF]` the values only fall, and the peak is the `5` at the left end, since it is bigger than the `-INF` before it. Whichever way the values run, the climb ends on a peak at the side it rises toward. Now compare the middle with its right neighbor. If the neighbor is bigger, walk right from it. Each next value is either smaller, and the current one is a peak, or bigger, and the walk climbs on. The climb cannot go past the `-INF` at the end, so it always stops on a peak. The right side is guaranteed to hold one, and the left side is discarded. If the neighbor is smaller, the same walk runs leftward from the middle.

The discarded side may hold a peak too. On `[1, 2, 1, 2, 3, 4, 5]` the search goes right and returns the `5`, never visiting the peak at index `1`. That is allowed because the problem accepts any peak.

Peaks being scattered is not what makes this work. Scattered answers on their own force a full scan. Asked for the global maximum of the same array, binary search fails, since the uphill side might hold a small peak while the maximum sits on the other side. What makes it work is "any peak" together with the `-INF` edges, which turn one comparison into a guarantee about one side. Sorted order is one way to get that guarantee, and this is another.

## 4. Koko Eating Bananas

**The statement.** [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/description/) gives an array `piles` of `n` piles, where `piles[i]` is the number of bananas in the `i`th pile, and a number of hours `h`. Koko picks an eating speed `k`, bananas per hour. Each hour she chooses one pile and eats `k` bananas from it. If the pile has fewer than `k` left, she finishes it and waits out the rest of that hour. It asks for the smallest `k` that lets her finish every pile within `h` hours. For `piles = [3, 6, 7, 11]` and `h = 8`, the answer is `4`. At speed `4` the piles take `1`, `2`, `2`, and `3` hours, `8` in total. At speed `3` they take `1`, `2`, `3`, and `4`, which is `10`, too many.

**Asks for.** The smallest speed that finishes in time.

**Offers.** A yes or no test for any guessed speed, and a speed that works keeps working when faster. No array, the answer is a number in a range.

**Why it fits.** The candidates are every speed from `1` up to the size of the largest pile. Koko eats from only one pile per hour, so every pile costs at least one hour. At a speed equal to the largest pile, every pile takes exactly one hour, and no faster speed can bring a pile below that. If a speed is too slow, every lower speed is too slow as well, and if a speed works, every higher one works too. So the answers run no, then yes, flipping once, and the answer is the first yes. Each guess is tested by working out the hours it would take, and every test settles half of the remaining speeds.

## 5. Magnetic Force Between Two Balls

**The statement.** [Magnetic Force Between Two Balls](https://leetcode.com/problems/magnetic-force-between-two-balls/description/) gives an array `position` of `n` baskets, where `position[i]` is where the `i`th basket sits on a line, and a number of balls `m`. Each basket holds at most one ball. The force between two balls is the distance between their baskets. All `m` balls have to be placed, and among all pairs of balls, the smallest distance is what counts. It asks for the largest that smallest distance can be. For `position = [1, 2, 3, 4, 7]` and `m = 3`, the answer is `3`. Balls at `1`, `4`, and `7` are `3` apart each. A gap of `4` does not work, since after `1` the next basket at least `4` away is `7`, and there is no room for a third ball.

**Asks for.** The largest possible minimum gap between balls.

**Offers.** A yes or no test for any guessed gap. Maximizing a minimum directly is hard, but checking whether a gap is achievable is easy.

**Why it fits.** Guess a gap and ask whether all the balls fit with at least that much space between each pair. To test it, sort the positions, place a ball in the first basket, and keep placing each next ball in the first basket at least that gap away. Placing each ball as early as possible always leaves the most room for the rest. If a gap is achievable, every smaller gap is too, and if it is not, no larger gap is. The answers run yes, then no, flipping once, and the answer is the last yes. Sorting here is part of the test, not the thing being searched.

## What the five share

In every one, a single candidate can be tested with a yes or no, an index, a speed, a gap. The answers across all the candidates flip only once, or at least one side is guaranteed to hold an answer, so one check discards a whole side. The candidates are either positions in an array, sorted outright, sorted in pieces, or not sorted at all, or the possible values of the answer itself. When a check can only rule out the one element it touched, the problem is closer to [Two Pointers](../two-pointers/asking-the-right-questions.md).
