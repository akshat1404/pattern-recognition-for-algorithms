# Binary Search: Examples

Worked problems from the questions chapter, reasoning and code together, one shape at a time.

## Classic Search

[Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/description/) gives a sorted array `nums` and a `target`, and asks for the first and last index where `target` appears, or `[-1, -1]` if it never does, in `O(log n)`. For `nums = [5, 7, 7, 8, 8, 10]` and `target = 8`, the answer is `[3, 4]`.

Reading the statement for signals, the array is sorted and the required time is `O(log n)`, which a scan cannot reach. Comparing `nums[mid]` to `target` tells us which side to discard, so the check from Question 1 comes free from the sort order. This is the classic shape. Cleary a Binary Search Problem

The brute force scans from the left for the first match and from the right for the last, `O(n)`. Sorting does something useful for the structure of the answer, though. Every copy of `target` sits in one unbroken block, so the answer is not a search for copies, it is a search for the two edges of that block.

A plain binary search returns the moment it finds a match, and here that is the wrong move. On `[8, 8, 8, 8]` with `target = 8`, the first `mid` is index `1`, a match, and it is neither edge. A match at `mid` proves only that the block touches `mid`. The left edge is at `mid` or somewhere to its left, and the right edge is at `mid` or somewhere to its right.

So a match is recorded and the search continues instead of stopping. To find the left edge, record `mid` and set `high = mid - 1`, since anything better can only sit on the left. If another copy is found there, the record moves left. If none is, the record stays where it was. The right edge is the mirror image, record `mid` and set `low = mid + 1`. Two searches, each `O(log n)`, and the answer is the pair of records.

This is the check that flips once from Question 2, with the equal case folded in. For the left edge the question at each index is whether `nums[i]` is at least `target`, false up to a point and true after it, and the left edge is the first true index, provided it holds `target`. If no index holds `target`, the record is never set and stays `-1`.

Take `nums = [5, 7, 7, 8, 8, 10]`, `target = 8`. The left edge search:

```
low  high  mid  nums[mid]  action               result
0    5     2    7          too small, low = 3   -1
3    5     4    8          match, high = 3      4
3    3     3    8          match, high = 2      3
```

`low` is now `3` and `high` is `2`, so the search stops with `result = 3`. The right edge search:

```
low  high  mid  nums[mid]  action               result
0    5     2    7          too small, low = 3   -1
3    5     4    8          match, low = 5       4
5    5     5    10         too big, high = 4    4
```

`low` is now `5` and `high` is `4`, so the search stops with `result = 4`. The answer is `[3, 4]`.

```javascript
{{#include ./examples/find-first-and-last-position.js}}
```

[Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/description/) gives an array of distinct values that was sorted ascending and then rotated at an unknown pivot, and asks for the index of `target`, or `-1`, in `O(log n)`. For `nums = [4, 5, 6, 7, 0, 1, 2]` and `target = 0`, the answer is `4`.

The `O(log n)` requirement and the near-sorted array point at binary search. The array is not sorted, though, and that removes the free check. On the example, the first `mid` is index `3`, value `7`, which is bigger than `0`. Classic search reads that as "too big, discard the right half," and the right half is where `0` is. Comparing `nums[mid]` to `target` no longer says which side holds the answer.

The brute force is a scan, `O(n)`. To do better, we need something true about every split that the broken sort order does not take away. A rotation moves a block from the front to the back, which creates exactly one drop point, one place where a large value is followed by a small one. In `[4, 5, 6, 7, 0, 1, 2]` it sits between `7` and `0`. That drop can only be in one of the two halves at `mid`, so the other half has no drop inside it and is sorted.

A sorted half is enough, because a sorted half gives back the check we lost. If the left half is sorted and `nums[low] <= target < nums[mid]`, then `target` is in the left half or nowhere, so the right half is discarded. If `target` falls outside that range, it cannot be in the sorted half at all, so the sorted half is discarded and the search moves to the other one. Every step still throws away a whole half, so the time stays `O(log n)`.

That leaves one question, which half is sorted. If `nums[low] <= nums[mid]`, the left half has no drop inside it, since its first value is not bigger than its last. Otherwise the drop is in the left half, and the right half is the sorted one. The comparison uses `<=` so that a left half holding a single element, where `low` and `mid` are the same index, counts as sorted. Distinct values matter here, since with duplicates `nums[low]`, `nums[mid]`, and `nums[high]` can all be equal and the comparison no longer says where the drop is.

Take `nums = [4, 5, 6, 7, 0, 1, 2]` and `target = 0`.

```
low  high  mid  nums[mid]  sorted half  target in it?  action
0    6     3    7          left [4..7]  no             low = 4
4    6     5    1          left [0..1]  yes            high = 4
4    4     4    0          match, return 4
```

At the first step the left half `[4, 5, 6, 7]` is sorted, and `0` is not between `4` and `7`, so `0` can only be in the right half. At the second step `[0, 1]` is sorted and `0` is in its range, so the right side is discarded.

The right half being the sorted one needs its own trace. Take `nums = [6, 7, 0, 1, 2, 4, 5]` and `target = 5`.

```
low  high  mid  nums[mid]  sorted half   target in it?  action
0    6     3    1          right [1..5]  yes            low = 4
4    6     5    4          left [2..4]   no             low = 6
6    6     6    5          match, return 6
```

At the first step `nums[low] = 6` is bigger than `nums[mid] = 1`, so the drop is in the left half and the right half `[1, 2, 4, 5]` is sorted. `5` is within `1` to `5`, so the left half is discarded.

```javascript
{{#include ./examples/search-in-rotated-sorted-array.js}}
```

[Single Element in a Sorted Array](https://leetcode.com/problems/single-element-in-a-sorted-array/description/) gives a sorted array where every value appears exactly twice except one, which appears once, and asks for that value in `O(log n)` time and `O(1)` space. For `nums = [1, 1, 2, 3, 3, 4, 4, 8, 8]`, the answer is `2`.

**Asks for.** The value that appears once, in `O(log n)`.

**Offers.** A sorted array, so equal values sit next to each other in pairs.

The `O(log n)` requirement points at binary search, but there is no target. Comparing `nums[mid]` with anything outside the array says nothing, so the yes or no question has to come from somewhere else. Writing out the indices shows where.

```
index  0  1  2  3  4  5  6  7  8
value  1  1  2  3  3  4  4  8  8
```

Before the `2`, the pair `(1, 1)` starts on index `0`, an even index. After the `2`, the pairs start on `3`, `5`, and `7`, all odd. The single element takes up one position, and that shifts every pair after it by one. So the structure of the indices changes at exactly one place, the single element.

The same fact reads more simply as a count. Take `mid`'s pair and count the elements to its left. If the single element is not among them, they are all complete pairs, and the count is even. If it is among them, the count is odd. So an even count sends the search right and an odd count sends it left. Across the array the answers to "is the count even" run yes, yes, and then no from the single element onward, flipping once.

At each `mid` there are three cases. If `nums[mid]` equals the element before it, the pair is `(mid - 1, mid)`, and `mid - 1` elements sit to its left. If it equals the element after it, the pair is `(mid, mid + 1)`, and `mid` elements sit to its left. If it equals neither, `nums[mid]` is the single element, and the search returns it.

```
low  high  mid  nums[mid]  pair    left count  action
0    8     4    3          (3, 4)  3, odd      high = 3
0    3     1    1          (0, 1)  0, even     low = 2
2    3     2    2          none                return 2
```

This is a third source of the one-flip property. Sorted values give it in the classic search, a feasibility test gives it when searching on the answer, and here it comes from counting the elements left of a pair.

```javascript
{{#include ./examples/single-element-in-a-sorted-array.js}}
```

## Search on Answer

### The split shape

Several problems in this section share one shape. There is an array `arr` and a number `x`, and the array has to be broken into `x` contiguous subarrays, in order. There are many ways to do it. On `arr = [1, 2, 3]` with `x = 2`, one way is `[1, 2]` and `[3]`, another is `[1]` and `[2, 3]`.

Each way gives a list of subarray sums, and each list has a largest value. Call these `max1`, `max2`, and so on, one per way. The answer is the smallest of them, the minimum of the maximums.

```
way 1: [1, 2] [3]   sums 3, 3   max 3
way 2: [1] [2, 3]   sums 1, 5   max 5
answer: min(3, 5) = 3
```

Trying every way does not scale, since the number of ways grows very fast with the size of the array. The move that makes this solvable is to stop searching through the ways and guess the answer instead. Pick a value `C` and ask a yes or no question, is there a way to split the array so that every subarray sum is at most `C`.

That question has an easy answer. Fill each subarray as full as possible without going over `C`, and start a new one only when the next element would push it over. Filling each subarray as full as it can go always leaves the fewest elements for the rest, so if this uses at most `x` subarrays, `C` works, and if it uses more, no way works.

The guesses flip once. If every subarray fits under `C`, the same split fits under `C + 1`, so once a guess works, every bigger guess works too. That makes it a search on the answer, for the smallest `C` that works.

The range comes from the array. Some subarray has to hold the largest element, so the answer is at least `max(arr)`, which becomes `low`. A single subarray holding everything has sum `sum(arr)`, which becomes `high`. So for any problem with this shape, the range is `[max(arr), sum(arr)]`. Other answer-range problems build their range differently, as Koko and Magnetic Force do on the questions page. A middle value that works is recorded, and the search goes left for something smaller. A middle value that fails sends the search right.

Splitting into "at most `x`" pieces and "exactly `x`" pieces give the same answer. A piece with two or more elements can always be split in two without raising the largest sum, so a split with fewer pieces can be turned into one with exactly `x`.

### Capacity To Ship Packages Within D Days

[Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/description/) gives an array `weights`, where `weights[i]` is the weight of the `i`th package, and a number of days `days`. Each day, a ship loads packages in the given order, never skipping one, until the next package would push the load over the ship's capacity. It asks for the smallest capacity that ships every package within `days` days. For `weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]` and `days = 5`, the answer is `15`.

**Asks for.** The smallest capacity that works.

**Offers.** A yes or no test for any guessed capacity, load the packages day by day and count the days.

This is the split shape with different names. The packages are `arr`, the days are `x`, and each day's load is one subarray. The capacity a split needs is its heaviest day, so the answer is the split whose heaviest day is the lightest.

At capacity `15`, the days fill like this.

```
day 1: 1 2 3 4 5   = 15
day 2: 6 7         = 13
day 3: 8           = 8
day 4: 9           = 9
day 5: 10          = 10
```

The range is `low = 10`, the heaviest package, and `high = 55`, the total.

```
low  high  mid  days needed  works?  action
10   55    32   2            yes     record 32, search left
10   31    20   4            yes     record 20, search left
10   19    14   6            no      search right
15   19    17   4            yes     record 17, search left
15   16    15   5            yes     record 15, search left
15   14    stop, the answer is 15
```

At `14`, the packages need six days, one too many, and at `15` they fit in five, so `15` is the smallest capacity that works.

```javascript
{{#include ./examples/capacity-to-ship-packages.js}}
```

### Minimum Number of Days to Make m Bouquets

[Minimum Number of Days to Make m Bouquets](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/description/) gives an array `bloomDay`, where `bloomDay[i]` is the day flower `i` blooms, and two numbers `m` and `k`. A bouquet needs `k` adjacent flowers that have all bloomed, and each flower can go in at most one bouquet. It asks for the smallest number of days to wait before `m` bouquets can be made, or `-1` if that is impossible. For `bloomDay = [7, 7, 7, 7, 12, 7, 7]`, `m = 2`, and `k = 3`, the answer is `12`.

**Asks for.** The smallest day that works.

**Offers.** A yes or no test for any guessed day, count the runs of bloomed flowers and the bouquets each run gives.

The answer is a day, a number, not a stretch of flowers, which points at binary search on the answer even though the statement talks about adjacent flowers. The adjacent flowers belong to the check. The maximum is hidden too. Waiting for a bouquet means waiting for its last flower to bloom, so the wait for a set of bouquets is the largest bloom day among their flowers, and the answer is the choice whose largest is smallest.

This is not the split shape, so the range is not `[max(arr), sum(arr)]`. It comes from the bloom days. Before the earliest bloom day nothing has bloomed, so `low` is `min(bloomDay)`. By the latest bloom day every flower has bloomed, so `high` is `max(bloomDay)`, and if `m` bouquets cannot be made by then, they never can.

The answers flip once because flowers never un-bloom. A flower open on day `d` is still open on day `d + 1`, so every bouquet possible on day `d` is still possible later. Once a day works, every later day works.

Whether the answer is `-1` is known before searching. `m` bouquets of `k` flowers need `m * k` flowers, and if the array has fewer than that, no day works. If it has enough, the latest bloom day always works, so the search always finds an answer.

The check walks the flowers once. A bloomed flower adds to the current run, and when the run reaches `k`, that is one bouquet and the run starts over. A flower not yet bloomed breaks the run.

```
low  high  mid  bloomed by mid      runs   bouquets  works?  action
7    12    9    all except the 12   4, 2   1         no      search right
10   12    11   all except the 12   4, 2   1         no      search right
12   12    12   all                 7      2         yes     record 12, search left
12   11    stop, the answer is 12
```

On days `9` and `11` the `12` splits the flowers into a run of four and a run of two, which gives one bouquet, since the run of four only holds one group of three. On day `12` the run is all seven flowers, which holds two groups of three.

```javascript
{{#include ./examples/minimum-days-to-make-bouquets.js}}
```

### Kth Smallest Element in a Sorted Matrix

[Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/description/) gives an `n × n` matrix where every row and every column is sorted ascending, and a number `k`. It asks for the `k`th smallest element in sorted order, counting duplicates. For the matrix below and `k = 8`, the answer is `13`, since all the values sorted are `1, 5, 9, 10, 11, 12, 13, 13, 15`.

```
[[ 1,  5,  9],
 [10, 11, 13],
 [12, 13, 15]]
```

**Asks for.** A value, the `k`th smallest.

**Offers.** Sorted rows and sorted columns, and a count of the elements at or below any guessed value that is easy to work out.

The matrix is not one sorted list, which rules out searching by position. In reading order it is `1, 5, 9, 10, 11, 13, 12, 13, 15`, and `13` comes before `12`. With `k = 6`, the 6th smallest is `12`, but the 6th position in reading order holds `13`. Search a 2D Matrix could search positions only because each row starts after the previous row ends, and this matrix makes no such promise.

So the search runs over values instead. The smallest value is the top-left corner and the largest is the bottom-right corner, which gives `low = matrix[0][0]` and `high = matrix[n - 1][n - 1]`. `mid` is a value, often one that does not appear in the matrix at all, never a position.

The check asks how many elements are at or below `mid`. If the count is at least `k`, `mid` is big enough, so it is recorded and the search goes left for something smaller. If the count is less than `k`, the search goes right. The answers flip once, since raising `mid` can only raise the count.

The answer always ends up being an element of the matrix, even though most guesses are not. The search finds the smallest value whose count reaches `k`. If that value were not in the matrix, the value just below it would have exactly the same count, so it would pass too, and the first value would not be the smallest after all.

The first way to count is row by row, starting at `[0, 0]`. Each row is sorted, so two shortcuts apply. If a row's last element is at or below `mid`, the whole row counts, all `n` of it, without looking at the rest. If a row's first element is already above `mid`, nothing in it counts, and since the columns are sorted too, every row below starts even bigger, so the count is finished. Only the rows that `mid` cuts through the middle need walking, from the left until the first value above `mid`.

That is correct, but when `mid` cuts through every row, it still walks close to every cell, about `n²` steps per check. The walking can be shared between rows. Where a row stops counting can only move left as we go down, because each row is bigger than the one above it, column by column. So there is no need to restart each row from the left.

Start at the bottom-left corner instead. If the cell is at or below `mid`, every cell above it in that column is smaller still, so the whole column up to there counts, and the walk steps right. If the cell is above `mid`, the walk steps up. From this corner, right always means bigger and up always means smaller, so every cell gives a clear direction, which the top-left corner does not, since both right and down mean bigger. Each step leaves a row or a column behind, so a count takes at most `2n` steps.

```
low  high  mid  count at or below mid  action
1    15    8    2                      too few, search right
9    15    12   6                      too few, search right
13   15    14   8                      enough, record 14, search left
13   13    13   8                      enough, record 13, search left
13   12    stop, the answer is 13
```

`8` and `14` were both guessed and neither is in the matrix. `14` passed, but `13` passed with the same count, so the search kept going left until it landed on `13`, which is.

```javascript
{{#include ./examples/kth-smallest-in-sorted-matrix.js}}
```
