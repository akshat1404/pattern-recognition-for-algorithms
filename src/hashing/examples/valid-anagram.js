// Valid Anagram
// https://leetcode.com/problems/valid-anagram/description/
//
// Problem: given two strings s and t, return true if t is an
// anagram of s, meaning t uses exactly the same letters as s,
// the same number of times each, just possibly in a different order.
//
// This is a frequency question: does every letter show up the same
// number of times in both strings. Count the letters of s, then walk
// t subtracting from those counts. If everything cancels out exactly,
// the two strings had matching letter counts all along.

function isAnagram(s, t) {
    // Different lengths can never be anagrams, and checking this
    // first means the counting below never has to handle it.
    if (s.length !== t.length) return false;

    const counts = new Map();
    for (const ch of s) {
        counts.set(ch, (counts.get(ch) || 0) + 1);
    }

    for (const ch of t) {
        // t contains a letter s never had at all.
        if (!counts.has(ch)) return false;

        const remaining = counts.get(ch) - 1;
        if (remaining === 0) {
            // This letter's count from s is now fully used up by t.
            counts.delete(ch);
        } else {
            counts.set(ch, remaining);
        }
    }

    // If every letter cancelled out exactly, nothing is left.
    return counts.size === 0;
}

module.exports = { isAnagram };
