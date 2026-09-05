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

## Hash maps in JavaScript

JavaScript gives us three structures that are really this same key-value idea, just shaped for different needs.

`Object` is the plain version, keys are coerced to strings, and it is what most people reach for first without thinking of it as a hash map.

`Map` is the general-purpose version, any value can be a key, insertion order is preserved, and it has a proper `.has()`, `.get()`, `.set()` interface. Use it whenever we need both a key and a value attached to it, like the frequency counts earlier in this chapter.

`Set` is a hash map with the value dropped, it only stores keys and answers one question, `.has(key)`. Use it whenever the value we would store is meaningless and all we care about is whether the key exists at all, which is exactly the "Seen Before" bucket.
