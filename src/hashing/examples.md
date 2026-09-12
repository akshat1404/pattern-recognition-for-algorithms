# Intuition in Action

Worked problems from the intuition chapter, reasoning and code together, one bucket at a time.

## Seen Before

[Contains Duplicate](https://leetcode.com/problems/contains-duplicate/description/) hands us an array and asks a single question, does any value in it show up more than once. Nothing about order matters, nothing about position matters, the only thing that matters is whether a value repeats anywhere in the array.

The naive way to answer that is to pick a value and check it against every other value in the array, then move to the next value and do the same thing again. That works, but it means for every single element we are re-reading the whole array to answer one yes-or-no question. The work we redo on every step is identical in shape, "is this value present among the ones I have already looked at."

That repeated shape is the tell. If the question we keep re-asking is always "have I already looked at this value," we do not need to re-read anything, we just need to remember what we have already looked at. That is exactly what a hash map gives us, a place to record every value the moment we look at it, and a way to check that record in one step instead of a scan.

So the approach becomes: walk the array once, and for each value, first ask the map if it already holds this value. If it does, we have our duplicate and we are done, no need to look further. If it does not, we record it in the map and move to the next value. By the time we reach any given element, the map contains every element that came before it, so checking the map is the same as checking the whole array up to that point, except it costs one lookup instead of a scan. That is why the seen-before question maps directly onto this problem, and why the fix for the repeated O(n) scan is a single hash map built as we go.

```javascript
{{#include ./examples/contains-duplicate.js}}
```

[Contains Duplicate II](https://leetcode.com/problems/contains-duplicate-ii/description/) asks the same seen-before question with one more condition attached, a repeat only counts if the two indices are within `k` of each other. So "have I seen this value" is not enough on its own anymore, we also need to know where we saw it.

That changes what the map has to hold. Instead of a set that only answers yes or no, we need a map from value to the index it last appeared at. The check on each element becomes two parts, has this value shown up before, and if so, is the gap between here and there small enough to count.

The map still gets written to on every element, whether or not that element triggers a match, because a value seen too far back to count now might still be close enough to count against a later index. Overwriting the last-seen index each time keeps the stored position as recent as possible, which is exactly what the distance check needs.

```javascript
{{#include ./examples/contains-duplicate-ii.js}}
```

[Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/description/) gives an unsorted array and asks for the length of the longest run of consecutive integers hiding inside it, in O(n) time. "Consecutive" here means back to back on the number line, not back to back in the array. Take `[100, 4, 200, 1, 3, 2]`, scattered in that order, but 1, 2, 3, 4 sit next to each other once we think in terms of value rather than position, and no longer run in the array beats that, so the answer is 4.

Sorting first would make the run easy to spot, `[1, 2, 3, 4, 100, 200]` has the run sitting right next to itself, but sorting itself already costs O(n log n), which rules it out before we even get to the counting.

Without sorting, we still have to figure out which numbers keep the consecutive sequnce going, and the only tool we start with is the raw array. Take `1` from our example array. To know the run keeps going, we need to know whether `2` shows up anywhere in `[100, 4, 200, 1, 3, 2]`, which means scanning the array looking for it. It does, so we check for `3` the same way, another full scan, then `4`, another scan, then `5`, one more scan that comes back empty and stops the run there.

That is four scans just to measure the run starting at `1`. Now consider that we do not know in advance where a run starts, so in the worst case this same scan-for-the-next-number step gets repeated starting from every single number in the array. Each of those scans costs O(n) on its own, and we potentially do one for every element, which multiplies out to O(n^2) overall, the exact cost we were trying to avoid by skipping the sort.

Look at what actually got repeated across all those scans: the same question, is this specific number present in the array, asked over and over with a different number each time. Answering it by scanning costs O(n) per question, and we are asking it many times, which is where the O(n^2) comes from. What we need instead is a way to answer that same question in one step, not a scan.

That means recording every number somewhere we can check instantly, before doing any counting. A set does exactly that, so put every number in the array into a set first. After that, asking "is n + 1 present" is a single lookup, not a search across the array, the same fix that turned Contains Duplicate from a scan into a seen-before check.

This puts the solution in two separate passes. The first pass walks the original array once, just to load every number into the set. The second pass walks the set, not the array, doing the actual counting. Iterating the set instead of the array also means a number that appears more than once in the input only gets processed once, since the set already collapsed it to a single entry.

That alone still leaves a second problem, counting from every number would recount the same run many times, once from each of its members. Take `1, 2, 3, 4` from the example, if we counted forward from `1`, then again from `2`, then again from `3`, we would redo the same run three extra times.

The fix is to make each number disappear from the set the moment it gets counted. Walk the set, and for a number still there, delete it, then expand outward from it, right first, then left, deleting every neighbor as it gets pulled into the run. A number that already got absorbed into an earlier run is already gone from the set by the time the outer walk would have reached it, and a set's iterator skips entries that were already deleted, so it is simply never visited a second time. Every number gets deleted exactly once, and every deletion happens during exactly one expansion, so the total work across every run put together is still O(n).

```javascript
{{#include ./examples/longest-consecutive-sequence.js}}
```

[Happy Number](https://leetcode.com/problems/happy-number/description/) gives a positive integer and a rule, replace the number with the sum of the squares of its digits, then do it again to whatever comes out, and again. If this process ever reaches 1, the number is happy. Take `19`: `1^2 + 9^2 = 82`, then `8^2 + 2^2 = 68`, then `6^2 + 8^2 = 100`, then `1^2 + 0^2 + 0^2 = 1`. Reached 1, so 19 is happy.

I know it is not very intuitive to know that this problem demands a map, but here's the spoiler : Loop only ends one of two ways, n reached 1, or n repeated.

Not every number does become 1 at the end. Take `2`: `4, 16, 37, 58, 89, 145, 42, 20, 4`. Look at the last value, `4`, it already showed up earlier in this same sequence. From here on, applying the same rule to `4` produces the exact same sequence all over again, `16, 37, 58`, forever. It will never reach 1, but nothing in the rule itself says when to give up and answer no.

That is the actual problem hiding in this one. The rule only tells us how to compute the next number, it never tells us when to stop. Without some way to notice a repeat, the only way to be sure a number is not happy is to keep applying the rule forever, which is not something a program can do.

A repeat is exactly what we can catch with a seen-before check, just applied to computed values instead of array elements. Keep a set of every value produced so far. Before computing the next one, check whether the current value is already in the set, if it is, the sequence has looped back on itself and will never reach 1, so we stop and answer no. If it reaches 1 first, we stop and answer yes. Either way, the seen-before check is what turns "keep going forever" into a guaranteed stopping point.

```javascript
{{#include ./examples/happy-number.js}}
```

## Frequency

[Valid Anagram](https://leetcode.com/problems/valid-anagram/description/) gives two strings and asks whether the second is an anagram of the first, meaning it uses the exact same letters, the exact same number of times each, just arranged differently. `"anagram"` and `"nagaram"` are anagrams. `"rat"` and `"car"` are not, even though both are three letters, because the letters themselves don't match.

Order plays no role in the answer at all, which is the first thing worth noticing. Whatever approach we use has to somehow throw away position and only compare, for each letter, how many times it shows up. That is a frequency question, not a seen-before question, "does the letter a show up twice in both strings" is a different thing to check than "does the letter a show up at all."

One way to answer that without extra structure is to sort both strings and compare them letter by letter. Two strings with the same letters in the same quantities become identical once sorted, `"anagram"` and `"nagaram"` both sort to `"aaaagmnr"`. That works, but sorting costs O(n log n), and we are only using the sort to line up matching letters, not because order matters to the actual answer.

A frequency map gets the same answer without sorting. Count how many times each letter appears in the first string. Then walk the second string, and for each letter, subtract one from that letter's count instead of adding. If the two strings really do have matching letters in matching amounts, every subtraction lands on a count that was already there waiting to be used up, and by the end every count reaches exactly zero.

Two failures fall out of that same process on their own. If the second string contains a letter the first string never had, there is no count to subtract from, an immediate mismatch. If a count is left over above zero once the second string runs out, the first string had more of that letter than the second string used, also a mismatch. Deleting a letter's entry the moment its count hits zero means that at the end, an empty map is itself the proof that everything matched, nothing extra is left over on either side.

```javascript
{{#include ./examples/valid-anagram.js}}
```

[Ransom Note](https://leetcode.com/problems/ransom-note/description/) gives a ransom note string and a magazine string, and asks whether the note can be built entirely by cutting letters out of the magazine, using each letter in the magazine at most once. If the note needs two `e`s, the magazine has to have at least two `e`s to give up.

This looks close to Valid Anagram, both come down to counting letters, but the relationship between the two strings is different in a way that matters. Valid Anagram asks whether two strings have exactly matching letter counts, the same amount of everything on both sides. Ransom Note only asks whether one string's counts are enough to cover the other's, the magazine is allowed to have letters left over that the note never touches.

That difference changes what the frequency map gets used for. Build it from the magazine, one count per letter available. Then walk the note, and for each letter, check whether the map still has any of it left. If it does, spend one, subtract from the count. If it doesn't, either the letter never appeared in the magazine at all or every copy of it has already been spent by an earlier letter in the note, either way the note cannot be built and we stop right there.

Notice what we do not check here. Valid Anagram ends by confirming the map is completely empty, because leftover counts on either side meant a mismatch. Ransom Note never checks that, a magazine with `10` unused letters after the note is fully built is still a valid build, those letters just never got used. The only thing that fails the whole problem is running out of a letter the note still needs, which is exactly the one check the loop performs.

```javascript
{{#include ./examples/ransom-note.js}}
```

[Majority Element](https://leetcode.com/problems/majority-element/description/) gives an array and asks for the value that appears more than half the time, more than `n / 2` times in an array of size `n`. The problem guarantees one always exists, so there's no case to handle where nothing qualifies.

The frequency map here is the plainest version of the pattern so far, count how many times each value appears, same as every problem in this section. What's worth noticing is what the threshold itself guarantees. Since more than half the array can only ever belong to one value, at most one value can ever cross that line, there is no risk of two different values both racing past `n / 2`.

That guarantee means the count doesn't need to finish before it gets used. Update a value's count on every element, and the instant one crosses the threshold, return it immediately, no second pass over the map needed to go find the winner afterward, and no need to keep counting the rest of the array once the answer is already known.

```javascript
{{#include ./examples/majority-element.js}}
```

[Determine if Two Strings Are Close](https://leetcode.com/problems/determine-if-two-strings-are-close/description/) is the first Medium in this bucket, the three problems above are all Easy. Two strings are "close" if the letters and their counts can be reshuffled among each other to turn one string into the other, nothing added, nothing removed, just handed out differently. Take `word1 = "cabbba"` and `word2 = "abbccc"`. `word1` has counts `a: 2, b: 3, c: 1`. `word2` has counts `a: 1, b: 2, c: 3`. The counts attached to each letter differ, but both strings use the same three letters, `a`, `b`, `c`, and both use the same three counts, `1`, `2`, `3`, just assigned to different letters. That is exactly what makes these two close.

Both operations only rearrange things among characters that already exist in the string, neither one can introduce a new character, remove one, or change how many letters the string has in total. That last part gives a free check before doing anything else, two strings of different lengths can never be close, no reshuffling changes a string's length, so a length mismatch rules out the pair immediately.

Past that, the rest splits into two separate frequency checks rather than one.

First, the same set of characters has to be present in both strings. Swapping counts or swapping identities never adds or removes a character, it only moves things around among what's already there, so if one string uses a character the other doesn't, no sequence of operations closes that gap.

Second, given matching character sets, the swap-the-counts operation means any character's count can end up attached to any other character. So checking count against count for the same character, `a` in word1 against `a` in word2, is checking the wrong thing, since which character holds which count can move freely. What has to match is the multiset of counts overall, and rather than sorting both lists of counts to compare them, we can count how many characters share each count value, on both sides, and compare those two counts directly, a frequency map built on top of a frequency map. Word1's counts were `a: 2, b: 3, c: 1`, so its count-of-counts is `1: 1, 2: 1, 3: 1`, one character has each of the counts 1, 2, and 3. Word2's counts were `a: 1, b: 2, c: 3`, count-of-counts `1: 1, 2: 1, 3: 1`, the same. That match is what confirms the two strings are close, without sorting either list.

```javascript
{{#include ./examples/determine-if-two-strings-are-close.js}}
```

[Minimum Number of Operations to Make Array Empty](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-empty/description/) is the second Medium in this bucket. One operation removes two or three copies of the same value from the array, and the question is the fewest operations needed to remove everything, or `-1` if it can't be fully emptied.

An operation only ever targets copies of one value, so the only thing that matters for any value is how many copies of it exist, not where they sit in the array. That's the frequency map again, and once it's built, the problem splits into one independent question per value: given a count `c`, what's the fewest groups of 2 or 3 that sum to exactly `c`, and is that even possible.

`c = 1` is the only count with no answer, no combination of 2s and 3s ever sums to 1. Every other count can be cleared, and the fewest operations comes from using as many 3s as possible. Split by `c mod 3`. `c = 3n` needs `n` groups of 3. `c = 3n + 2` needs `n` groups of 3 plus one group of 2 for what's left over. `c = 3n + 1` is the one that needs care, a leftover of 1 isn't removable on its own, so one group of 3 gets traded back, `n - 1` groups of 3, and the `3 + 1 = 4` left over becomes two groups of 2, `(n - 1) + 2` operations. Take `c = 10`, `n = 3`, remainder 1, so it's `2` groups of 3 and `2` groups of 2, `3 + 3 + 2 + 2 = 10`, four operations.

Every one of those three cases lands on `n` or `n + 1` operations, which is exactly `Math.ceil(c / 3)`. So the full solution is: build the frequency map, and for every count in it, return `-1` immediately if any count is `1`, otherwise sum `Math.ceil(count / 3)` across all of them.

```javascript
{{#include ./examples/minimum-operations-to-make-array-empty.js}}
```

## Pairing

[Two Sum](https://leetcode.com/problems/two-sum/description/) gives an array and a target, and asks for the indices of the two numbers that add up to it. Exactly one valid pair exists in the input, and a number can't be paired with itself.

The brute force is a nested loop, for each number, check every other number to see if the two add up to the target. That works, but not for an interview, because for every element it re-scans the rest of the array looking for one specific value, the number that would complete the sum. That specific value isn't a mystery though, if the target is `9` and the current number is `4`, the number we need is exactly `5`, `target - 4`. We already know what we're looking for before we look, which means the search itself is the wasted step, not the arithmetic.

If we know exactly what value would complete the pair, the only question left is whether that value showed up earlier in the array, which is a lookup, not a search, once we've been recording values as we go. So walk the array once, and at each number, first check whether its complement, `target - nums[i]`, is already in a map of values we've seen. If it is, those two indices are the answer. If it isn't, record the current value and move on.

The order of that check matters. Looking up the complement has to happen before the current value gets added to the map, otherwise a number could pair with itself, the map would already contain the very value we're standing on. Checking first, inserting second, is what keeps every match built from two genuinely different positions in the array.

This is Pairing, not Seen Before, even though the map calls involved, `has` then `set`, are identical to Contains Duplicate's. The difference is what gets looked up. Seen Before checks the current value against the map, asking whether this exact value showed up before. Two Sum never looks up the current value at all, it looks up `target - nums[i]`, a value computed from the current one, asking whether something else exists that would complete it. That's also why the self-pairing rule only shows up here, "does something else complete this" explicitly rules out a number completing itself, while "have I seen this" has no such restriction.

```javascript
{{#include ./examples/two-sum.js}}
```

[Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/description/) gives an array and an integer `k`, and asks for the number of contiguous subarrays whose elements sum to exactly `k`. The brute force checks every possible subarray directly, re-summing overlapping ranges over and over, O(n^2) at best.

Take `nums = [3, 4, -7, 1, 3, 3, 1, -4]` and `k = 7`. Walk the array keeping a running total, the sum of everything seen so far, and write it down at every step, including a `0` before the array even starts.

```
index:         -    0    1    2    3    4    5    6    7
element:            3    4   -7    1    3    3    1   -4
running total: 0    3    7    0    1    4    7    8    4
```

The sum of any subarray that ends at some position and starts right after an earlier position is just the running total at the end minus the running total at that earlier point. Call the ending running total `y` and an earlier one `x`, the subarray between them sums to `y - x`. We want that to equal `k`, so `y - x = k`, which rearranges to `x = y - k`. At every step, the earlier running total that would complete a subarray summing to `k` is exactly `y - k`.

Two things show up walking this example that a simpler one would hide. First, at index 1 the running total is `7`, `y - k = 7 - 7 = 0`, and `0` occurred once already, before the array started, which is the subarray `[3, 4]` summing to `7`, one match. Second, at index 5 the running total is again `7`, `y - k = 0` again, but by now `0` has occurred twice, once at the start and once at index 2, so this single step contributes two matches at once, the subarrays `[3, 4, -7, 1, 3, 3]` and `[1, 3, 3]`, both ending at index 5 and both summing to `7`. That second case is exactly why the map has to store how many times each running total occurred, not just whether it occurred, a plain seen-before check would only ever report one match here, not two.

That's the same pairing shape as Two Sum, checking whether something earlier completes the current value to a target, except the value being paired is a running prefix sum, not a raw array element, and the relationship is subtraction instead of addition. It also has to answer a different question than Two Sum, how many subarrays sum to `k`, not just whether one does. So the map holds how many times each prefix sum has occurred, not just whether it has, and instead of returning on the first match, we add that count to a running total and keep going.

One more detail, seed the map with `{0: 1}` before the loop starts. Without it, a subarray that sums to `k` starting right at index 0 has no earlier prefix sum to pair against, since there's nothing before index 0. Seeding a prefix sum of `0` occurring once covers that case, "the sum of nothing before the array starts" is a valid starting point for a subarray.

```javascript
{{#include ./examples/subarray-sum-equals-k.js}}
```

## Grouping

[Group Anagrams](https://leetcode.com/problems/group-anagrams/description/) gives an array of strings and asks to group every string together with the other strings that are anagrams of it. Take `["eat", "tea", "tan", "ate", "nat", "bat"]`, the answer groups `"eat"`, `"tea"`, `"ate"` together, `"tan"`, `"nat"` together, and leaves `"bat"` on its own.

The brute force compares every string against every other string to check if the two are anagrams, which is a pairwise check repeated over every pair, well past the point of being O(n) in the number of strings.

Two strings are anagrams exactly when they hold the same letters the same number of times each, so instead of comparing strings to each other, we can compute something from each string on its own that comes out identical for every member of the same group. Count the occurrences of each letter in a string, `"eat"` has one `a`, one `e`, one `t`. `"tea"` has the exact same counts, one `a`, one `e`, one `t`. `"tan"` has one `a`, one `n`, one `t`, a different set of counts entirely.

That per-letter count is what becomes the map key. Since strings only ever contain lowercase English letters, build a list of 26 numbers for each string, one slot per letter of the alphabet, each slot counting how many times that letter shows up. For `"eat"` and `"tea"`, that list comes out identical, a `1` in the `a` slot, a `1` in the `e` slot, a `1` in the `t` slot, `0` everywhere else, which as an actual joined string is `"1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0"`. For `"tan"`, the list is different, `1`s in the `a`, `n`, and `t` slots, and a `0` in the `e` slot where `"eat"` had a `1`, joining to `"1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0"`, a different string entirely.

A list of numbers can't be used as a map key directly, JavaScript doesn't treat two separate arrays with matching contents as equal. So the list gets turned into a single string first, joining its 26 numbers together with commas. Two strings with matching letter counts now produce that exact same joined string, and that string is the key.

Walking the example: `"eat"` computes its key, the map has nothing under it yet, so a new bucket is created holding `["eat"]`. `"tea"` computes the exact same key, since it has the same letters, finds that bucket already there, and gets appended, `["eat", "tea"]`. `"tan"` computes a different key entirely, gets its own new bucket, `["tan"]`. By the end, every bucket in the map is one finished group, built without ever comparing any string directly to another, only comparing each string's own computed key against the map.

Computing the key this way costs O(k) per string of length k, one pass to build the count array. Sorting the string's characters would also produce a valid key, `"eat"` and `"tea"` both sort to `"aet"`, but sorting costs O(k log k), so the count array gets to the same answer without paying for a sort.

```javascript
{{#include ./examples/group-anagrams.js}}
```

[Valid Sudoku](https://leetcode.com/problems/valid-sudoku/description/) gives a 9x9 board, partially filled in, and asks whether the filled cells break any Sudoku rule, no repeated digit in the same row, column, or 3x3 box. Only the filled cells need checking, an empty cell contributes nothing to the check, and the board doesn't need to be solvable or complete, just not already broken by what's there. This is a different problem from Sudoku Solver, which fills in the empty cells by search, nothing here searches or guesses anything, just pointing out is the sudoku given is valid as of now.

Every number on the board sits at a position, `(i, j)`, and that position resolves outward to three coordinates at once, which row it's in, which column, and which box. Say a `5` sits at `(2, 3)`. Row and column are handed to us directly, row `2`, column `3`. The box takes a small computation, a 9x9 grid is really a 3x3 grid of boxes, so `Math.floor(2 / 3) = 0` gives the box-row, `Math.floor(3 / 3) = 1` gives the box-column, and flattening that pair into a single index the way any 2D grid flattens into 1D gives `0 * 3 + 1 = 1`. So `(2, 3)` resolves to row `2`, column `3`, box `1`.

That mapping also runs in reverse, and the reverse direction is the part that actually does the work. Once `(2, 3)` resolves to row `2`, column `3`, box `1`, the meaning of that `5` being there is that row `2` now contains a `5`, column `3` now contains a `5`, and box `1` now contains a `5`. Each of those three facts gets recorded by adding `5` to that group's set, row `2`'s set, column `3`'s set, and box `1`'s set.

That reverse mapping is exactly what makes the duplicate check possible. In total there are 9 rows, 9 columns, and 9 boxes, 27 groups, one set each, 27 sets. Before adding a digit to its three sets, check whether it's already sitting in any of them. If row `2`'s set already contains a `5` when a second `5` shows up in row `2`, the board is invalid right there. If not, add the digit to all three sets and move to the next cell.

```javascript
{{#include ./examples/valid-sudoku.js}}
```

[Group Shifted Strings](https://www.geeksforgeeks.org/dsa/group-shifted-string/1) defines a shift operation, move every letter of a string forward one position in the alphabet, wrapping `z` back to `a`, so `"abc"` shifts to `"bcd"`. Given an array of strings, group together any strings that can reach each other through some number of shifts. Strings of length 1 are all one group together, whatever letter they hold, that part is stated directly in the problem.

Take `["acd", "dfg", "wyz", "yab", "mop", "bdfh", "a", "x", "moqs"]`.

Shifting every letter by the same amount moves the whole string forward, but it never changes the gap between one letter and the next inside that string, only where the letters sit in the alphabet overall. `"acd"` has gaps `2, 1` (`c` is 2 past `a`, `d` is 1 past `c`). `"dfg"` has the exact same gaps, `2, 1`. Both share a key before any shifting logic even needs to run.

Checking the rest of the list against that same `2, 1` key: `"wyz"` gives `2, 1`. `"yab"` gives `2, 1` too, but only once the wraparound is handled, `a` is 2 past `y` going forward cyclically (`y -> z -> a`), and `b` is 1 past `a`. `"mop"` gives `2, 1` as well. All five, `"acd"`, `"dfg"`, `"wyz"`, `"yab"`, `"mop"`, land in the same group.

`"bdfh"` has gaps `2, 2, 2`, and `"moqs"` has gaps `2, 2, 2` too, a different group from the first five, and a different length besides. `"a"` and `"x"` are both length 1, no consecutive pair of letters to take a gap from at all, so both produce an empty gap sequence, the same key, which is exactly why length-1 strings all group together regardless of which letter they are.

```javascript
{{#include ./examples/group-shifted-strings.js}}
```
