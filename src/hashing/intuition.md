# Intuition

## How to know a hash map might help

I am going to throw out some hints for spotting when a map is the right move, though they won't fully make sense until worked examples show them in action.

1. Seen Before: have I run into this value already?
2. Frequency: how many times has this value shown up?
3. Pairing: is there another value out there that completes this one?
4. Grouping: which values belong together?

Whenever a problem's brute force reads as "for each element, scan the rest to check something," that "something" is the candidate for going into a map first.

## Thinking about it in terms of memory

Underneath, a hash map is still an array. The map keeps a plain array in memory, and a hash function converts each key into an index into that array. Writing `map[key] = value` really means: compute `hash(key)`, land on a slot in the underlying array, store the value there. Reading `map[key]` runs the same computation and jumps straight to that slot.

That jump is the whole trick. There is no scanning. Whether the map holds ten entries or ten million, computing `hash(key)` and landing on a slot costs the same. That is where the O(1) average lookup comes from, it is one array access after one computation, not a search through the array.

A hash map trades the searching step for a computing step. Without one, checking "have I seen this value" means walking every element already visited, a search whose cost grows with how much we have stored. With one, checking the same thing means running the value through `hash()` and looking at one slot, a cost that stays flat no matter how much we have stored. The map does not get faster at searching, it removes the need to search at all.

This is the thing to internalize before looking at any specific problem. Every hashing problem is a disguised version of "I need to search for something, repeatedly, as I go." The hash map is what turns that repeated search into a repeated computation instead.

Each of these four questions gets a full worked problem in the Examples chapter that follows, reasoning and code together. The next chapter, Asking the Right Questions, covers how to tell hashing apart from a neighboring pattern when a problem could plausibly go either way.
