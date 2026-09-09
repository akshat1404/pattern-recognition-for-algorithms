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
