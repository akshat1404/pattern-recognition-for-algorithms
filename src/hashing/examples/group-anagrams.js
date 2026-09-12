// Group Anagrams
// https://leetcode.com/problems/group-anagrams/description/
//
// Problem: given an array of strings, group the anagrams together.
// Strings consist of lowercase English letters.
//
// Two strings are anagrams exactly when they have the same letters,
// the same number of times each, so a per-letter count is a key
// that's identical for every string in the same group. Compute that
// key once per string, an O(k) pass over its letters, and bucket by
// it, rather than comparing strings to each other pairwise.

function groupAnagrams(strs) {
    const groups = new Map();

    for (const s of strs) {
        const counts = new Array(26).fill(0);
        for (const ch of s) {
            counts[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
        }

        // Two anagrams produce the exact same 26-count array, so
        // joining it into a string gives a key that's identical for
        // every member of the same group.
        const key = counts.join(",");

        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(s);
    }

    return [...groups.values()];
}

module.exports = { groupAnagrams };
