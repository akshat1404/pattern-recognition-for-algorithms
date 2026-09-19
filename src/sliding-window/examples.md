# Intuition in Action

Worked problems from the intuition chapter, reasoning and code together, one shape at a time.

## Fixed Size

[Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/description/) gives an array and an integer `k`, and asks for the contiguous subarray of length `k` with the highest average, returning that average. The size is handed over directly, which makes this the cleanest place to see the mechanics with nothing else in the way.

Brute force computes the sum of every window of size `k` from scratch, adding up `k` elements each time, `O(n * k)` overall. But two neighboring windows share `k - 1` elements, sliding forward by one only changes two of them, one leaves from the left, one enters from the right. The sum doesn't need rebuilding, only adjusting by the difference between those two.

The one question this whole pattern comes down to, what moves `left` forward, has the simplest possible answer here. Nothing about the window's contents matters, only its length, once the window would grow past `k`, the oldest element has to leave. The code never even tracks `left` explicitly, `right - k` is always the element about to leave.

Take `nums = [1, 12, -5, -6, 50, 3]`, `k = 4`. The first window, `[1, 12, -5, -6]`, sums to `2`.

```
right  enters  leaves  windowSum  bestSum
4      50      1       51         51
5      3       12      42         51
```

`bestSum` ends at `51`, from the window `[12, -5, -6, 50]`, and `51 / 4 = 12.75`, the answer.

This array has negative numbers, and nothing breaks. The direction check from the intuition chapter, whether growing the window always moves the tracked value the same way, only matters when the shrinking condition is derived from the window's contents. Here the condition is just size, so it never comes up.

```javascript
{{#include ./examples/maximum-average-subarray-i.js}}
```
