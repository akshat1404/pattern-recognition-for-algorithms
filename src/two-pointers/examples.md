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

[Container With Most Water](https://leetcode.com/problems/container-with-most-water/description/) gives an array of heights, and any two indices form a container, holding water up to the shorter of the two heights, over a width equal to the distance between them. Return the largest amount of water any pair can hold. This is the case from the intuition chapter where the array isn't sorted at all, order shows up purely in position, not value.

Every pair of indices forms a rectangle, and finding the one with the largest area is exactly what the problem is asking, checking all of them directly is the brute force, O(n^2).

Start at `left = 0`, `right = n - 1`, the widest rectangle possible, the maximum width available anywhere in the array. Every other pair has less width than this one, so the search begins at the one place width is already at its ceiling. From here, width can only go down, so the only lever left worth pulling is height.

Area is width times height, and the two pointers each contribute one of those. Width comes from position, `right - left`, known for free with no lookup. Height comes from the values, `min(heights[left], heights[right])`, the shorter of the two walls, since water can never sit higher than the shorter side without spilling over it.

Once height has that formula, the only question left is which direction to shrink the width from, `left++` or `right--`. The side holding the smaller height moves. `min(heights[left], heights[right])` only ever depends on whichever wall is shorter, the taller wall isn't the bottleneck at all, it could be far taller and the height would still be capped by the shorter one. So keeping the shorter wall in place and giving up width by moving the taller one buys nothing, the cap stays exactly where it was, while width, the one thing guaranteed to only shrink, has already gotten worse. Moving the shorter wall is the only move with any chance of raising the cap for the next rectangle, which is the entire safety argument this pattern needs.

Take `heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]`.

```
left  right  heights[left]  heights[right]  width  area  move
0     8      1              7               8      8     left (shorter)
1     8      8              7               7      49    right (shorter)
1     7      8              3               6      18    right (shorter)
1     6      8              8               5      40    right (tie, either side)
1     5      8              4               4      16    right (shorter)
1     4      8              5               3      15    right (shorter)
1     3      8              2               2      4     right (shorter)
1     2      8              6               1      6     right (shorter)
```

`left` moves exactly once, at the very first step, since after that `heights[1] = 8` stays the taller side for the rest of the run, and `right` is always the one being abandoned. The largest area found along the way is `49`, at the second step, and nothing after it beats that, so `49` is the answer.

```javascript
{{#include ./examples/container-with-most-water.js}}
```

[Valid Palindrome](https://leetcode.com/problems/valid-palindrome/description/) gives a string and asks whether it reads the same forwards and backwards, counting only letters and digits, ignoring case, ignoring everything else. This is the case from the intuition chapter with no numeric order at all, just a fixed first character and a fixed last character to converge between.

Punctuation and spaces get skipped entirely before any comparison happens, `"A man, a plan, a canal: Panama"` really means comparing just `"amanaplanacanalpanama"`, letters only, lowercased.

Take `"race a car"`, which strips down to `"raceacar"`. `left = 0` (`r`), `right = 7` (`r`), match, both move inward. `left = 1` (`a`), `right = 6` (`a`), match, both move inward. `left = 2` (`c`), `right = 5` (`c`), match, both move inward. `left = 3` (`e`), `right = 4` (`a`), mismatch, stop immediately, the answer is `false`.

That last step is the whole safety argument. The moment a mismatch shows up, nothing else in the string needs checking, one failed comparison already proves the string isn't a palindrome. And every match settles that pair permanently, a matched `r` at the two ends is never revisited once both pointers have moved past it, there's no scenario where re-checking it later would change anything.

```javascript
{{#include ./examples/valid-palindrome.js}}
```

[Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/description/) gives an array of wall heights and asks for the total water trapped after it rains. This is the case from the intuition chapter with a small monotonic running value carried alongside the pointers, `maxLeft` and `maxRight`.

Water trapped at any single position is `min(maxLeftOf(i), maxRightOf(i)) - height[i]`, the shorter of the two boundary walls decides how high the water can sit there, same idea as Container With Most Water, just asked at every position instead of between two chosen walls once.

**Getting to the two-pointer version.** Start from the direct approach: build a `leftMax` array, left to right, and a `rightMax` array, right to left, then read both at every index. `leftMax[i]` only ever depends on indices before it, so building it left to right means each value is only ever needed once, right when it's produced, nothing past that point needs to look back. Storing the full array is wasted effort, a single running variable, the max so far, carries everything actually needed. The same is true of `rightMax`, walking right to left.

That's the whole optimization, except for one snag: the two running variables come from walks in opposite directions, and we need both at the same index at once. Two pointers is what resolves that, `left` carrying its running max forward, `right` carrying its running max backward, both walks happening at the same time, converging toward the middle. At any moment, one side is fully settled and the other isn't yet, so the real question becomes deciding which side to resolve next, and that's what `heights[left]` versus `heights[right]` answers, cheaply, without waiting for either walk to finish.

**Why the comparison is safe.** Say `heights[left] < maxLeft`, so `left` is not itself a new high point. Split on `heights[left]` against `heights[right]`. `right` sits somewhere within `[left, end]`, so `heights[right]` alone proves the true max from `left` to the end is at least `heights[right]`. When `heights[right] > heights[left]`, that's already bigger than `heights[left]`, and combined with `maxLeft` being tracked exactly, `maxLeft` is what decides the water level here, `right`'s side is provably not the bottleneck.

If instead `heights[left] >= maxLeft`, there's nothing to prove at all, this position is the tallest thing seen so far on this side, it can't trap water regardless of what's on the other side, `maxLeft` just updates to `heights[left]` and the answer here is `0`.

I'll be honest about the piece I'm not fully deriving here, showing that `maxLeft` is always safe to use rather than the true (unknown) max from the right relies on a subtler invariant than a single comparison, it holds, this is a standard, thoroughly checked algorithm, but a tight proof of it takes more space than fits cleanly here.

Take `heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]`.

```
left  right  h[left]  h[right]  maxLeft  maxRight  move   water added  total
0     11     0        1         0        0         left   0            0
1     11     1        1         1        0         right  0            0
1     10     1        2         1        1          left  0            0
2     10     0        2         1        1          left  1            1
3     10     2        2         2        1         right  0            1
3     9      2        1         2        2         right  1            2
3     8      2        2         2        2         right  0            2
3     7      2        3         2        2          left  0            2
4     7      1        3         2        2          left  1            3
5     7      0        3         2        2          left  2            5
6     7      1        3         2        2          left  1            6
```

`left` and `right` meet at index `7`, loop ends, total water trapped is `6`, which matches the known answer for this input.

```javascript
{{#include ./examples/trapping-rain-water.js}}
```

[Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/description/) gives an array sorted in ascending order, possibly containing negatives, and asks for the squares of every element, sorted in ascending order. No target to match here, which makes it a different shape from every Converging problem so far.

Squaring a negative number can flip its rank entirely, `-10` is the smallest value in the input but `100` is the largest square. Sorting the squares directly would mean starting over, ignoring the order the input already has, and paying `O(n log n)` for it.

The input's order isn't wasted though. In a sorted array, the most negative value sits at the far left and the most positive at the far right, and the largest absolute value, the one that produces the largest square, has to be one of those two, nothing in the middle can beat both ends at once. So at every step, comparing `nums[left]` and `nums[right]` by their squares tells us which one is currently the largest square remaining, no scan needed.

That flips the usual direction of filling an array. The largest square is known first, but it belongs at the last position of the sorted result, not the first. So the result array gets filled back to front, largest square placed at the highest open slot, and whichever pointer produced it moves inward for the next comparison.

Take `nums = [-4, -1, 0, 3, 10]`.

```
left  right  nums[left]  nums[right]  left²  right²  placed at  value  move
0     4      -4          10           16     100     4          100    right
0     3      -4          3            16     9       3          16     left
1     3      -1          3            1      9       2          9      right
1     2      -1          0            1      0        1          1     left
2     2      0           0            0      0        0          0     either
```

Reading the `value` column bottom to top gives the result, `[0, 1, 9, 16, 100]`, already in sorted order, without ever sorting the squares directly.

```javascript
{{#include ./examples/squares-of-a-sorted-array.js}}
```
