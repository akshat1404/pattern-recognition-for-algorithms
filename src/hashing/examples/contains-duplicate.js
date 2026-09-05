// Contains Duplicate
// https://leetcode.com/problems/contains-duplicate/description/
//
// Problem: given an array of integers, return true if any value
// appears at least twice, and false if every element is distinct.
//
// The hint toward a hash map is "appears at least twice" itself,
// that phrase is really asking, for each value: have I run into
// this value already? That is the "Seen Before" intuition, so a
// hash set is the fit, one lookup instead of re-scanning the array.

function containsDuplicate(nums) {
    // A Set, not a Map, because we never need a value attached to
    // the key. All we ever ask is "does this key exist," so a Map
    // here would just be storing a throwaway value like true next
    // to every key. Set is the key-only shape of a hash map.
    const seen = new Set();

    for (const n of nums) {
        // Ask the set first. If it already holds this value,
        // we found our duplicate, no need to look any further.
        if (seen.has(n)) return true;

        // Otherwise this is the first time we've seen n.
        // Record it so future values can check against it.
        seen.add(n);
    }

    // Walked the whole array, every value was new when we reached it.
    return false;
}

module.exports = { containsDuplicate };
