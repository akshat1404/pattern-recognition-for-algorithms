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

[Boats to Save People](https://leetcode.com/problems/boats-to-save-people/description/) gives each person's weight and a weight limit, a boat carries at most two people, and asks for the minimum number of boats to carry everyone. Every problem so far in this bucket asked "find" or "compute" something, this one asks for the smallest count, a different objective entirely.

Sort first. The heaviest person remaining always needs a boat, no way around that, so the only real question at each step is whether the lightest person remaining can ride along with them. That's the whole decision the two pointers are making, over and over.

Two things make that decision safe. If the lightest remaining person can't fit with the heaviest, nobody else remaining can either, everyone else is at least as heavy as the lightest, so the heaviest goes alone, no point checking anyone in between. If the lightest can fit, pairing them here is never worse than saving the lightest for someone else, since every other remaining person is heavier and has an easier time fitting with somebody regardless of who takes the lightest spot.

The code ends up looking close to Two Sum, sorted array, `left` and `right` converging, comparing a sum against a threshold, same skeleton. What's different is what happens after the comparison. Two Sum stops the moment it finds a match, the comparison's whole job is to locate one pair and return. Here there's no "found it" to stop on, every single step produces a boat regardless of the outcome, `boats++` runs unconditionally each iteration. The comparison isn't deciding when to stop, it's deciding how much progress this one boat buys, two people or one, `right` always moves, `left` only moves when the pair actually fits.

Take `people = [3, 2, 2, 1]`, `limit = 3`, sorted to `[1, 2, 2, 3]`.

```
left  right  sorted[left]  sorted[right]  sum  fits?  boats
0     3      1             3              4    no     1 (right alone)
0     2      1             2              3    yes    2 (paired)
1     1      2             2              4    no     3 (right alone)
```

Three boats, matching the known answer for this input.

```javascript
{{#include ./examples/boats-to-save-people.js}}
```

## Fast and Slow

[Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/description/) gives a sorted array and asks to remove duplicates in place, keeping one copy of each value, relative order preserved, and return the new length. The kept values have to end up in the first part of the array itself, no separate output array allowed.

Without sorting, "have I already kept this value" would need a set, remembering every value written so far, O(n) extra space, which the problem explicitly rules out. Sorted order removes that need entirely, duplicates are guaranteed to sit next to each other, so a new value only ever needs comparing against the single most recently kept value, not against everything kept so far.

`slow` marks the last position of the cleaned-up region, `fast` scans ahead one element at a time. Whenever `nums[fast]` differs from `nums[slow]`, it's a new value worth keeping, `slow` advances and `nums[fast]` gets written there. Whenever it matches, `fast` just moves on, nothing gets written, that duplicate is discarded.

Take `nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]`.

```
fast  nums[fast]  nums[slow]  action
1     0           0           skip (duplicate)
2     1           0           keep, slow = 1, nums[1] = 1
3     1           1           skip (duplicate)
4     1           1           skip (duplicate)
5     2           1           keep, slow = 2, nums[2] = 2
6     2           2           skip (duplicate)
7     3           2           keep, slow = 3, nums[3] = 3
8     3           3           skip (duplicate)
9     4           3           keep, slow = 4, nums[4] = 4
```

`slow` ends at `4`, so the new length is `5`, and the first five positions hold `[0, 1, 2, 3, 4]`, matching the known result for this input.

```javascript
{{#include ./examples/remove-duplicates-from-sorted-array.js}}
```

[Move Zeroes](https://leetcode.com/problems/move-zeroes/description/) gives an array and asks to move every zero to the end, keeping the relative order of the non-zero elements, in place, no copy of the array allowed. Unlike Remove Duplicates, this array isn't sorted at all, only the original relative order needs preserving, the weaker version of order from the intuition chapter.

The decision at each step is simpler than Remove Duplicates too, no comparison against `slow`'s value needed, just whether `nums[fast]` is zero or not. But there's a wrinkle Remove Duplicates didn't have, a discarded duplicate can just be overwritten and forgotten, a zero can't, it still has to exist somewhere in the final array, just pushed to the end. That's why `slow` and `fast` swap places here instead of one overwriting the other, swapping relocates whatever was sitting at `slow` (a zero, or something already correctly placed) into `fast`'s old spot rather than losing it.

Take `nums = [0, 1, 0, 3, 12]`.

```
fast  nums[fast]  action                         array after
0     0           skip (zero)                    [0, 1, 0, 3, 12]
1     1           swap(slow=0, fast=1), slow=1    [1, 0, 0, 3, 12]
2     0           skip (zero)                     [1, 0, 0, 3, 12]
3     3           swap(slow=1, fast=3), slow=2    [1, 3, 0, 0, 12]
4     12          swap(slow=2, fast=4), slow=3    [1, 3, 12, 0, 0]
```

Final array is `[1, 3, 12, 0, 0]`, non-zero elements in their original relative order, every zero pushed to the end.

```javascript
{{#include ./examples/move-zeroes.js}}
```

[Remove Duplicates from Sorted Array II](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/description/) is the same problem as before, but each value is now allowed to appear up to twice, not just once. Comparing `nums[fast]` against `nums[slow]`, the single most recently kept value, isn't enough anymore, that rule only ever lets one copy through.

The fix moves the comparison back one more slot. Instead of checking against the last kept value, check against the value kept two positions before `slow`. If `nums[fast]` matches that, keeping it would make three copies of the same value in a row, since the two positions right before it already hold that value, so it gets skipped. If it doesn't match, keeping it is safe, either it's a genuinely new value, or it's a duplicate but fewer than two copies have been kept so far.

Take `nums = [1, 1, 1, 2, 2, 3]`.

```
fast  nums[fast]  slow  check                    action
0     1           0     slow < 2                 keep, slow = 1
1     1           1     slow < 2                 keep, slow = 2
2     1           2     1 == nums[0] (1)          skip (third copy)
3     2           2     2 != nums[0] (1)          keep, slow = 3
4     2           3     2 != nums[1] (1)          keep, slow = 4
5     3           4     3 != nums[2] (2)          keep, slow = 5
```

`slow` ends at `5`, the new length, and the first five positions hold `[1, 1, 2, 2, 3]`, matching the expected result, two copies of `1`, two copies of `2`, one `3`.

```javascript
{{#include ./examples/remove-duplicates-from-sorted-array-ii.js}}
```

[Sort Colors](https://leetcode.com/problems/sort-colors/description/), the Dutch National Flag problem, gives an array containing only `0`s, `1`s, and `2`s and asks to sort it in place, in one pass, without counting occurrences first. Move Zeroes got away with two pointers because it only had two categories, zero and non-zero. Three categories need a third pointer, since a two-way split can only ever describe a boundary between two regions, not three.

`low` marks the edge of the confirmed-`0` region, everything before it is settled. `high` marks the edge of the confirmed-`2` region, everything after it is settled. `mid` scans forward, classifying whatever it currently sits on and deciding what to do with it.

If `nums[mid]` is `0`, swap it with `nums[low]`, extending the confirmed-`0` region, and both `low` and `mid` advance, the value that came back from `low` is always safe to skip past, since the region before `mid` was already fully classified earlier, it could only have held a `0` or a `1`, never an unclassified value. If `nums[mid]` is `1`, it's already in the right place, `mid` just advances. If `nums[mid]` is `2`, swap it with `nums[high]`, extending the confirmed-`2` region, but `mid` does not advance here, whatever just got swapped in from `high` hasn't been looked at yet, and skipping it could leave it misclassified.

Take `nums = [2, 0, 2, 1, 1, 0]`.

```
mid  nums[mid]  low  high  action                      array after
0    2          0    5     swap(mid, high), high = 4    [0, 0, 2, 1, 1, 2]
0    0          0    4     swap(low, mid), low=1, mid=1  [0, 0, 2, 1, 1, 2]
1    0          1    4     swap(low, mid), low=2, mid=2  [0, 0, 2, 1, 1, 2]
2    2          2    4     swap(mid, high), high = 3     [0, 0, 1, 1, 2, 2]
2    1          2    3     mid = 3                       [0, 0, 1, 1, 2, 2]
3    1          2    3     mid = 4                       [0, 0, 1, 1, 2, 2]
```

`mid` passes `high`, loop ends, final array `[0, 0, 1, 1, 2, 2]`, fully sorted in one pass.

```javascript
{{#include ./examples/sort-colors.js}}
```

## Linked List

[Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/description/) gives the head of a linked list and asks whether it contains a cycle, some node's `next` eventually leads back to a node already visited instead of ending at `null`. No random access here, no indices, only `.next`, which is why this bucket works mechanically differently from the other two.

The direct fix is a set, record every node visited, check each new node against it, seen-before from hashing applied here. That works, but it costs O(n) space, one entry per node. Two pointers gets the same answer in O(1) space by moving at different speeds instead of remembering anything.

`slow` moves one node per step, `fast` moves two. If there's no cycle, `fast` simply reaches the end first, nothing more to check. If there is a cycle, `fast` enters it before `slow` does, and every step afterward closes the gap between them by exactly one node, since `fast` gains one extra step of ground per iteration. A shrinking gap that never resets means they're guaranteed to land on the same node eventually, not just pass each other, which is what makes `slow === fast` a reliable signal.

Take a list `A(3) -> B(2) -> C(0) -> D(-4)`, where `D.next` points back to `B` instead of `null`.

```
step  slow  fast  meet?
0     A     A     no (start)
1     B     C     no
2     C     B     no
3     D     D     yes
```

`fast` computed as two `.next` hops each step, `A -> B -> C` on step 1, `C -> D -> B` on step 2 (following the cycle back), `B -> C -> D` on step 3, where it lands on `D` at the same time `slow` does. They meet, a cycle exists.

```javascript
{{#include ./examples/linked-list-cycle.js}}
```

[Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/description/) asks a harder question than the last one, not just whether a cycle exists, but where it starts. Same O(1) space constraint, no set of visited nodes, no modifying the list.

Phase one is identical to before, `slow` and `fast` at different speeds until they meet somewhere inside the cycle. The new part is phase two, and the reasoning behind it is worth working through rather than taking on faith.

Let `a` be the distance from `head` to the cycle's start, `b` the distance from the start to wherever `slow` and `fast` meet, and `c` the rest of the way around the cycle back to the start, so the cycle's total length is `b + c`. When they meet, `slow` has traveled `a + b`. `fast` moves twice as fast in the same time, so it's traveled `2(a + b)`. `fast`'s extra distance beyond `slow`'s is entirely laps around the cycle, some whole number of them, call it `k`, so `2(a + b) - (a + b) = kL`, which simplifies to `a + b = kL`. Substituting `L = b + c` and solving for `a` gives `a = c + (k - 1)L`.

That equation says `a` and `c` are the same distance, plus possibly a few extra full laps around the cycle. Extra full laps don't matter, walking an exact multiple of the cycle's length just returns to the same node. So starting one pointer at `head` and another at the meeting point, and moving both one step at a time, they're guaranteed to land on the same node after `a` steps, which is exactly the cycle's start.

Take the same list as before, `A(3) -> B(2) -> C(0) -> D(-4)`, `D.next` pointing back to `B`. Phase one found `slow` and `fast` meeting at `D`. For phase two, `ptr1` resets to `A`, `ptr2` stays at `D`.

```
step  ptr1  ptr2  meet?
0     A     D     no
1     B     B     yes
```

Both land on `B` after one step, which is the actual start of the cycle in this list, `a = 1` (`A` to `B`), `c = 1` (`D` to `B`), matching the derivation exactly.

```javascript
{{#include ./examples/linked-list-cycle-ii.js}}
```

[Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/description/) gives the head of a linked list and asks for the middle node, the second of the two middle nodes if the list has an even length. A linked list has no O(1) length the way an array does, so the direct fix is two passes, one to count the nodes, one to walk to the halfway point.

`fast` covers twice the ground `slow` does in the same number of steps, so by the time `fast` has walked the whole list, `slow` has walked exactly half of it, one pass instead of two.

Odd length, `1 -> 2 -> 3 -> 4 -> 5`.

```
step  slow  fast
0     1     1
1     2     3
2     3     5
```

`fast` reaches `5`, `fast.next` is `null`, loop stops, `slow` is at `3`, the exact middle.

Even length, `1 -> 2 -> 3 -> 4`.

```
step  slow  fast
0     1     1
1     2     3
2     3     null
```

`fast` becomes `null` after the second step (`3.next.next` runs past the end), loop stops, `slow` is at `3`, the second of the two middle nodes, matching what the problem asks for.

```javascript
{{#include ./examples/middle-of-the-linked-list.js}}
```

[Reorder List](https://leetcode.com/problems/reorder-list/description/) asks to rearrange `L0 -> L1 -> ... -> Ln` into `L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...`, alternating from the front and the back, in place. A linked list can only be walked forward, so reaching "the back" repeatedly would normally mean re-walking from the head every time, or paying for an array of node references to get O(1) access from either end. Three phases, each one already covered elsewhere in this chapter, avoid both.

Take `1 -> 2 -> 3 -> 4 -> 5`.

**Phase 1, find the middle.** Exactly Middle of the Linked List, fast and slow. `slow` ends at `3`.

**Phase 2, cut and reverse the second half.** `slow.next` gives the second half, `4 -> 5`, and `slow.next = null` cuts it away from the first half, `1 -> 2 -> 3`. Reversing `4 -> 5` in place, standard pointer reversal, gives `5 -> 4`. Reversing it is what turns "the back of the list" into something walkable front-to-back, `5` is now first, `4` is now second, in the exact order they need to be read off during the merge.

**Phase 3, merge by alternating.** Walk both halves at once, `first` through `1 -> 2 -> 3`, `second` through `5 -> 4`, splicing one node from each into the result before moving both forward.

```
first  second  splice                    result so far
1      5       1.next=5, 5.next=2        1 -> 5 -> 2 -> 3
2      4       2.next=4, 4.next=3        1 -> 5 -> 2 -> 4 -> 3
3      null    loop ends (second empty)  1 -> 5 -> 2 -> 4 -> 3
```

Final list, `1 -> 5 -> 2 -> 4 -> 3`, matching `L0 -> Ln -> L1 -> Ln-1 -> L2` exactly, with the middle node, `3`, left on its own at the end since the list has an odd length.

```javascript
{{#include ./examples/reorder-list.js}}
```

[Swapping Nodes in a Linked List](https://leetcode.com/problems/swapping-nodes-in-a-linked-list/description/) gives a list and an integer `k`, and asks to swap the values of the kth node from the start and the kth node from the end. The start side is easy, walk `k - 1` steps from `head`. The end side is the actual problem, a linked list has no length to compute an index from, unlike an array where "kth from the end" is just `length - k`.

The fix doesn't compute an index at all, it keeps a fixed gap between two pointers instead. Once one pointer is `k - 1` steps ahead of the other, sliding both forward together, one step each, keeps that same gap the whole way. The moment the front pointer reaches the last node, the back pointer has to be exactly `k` nodes from the end, since the gap between them never changed, only where in the list it's sitting.

Take `head = [1, 2, 3, 4, 5]`, `k = 2`.

`first` walks `1` step from `head`, landing on node `2` (the 2nd from the start). `second` starts back at `head`, `runner` starts at `first`'s position, and both slide forward together until `runner` runs out of `next`.

```
step  runner  second
0     2       1
1     3       2
2     4       3
3     5       4
```

`runner` reaches `5`, the last node, `runner.next` is `null`, loop stops. `second` is at node `4`, the 2nd from the end. Swap the values at `first` (`2`) and `second` (`4`), giving `[1, 4, 3, 2, 5]`.

```javascript
{{#include ./examples/swapping-nodes-in-a-linked-list.js}}
```
