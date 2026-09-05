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
