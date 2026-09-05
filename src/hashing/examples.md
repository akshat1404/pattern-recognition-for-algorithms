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
