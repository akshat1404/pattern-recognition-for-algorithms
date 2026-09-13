# Two Pointers

## What two pointers actually is

Two pointers is two index variables walking through the same array or string at once, instead of one. Each one tracks its own position, moves according to its own rule, and the two positions get compared or combined to decide what happens next.

Say we have `[2, 7, 11, 15]` and we want to know if two numbers in it add up to `9`. One pointer, `left`, starts at index `0`. The other, `right`, starts at index `3`. At each step we look at `nums[left] + nums[right]`, and that comparison tells us whether to move `left` forward, move `right` backward, or stop because we found the pair.

Nothing here needs a new data structure. It's the same array, read from two places at once, with two plain variables holding the two positions.

## Two pointers in JavaScript

There's no special type for this the way hashing has `Map` and `Set`. Two pointers is just two numbers.

```javascript
let left = 0;
let right = nums.length - 1;
```

On a linked list, the two "pointers" are two variables holding node references instead of indices, since a linked list has no numeric position to index into.

```javascript
let slow = head;
let fast = head;
```

Either way, the pattern lives entirely in how those two variables move relative to each other, not in any structure holding them.
