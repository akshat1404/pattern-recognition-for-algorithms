# Hashing

## What a hash map actually is

A hash map is key-value storage. That's it. You give it a key, it gives you back the value stored under that key.

Say we have an array `[2, 4, 2, 5, 4, 4]` and we want to store the frequency of each element. A hash map can hold this as an element-to-frequency store, where the key is the element and the value is how many times it showed up.

```
4 -> 3
5 -> 1
2 -> 2
```

Read or write to any key, and the cost is the same regardless of how many keys are already in the map.
