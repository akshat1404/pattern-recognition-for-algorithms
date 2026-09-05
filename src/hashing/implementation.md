# Implementation

## Walkthrough: Contains Duplicate

Take [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/description/). Given an array, tell us whether any value appears more than once.

```
nums = [1, 2, 3, 1]
```

The brute force way is to take each element and loop through the rest of the array checking for a match. That is a loop inside a loop, O(n^2), because every element pays for a full scan of the others.

The hash map way avoids the second loop entirely. We walk the array once, and before moving to the next element, we ask the map one question: have I put this value in before? If yes, we have found our duplicate. If no, we mark it as seen and move on.

```
map = {}

nums = [1, 2, 3, 1]

step 1: value = 1, not in map -> mark it
map = { 1: true }

step 2: value = 2, not in map -> mark it
map = { 1: true, 2: true }

step 3: value = 3, not in map -> mark it
map = { 1: true, 2: true, 3: true }

step 4: value = 1, already in map -> duplicate found
```

Each step does two O(1) operations against the map, a membership check and, if needed, an insert. One pass over the array, O(n) total time. The cost we pay for skipping the second loop is space, the map can grow up to the size of the array if every element turns out to be unique. That is the trade hashing makes throughout this whole pattern: spend memory holding "have I seen this" state, so we never have to re-scan for it.

```javascript
function containsDuplicate(nums) {
    const seen = new Map();
    for (const n of nums) {
        if (seen.has(n)) return true;
        seen.set(n, true);
    }
    return false;
}
```
