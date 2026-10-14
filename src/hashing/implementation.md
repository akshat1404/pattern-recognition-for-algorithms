# Implementation

A hash map is key-value storage. Give it a key and it hands back the value stored under that key, and the cost of a read or a write stays the same no matter how many keys it already holds. Once a problem is recognized as one of the four kinds from Asking the Right Questions, the code follows a fixed shape. These are the four skeletons, one per kind, worth knowing from memory rather than re-derived each time.

## Hash maps in JavaScript

JavaScript has three structures that are the same key-value idea, shaped for different needs.

`Object` is the plain version. Keys are coerced to strings, and it is what most people reach for first without thinking of it as a hash map.

`Map` is the general-purpose version. Any value can be a key, insertion order is preserved, and it has a proper `.has()`, `.get()`, `.set()` interface. It is the right choice whenever both a key and a value attached to it are needed, like frequency counts.

`Set` is a hash map with the value dropped. It stores only keys and answers one question, `.has(key)`. It is the right choice whenever the value would be meaningless and all that matters is whether the key exists, which is the Seen Before kind.

## Seen Before

```javascript
function seenBefore(items) {
    const seen = new Set();
    for (const item of items) {
        if (seen.has(item)) return true; // already ran into this one
        seen.add(item);
    }
    return false;
}
```

## Frequency

```javascript
function frequency(items) {
    const counts = new Map();
    for (const item of items) {
        counts.set(item, (counts.get(item) || 0) + 1);
    }
    return counts;
}
```

## Pairing

```javascript
function pairing(nums, target) {
    const seen = new Map(); // value -> index
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) return [seen.get(complement), i];
        seen.set(nums[i], i);
    }
    return [];
}
```

The check happens before the insert, not after. That order matters, it is what stops a value from pairing with itself.

## Grouping

```javascript
function grouping(items, keyFn) {
    const groups = new Map();
    for (const item of items) {
        const key = keyFn(item);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(item);
    }
    return [...groups.values()];
}
```

`keyFn` is whatever computed property decides which bucket an item belongs to, a count of each letter for anagrams, a sequence of letter gaps for shifted strings, a plain number like a loss count, whatever the problem defines as "belongs together."

Not every grouping problem fits one key per item, though. Valid Sudoku checks each item against three keys at once, its row, its column, and its box, which means checking and updating three separate group-sets per item instead of looking up one key in one map:

```javascript
function groupingMultiKey(items, keysFn) {
    const groups = new Map(); // one Set per possible key

    for (const item of items) {
        const keys = keysFn(item); // e.g. [row, col, box] for one cell

        for (const key of keys) {
            if (!groups.has(key)) groups.set(key, new Set());
            if (groups.get(key).has(item)) return false; // already in this group
            groups.get(key).add(item);
        }
    }

    return true;
}
```
