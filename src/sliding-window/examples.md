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

## Variable Size, Maximizing

[Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/) gives a string and asks for the length of the longest substring with no repeated character.

Read the problem statement word by word. "Longest" is a max ask, the first signal. "Substring" is a contiguous range, the second signal, stronger. "Without repeating characters" is the third, it hands over the condition that moves `left`, the window is invalid the moment a character shows up twice inside it. It also passes the direction check on its own, dropping a character off the left edge can only reduce or keep the same number of duplicates, never create a new one.

The brute force checks every substring for duplicates, rebuilding a set of its characters each time. The window keeps one set alive instead, holding exactly the characters currently inside it, added to as `right` grows, removed from as `left` shrinks. That removal is the undo step, and it's what marks this as sliding window rather than plain two pointers.

Each time `right` reaches a new character, one question decides everything, is that character already inside the window. If not, add it and move on. If yes, `left` has to step forward, dropping characters off the left edge one at a time, until the duplicate is gone, and only then does the new character go in.

That check has to happen before adding, not after. A `Set` silently ignores an attempt to add a value it already holds, so adding first would hide the very duplicate we need to notice.

Take `s = "abcabcbb"`.

```
right  char  window before  action                           left  window after  best
0      a     {}             add                              0     {a}           1
1      b     {a}            add                              0     {a, b}        2
2      c     {a, b}         add                              0     {a, b, c}     3
3      a     {a, b, c}      a inside, drop a, then add       1     {b, c, a}     3
4      b     {b, c, a}      b inside, drop b, then add       2     {c, a, b}     3
5      c     {c, a, b}      c inside, drop c, then add       3     {a, b, c}     3
6      b     {a, b, c}      b inside, drop a, drop b, add    5     {c, b}        3
7      b     {c, b}         b inside, drop c, drop b, add    7     {b}           3
```

`best` ends at `3`, from the window `abc`, matching the known answer.

```javascript
{{#include ./examples/longest-substring-without-repeating-characters.js}}
```

[Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/description/) gives a string of uppercase letters and an integer `k`. Up to `k` characters can be replaced with any other letter, and the question is the length of the longest substring that can be made all one letter.

"Longest" is the max ask, "substring" is the contiguous range. The third piece, the condition that moves `left`, isn't stated anywhere in the problem, it has to be derived. A window can be turned into all one letter by replacing every character that isn't its most frequent letter, so the number of replacements needed is `windowSize - countOfMostFrequentLetter`. The window is valid while that stays at most `k`, and invalid the moment it goes over, which is when `left` steps forward.

The tracked value here is a frequency map of the letters currently inside the window, incremented as `right` adds a letter, decremented as `left` drops one. That's the Frequency bucket from the Hashing chapter sitting inside the window. Sliding window decides how the window moves, hashing supplies what gets tracked inside it, and most non-trivial sliding window problems are one wrapped around the other.

Take `s = "AABABBA"`, `k = 1`.

```
right  char  window after shrinking  counts     size  most  size - most  best
0      A     A                       A1         1     1     0            1
1      A     AA                      A2         2     2     0            2
2      B     AAB                     A2 B1      3     2     1            3
3      A     AABA                    A3 B1      4     3     1            4
4      B     BAB                     A1 B2      3     2     1            4
5      B     BABB                    A1 B3      4     3     1            4
6      A     BBA                     A1 B2      3     2     1            4
```

At `right = 4` the window `AABAB` needs `5 - 3 = 2` replacements, over `k = 1`, so `left` steps forward twice, first dropping an `A`, then another `A`, until the window is `BAB`. The same thing happens at `right = 6`. `best` ends at `4`, the known answer for this input.

A widely used version of this solution skips recomputing the most frequent count on every shrink, it keeps a running maximum that only ever goes up and never lowers it. That saves scanning the map each time and gives correct answers, but proving that a stale maximum can never inflate the result takes a subtler argument than belongs here. The version below recomputes exactly, which stays cheap since the map never holds more than 26 letters.

```javascript
{{#include ./examples/longest-repeating-character-replacement.js}}
```

## Variable Size, Minimizing

[Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/description/) gives an array of positive integers and a target, and asks for the length of the shortest contiguous subarray whose sum is at least the target, or `0` if no such subarray exists.

The problem guarantees every number is positive, no zeros, no negatives. That guarantee is what makes everything below work, and it's worth holding onto from the start.

"Minimum" is the min ask, "subarray" is the contiguous range. The condition that moves `left` flips direction from the last two problems. Those shrank while the window was invalid. Here, growing `right` pushes the sum toward the target, so once the sum reaches it, the window is valid, and `left` keeps stepping forward for as long as the window stays valid, recording a smaller answer at every step, stopping only when dropping one more element would break it.

Because every number is positive, growing the window can only raise the sum and shrinking it can only lower it. That's the direction check passing, and it's the reason it's safe to stop shrinking the moment the sum drops below the target, nothing further along could have brought it back up.

Take `target = 7`, `nums = [2, 3, 1, 2, 4, 3]`.

```
right  added  sum  shrink steps                              left  sum after  best
0      2      2    none                                      0     2          -
1      3      5    none                                      0     5          -
2      1      6    none                                      0     6          -
3      2      8    record 4, drop 2                          1     6          4
4      4      10   record 4, drop 3, record 3, drop 1        3     6          3
5      3      9    record 3, drop 2, record 2, drop 4        5     3          2
```

`best` ends at `2`, from the window `[4, 3]`, the known answer for this input.

Now the same idea with a negative number, to see exactly what breaks. Take `target = 5`, `nums = [4, -5, 6]`. The true answer is `1`, the single element `[6]`. Running the same loop, `right = 2` gives a sum of `4 - 5 + 6 = 5`, valid, record a length of `3`. Then `left` drops the `4`, the sum falls to `1`, below the target, and the loop stops, reporting `3`. It stopped too early. The element actually blocking a smaller answer was the `-5` in the middle, and dropping it would have raised the sum, but the loop only shrinks while the sum stays at or above the target, so it never got that far. With negatives in the array, growing or shrinking the window no longer moves the sum in one predictable direction, and this shrinking condition stops being trustworthy. That's the case Subarray Sum Equals K in the Hashing chapter handles with prefix sums instead.

```javascript
{{#include ./examples/minimum-size-subarray-sum.js}}
```
