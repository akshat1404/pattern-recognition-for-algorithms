# Binary Search

## What binary search actually is

At any point, we can look at the middle of the array and decide the answer cannot be on one side of it. That side gets discarded whole, without checking a single element in it, and the search continues only on the side left over.

Say we have the sorted array `[1, 3, 5, 7, 9, 11]` and we're looking for `7`. The middle index is `2`, value `5`. `5` is less than `7`, so `7` cannot be anywhere from index `0` to `2`, that whole half is gone. The search continues on `[7, 9, 11]`. Middle index `4`, value `9`. `9` is greater than `7`, so `7` cannot be at index `4` or after, that half is gone too. One element left, index `3`, value `7`, found.

Each step throws away roughly half of what was still in play, based on one comparison, not one element checked at a time.

## Binary search in JavaScript

No special type here either, just two numbers marking the current range.

```javascript
let low = 0;
let high = nums.length - 1;
```

The pattern lives in how `low` and `high` move toward each other based on what the middle element tells us, one comparison collapsing half the remaining range every time.
