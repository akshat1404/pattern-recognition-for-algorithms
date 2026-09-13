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
