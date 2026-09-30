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
