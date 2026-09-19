# Sliding Window

## What a sliding window actually is

A sliding window is a contiguous range of an array or string, tracked by two indices, `left` and `right`, that moves forward one step at a time while a running value summarizes whatever currently sits inside it.

Say we have `[2, 1, 5, 1, 3, 2]` and we care about every group of three elements next to each other. The first window covers indices `0` to `2`, `[2, 1, 5]`, sum `8`. Sliding forward one step, `2` leaves from the left and `1` enters from the right, `[1, 5, 1]`, sum `7`. Then `[5, 1, 3]`, sum `9`. Then `[1, 3, 2]`, sum `6`.

Each step changes exactly two elements, one leaves, one enters. The sum never needs to be recomputed from scratch, only adjusted by the difference between the two.

## Sliding window in JavaScript

There's no special type for this, the way hashing has `Map` and `Set`. A sliding window is two index numbers and a variable holding whatever's being tracked.

```javascript
let left = 0;
let right = 0;
let windowSum = 0;
```

What the tracked value looks like depends on the problem, a plain number for a sum, a `Set` for distinct characters, a `Map` for character counts. The pattern lives in how `left` and `right` move relative to each other and how that tracked value gets updated as they do, not in any structure holding them.
