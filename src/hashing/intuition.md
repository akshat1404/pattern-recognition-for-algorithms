# Intuition

## Thinking about it in terms of memory

Underneath, a hash map is still an array. The map keeps a plain array in memory, and a hash function converts each key into an index into that array. Writing `map[key] = value` really means: compute `hash(key)`, land on a slot in the underlying array, store the value there. Reading `map[key]` runs the same computation and jumps straight to that slot.

That jump is the whole trick. There is no scanning. Whether the map holds ten entries or ten million, computing `hash(key)` and landing on a slot costs the same. That is where the O(1) average lookup comes from, it is one array access after one computation, not a search through the array.

A hash map trades the searching step for a computing step. Without one, checking "have I seen this value" means walking every element already visited, a search whose cost grows with how much we have stored. With one, checking the same thing means running the value through `hash()` and looking at one slot, a cost that stays flat no matter how much we have stored. The map does not get faster at searching, it removes the need to search at all.

This is the thing to internalize before looking at any specific problem. Every hashing problem is a disguised version of "I need to search for something, repeatedly, as I go." The hash map is what turns that repeated search into a repeated computation instead.

## When to reach for a hash map

The recognition test is not about the data structure, it is about the question being asked of the data. Read the problem and check which of these it is really asking.

Membership: "does this value exist elsewhere in the collection." Store values as keys in a set, check `has()` instead of scanning. Contains Duplicate is this exact question.

Frequency: "how many times does this value occur." Store value as key, count as value, incrementing on each pass.

Pairing: "does some other element combine with this one to hit a target." Build the map while scanning, check the current element against it before inserting the current element in.

Grouping: "which elements share some computed property." Compute a key per element, collect elements into a bucket under that key.

Whenever a problem's brute force reads as "for each element, scan the rest to check something," that "something" is the candidate for going into a map first.
