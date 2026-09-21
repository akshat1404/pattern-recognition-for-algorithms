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

[Permutation in String](https://leetcode.com/problems/permutation-in-string/description/) gives two strings, `s1` and `s2`, and asks whether `s2` contains a permutation of `s1` as a contiguous substring.

Read the statement the same way as before, and notice what's missing. There's no min or max ask, the answer is a yes or no. But "substring" is still the contiguous range, and the window's size is handed over directly, a permutation of `s1` has exactly `s1`'s length. So this is the fixed-size shape, and the answer to "what moves `left`" is the same as in Maximum Average Subarray, the window's length reaching past `s1`'s length.

A permutation of `s1` is an anagram of `s1`, same letters, same counts. That's the Valid Anagram question from the Hashing chapter, asked of every window of `s2` that is exactly `s1`'s length. Checking each window from scratch would rebuild its letter counts every time. Sliding window supplies the other half of the solution, moving the window forward changes exactly two letters, one leaves, one enters, so the counts adjust in constant time. Hashing decides what a match means, sliding window decides how to check it at every position without redoing the work.

Comparing the two count arrays in full after every move would cost a scan of 26 letters each time. The same idea from Minimum Window Substring applies here, keep a counter, `matches`, of how many of the 26 letters currently have equal counts in both. A letter becomes matched when its count reaches the target, and stops being matched when it moves one past it. The window is a permutation exactly when `matches` reaches `26`.

Take `s1 = "ab"`, `s2 = "eidbaooo"`, so the window is `2` wide. The first window, `ei`, has `22` letters matching, every letter except `a`, `b`, `e`, and `i`.

```
right  window  entering  leaving  matches
2      id      d         e        22
3      db      b         i        24
4      ba      a         d        26
```

At `right = 2`, `d` enters and stops matching, `e` leaves and starts matching again, so `matches` holds at `22`. At `right = 3`, `b` enters and reaches its target, `i` leaves and starts matching, `matches` goes to `24`. At `right = 4`, `a` enters and reaches its target, `d` leaves and starts matching, `matches` reaches `26`, and the answer is `true`, the window `ba` is a permutation of `ab`.

```javascript
{{#include ./examples/permutation-in-string.js}}
```

[Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/description/) gives an array and a window size `k`, and asks for an array containing the maximum of every window as it slides across, one number per window position. For `nums = [1, 3, -1, -3, 5, 3, 6, 7]` and `k = 3`, the answer is `[3, 3, 5, 5, 6, 7]`.

The size is given, so this is the fixed-size shape, and `left` moves when the window's length passes `k`. The maximum being asked for is the largest value inside each window, not a window size, so there's no min or max ask over sizes here, same as Permutation in String.

The brute force finds the max of every window by scanning all `k` of its elements, `n - k + 1` windows at `k` elements each, `O(n * k)`. Each slide changes exactly two things, one element leaves, one enters, and the other `k - 1` elements stay exactly as they were. The brute force ignores that and re-reads them anyway.

For a sum, using that is one line, add the entering number, subtract the leaving one. A maximum has no such shortcut. A single running max works until the max itself leaves the window, and then there's nothing to subtract, the next biggest has to come from somewhere in the elements that stayed, and a lone variable never recorded it. So the question becomes: for the `k - 1` elements that stay, what is the least that needs to be remembered so the next max can be answered without re-reading them?

Remembering only the max and the second max feels like enough, and it isn't. Take `nums = [9, 8, 7, 6, 5]`, `k = 3`, correct answers `[9, 8, 7]`. The first window `[9, 8, 7]` has max `9`, second `8`, and `7` gets thrown away. Slide, `9` leaves, `6` enters, the window is `[8, 7, 6]`, the max is `8`, correct, but the new second max should be `7`, which was discarded, so `6` takes its place. Slide again, `8` leaves, the window is `[7, 6, 5]`, and the tracker only knows `6`, so it reports `6` when the true max is `7`. In a decreasing run, every number in the window gets its turn as the max, one after another, as the bigger ones ahead of it leave, so every one of them has to be remembered.

What can be forgotten is a number that will never get a turn. A number that is both older and smaller than something that arrived after it. Take `[3, 1, 2]`. `1` sits before `2`, so `1` leaves the window before `2` does, and `2` is bigger the whole time they share the window. `1` will never be the max, so it can be dropped. Smaller numbers that arrive later are the ones to keep, since they are still in the window after the bigger ones ahead of them leave.

That list of surviving candidates is kept in a deque, short for double-ended queue, a list where items can be added and removed at both ends. A regular queue only adds at the back and removes from the front, a stack only touches one end, a deque allows both, and this problem uses both.

A new number arrives, and everything smaller than or equal to it is removed from the back, one at a time, stopping at the first number that is bigger, then the new number is added at the back. The front number's position has slid out of the window, so it is removed from the front. The current max is needed, so the front is read.

The deque ends up in decreasing order from front to back, but nothing sorts it. The order is a side effect of the removal rule, every number gets removed if something bigger and newer arrives behind it, so whatever sits in front of any number is bigger or equal. That's why the front is always the max, and finding the max costs nothing, no scan. It also never holds the whole window, only the survivors, and can be shorter than the window, never longer. Numbers equal to the new one are removed too, the newer copy leaves later and is just as large, so the older one never matters.

If a new number is smaller than the front but bigger than the back, removal continues from the back until it reaches something bigger, and the new number goes right after it. With deque values `[7, 5, 2]` and a new number `4`, `2` is removed, `5` is bigger so removal stops, and `4` is added, giving `[7, 5, 4]`. It sits in the middle of the old contents by value but at the back of the deque, since everything that was behind it was removed.

Take `nums = [1, 3, -1, -3, 5, 3, 6, 7]`, `k = 3`, showing the deque's values.

```
new number  deque after       max
1           [1]               -
3           [3]               -      (1 dropped, 3 beats it)
-1          [3, -1]           3
-3          [3, -1, -3]       3
5           [5]               5      (-3, -1, 3 all dropped)
3           [5, 3]            5
6           [6]               6      (3 and 5 dropped)
7           [7]               7
```

When `5` arrives, the window is `[-1, -3, 5]`, but the deque holds only `5`. `-1` and `-3` sit before `5` and leave sooner, so they can never win again. The result is `[3, 3, 5, 5, 6, 7]`.

Nothing in that trace ever removed the front for sliding out of the window, because every number arriving was big enough to clear things first. That case shows up in a decreasing run. Take `nums = [9, 8, 7, 6, 5]`, `k = 3`.

```
new number  deque before front check  front out of window?  deque after   max
9           [9]                       no                     [9]           -
8           [9, 8]                    no                     [9, 8]        -
7           [9, 8, 7]                 no                     [9, 8, 7]     9
6           [9, 8, 7, 6]              yes, 9 slid out        [8, 7, 6]     8
5           [8, 7, 6, 5]              yes, 8 slid out        [7, 6, 5]     7
```

Nothing new beats anything ahead of it, so the deque keeps everything, and the front leaves purely because its position slid out of the window. The result is `[9, 8, 7]`, the correct answer, and the exact case where keeping only the max and the second max failed.

Each number is added to the deque once and removed at most once, so the whole thing runs in `O(n)`, even though a single step can remove many numbers. The code stores indices instead of values, since the front's position is what says whether it has slid out.

```javascript
{{#include ./examples/sliding-window-maximum.js}}
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

[Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/description/) gives two strings, `s` and `t`, and asks for the shortest substring of `s` that contains every character of `t`, duplicates included, or an empty string if none exists.

"Minimum" is the min ask, "substring" is the contiguous range. The condition that moves `left` is the window containing everything `t` needs, so the shape matches the last problem, `right` grows until the window becomes valid, then `left` shrinks for as long as it stays valid, recording the smallest window along the way.

What's different is how validity works. The last problem checked a single running sum against a target. Here, validity is about how many of each specific character the window holds, which points to a frequency map, two of them, one for what `t` requires, built once, and one for what the window currently holds, adjusted as `right` grows and `left` shrinks. The direction check still holds, adding a character can never reduce what the window covers, and dropping one can never add coverage.

Comparing the two maps in full after every move would cost a scan each time. The usual trick keeps a single counter instead, `formed`, the number of distinct required characters that currently have enough copies in the window. It only changes at the exact moment a character's count reaches its required amount going up, or drops below it going down. Extra copies beyond the requirement change nothing, and neither does dropping one of them. Validity becomes one comparison, `formed` against the number of distinct characters in `t`.

Take `s = "ADOBECODEBANC"`, `t = "ABC"`, so `A`, `B`, and `C` are each required once.

```
right  char  formed  events                                               left  best
0-2    A D O 1       none                                                 0     -
3      B     2       none                                                 0     -
4      E     2       none                                                 0     -
5      C     3       valid, record ADOBEC (6), drop A, formed back to 2    1     ADOBEC
6-8    O D E 2       none                                                 1     ADOBEC
9      B     2       B count is now 2, formed unchanged                    1     ADOBEC
10     A     3       valid, windows of 10, 9, 8, 7, 6 are none smaller,    6     ADOBEC
                     dropping C at left 5 sends formed back to 2
11     N     2       none                                                 6     ADOBEC
12     C     3       valid, 7 and 6 are not smaller, record EBANC (5),     10    BANC
                     record BANC (4), drop B, formed back to 2
```

At `right = 9`, the second `B` arrives and `formed` doesn't move, `B` was already covered. Later, when `left` drops the first `B`, its count falls from `2` to `1`, still enough, so `formed` doesn't move then either. The answer is `BANC`, the known result for this input.

```javascript
{{#include ./examples/minimum-window-substring.js}}
```
