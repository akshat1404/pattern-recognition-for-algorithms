# Intuition in Action

Worked problems from the intuition chapter, reasoning and code together, one shape at a time.

## Classic Search

[Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/description/) gives a sorted array `nums` and a `target`, and asks for the first and last index where `target` appears, or `[-1, -1]` if it never does, in `O(log n)`. For `nums = [5, 7, 7, 8, 8, 10]` and `target = 8`, the answer is `[3, 4]`.

Reading the statement for signals, the array is sorted and the required time is `O(log n)`, which a scan cannot reach. Comparing `nums[mid]` to `target` tells us which side to discard, so the check from the intuition chapter comes free from the sort order. This is the classic shape. Cleary a Binary Search Problem

The brute force scans from the left for the first match and from the right for the last, `O(n)`. Sorting does something useful for the structure of the answer, though. Every copy of `target` sits in one unbroken block, so the answer is not a search for copies, it is a search for the two edges of that block.

A plain binary search returns the moment it finds a match, and here that is the wrong move. On `[8, 8, 8, 8]` with `target = 8`, the first `mid` is index `1`, a match, and it is neither edge. A match at `mid` proves only that the block touches `mid`. The left edge is at `mid` or somewhere to its left, and the right edge is at `mid` or somewhere to its right.

So a match is recorded and the search continues instead of stopping. To find the left edge, record `mid` and set `high = mid - 1`, since anything better can only sit on the left. If another copy is found there, the record moves left. If none is, the record stays where it was. The right edge is the mirror image, record `mid` and set `low = mid + 1`. Two searches, each `O(log n)`, and the answer is the pair of records.

This is the monotonic check from the intuition chapter, with the equal case folded in. For the left edge the question at each index is whether `nums[i]` is at least `target`, false up to a point and true after it, and the left edge is the first true index, provided it holds `target`. If no index holds `target`, the record is never set and stays `-1`.

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
