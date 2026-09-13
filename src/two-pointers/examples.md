# Intuition in Action

Worked problems from the intuition chapter, reasoning and code together, one shape at a time.

## Converging

[Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/) gives a 1-indexed array, already sorted, and a target, and asks for the 1-indexed positions of the two numbers that add up to it. Exactly one solution exists.

This is the exact reasoning from the intuition chapter, worked through to completion. Take `numbers = [2, 7, 11, 15]`, `target = 9`. `left` starts at index `0` (`2`), `right` starts at index `3` (`15`).

Step one: `2 + 15 = 17`, too big. Position already told us `15` is the largest value left in range, so pairing it with anything else in range can only be too big as well, `right` is the only side that could possibly fix this, move it back. `right` becomes index `2` (`11`).

Step two: `2 + 11 = 13`, still too big, same reasoning, move `right` again. `right` becomes index `1` (`7`).

Step three: `2 + 7 = 9`, matches the target exactly. `left` is at index `0`, `right` is at index `1`, and since the problem wants 1-indexed positions, the answer is `[1, 2]`.

Notice what never happened, at no point did the algorithm check `2` against `11` and `2` against `7` separately as unrelated attempts. Each move eliminated an entire side, once `15` was ruled out, everything paired with `15` was ruled out with it, without checking any of those pairs directly.

```javascript
{{#include ./examples/two-sum-ii.js}}
```

[3Sum](https://leetcode.com/problems/3sum/description/) gives an array and asks for every unique triplet that sums to `0`, no duplicate triplets in the result. This is the case from the intuition chapter where the answer needs a third value outside the two moving pointers.

The array isn't sorted to begin with, so sort it first, that's what makes converging possible at all. Once sorted, fix one value as an anchor, `sorted[i]`, and the rest of the problem becomes finding two numbers that sum to `-sorted[i]`, which is exactly Two Sum II's shape, just with a target computed from the anchor instead of given directly.

Take `nums = [-1, 0, 1, 2, -1, -4]`, sorted to `[-4, -1, -1, 0, 1, 2]`. Anchor `i = 1`, value `-1`, target `1`. `left = 2` (`-1`), `right = 5` (`2`), sum `1`, a match, `[-1, -1, 2]`. Move both pointers, `left = 3` (`0`), `right = 4` (`1`), sum `1`, another match, `[-1, 0, 1]`. Move again, `left` and `right` meet, this anchor is done.

Two duplicate-avoidance checks show up that Two Sum II never needed, since Two Sum II only ever wants one answer, not every unique one. First, skip an anchor equal to the previous anchor, `sorted[2] = -1` is the same as `sorted[1]`, using it again would just rediscover triplets already found with the first `-1`. Second, after a match, skip past any repeats of the values that just matched before continuing to converge, otherwise the same triplet gets recorded more than once from adjacent equal values.

```javascript
{{#include ./examples/three-sum.js}}
```
