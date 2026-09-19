// Longest Repeating Character Replacement
// https://leetcode.com/problems/longest-repeating-character-replacement/description/
//
// Problem: given a string of uppercase letters and an integer k,
// you may replace up to k characters with any other letter. Return
// the length of the longest substring that can be made all one
// letter this way.
//
// "Longest" is the max ask, "substring" is the contiguous range.
// The condition that moves left isn't stated, it has to be derived.
// A window can be made all one letter if the characters that aren't
// its most frequent letter number at most k, those are the ones
// that get replaced. So the window is valid while
// windowSize - countOfMostFrequentLetter <= k.
//
// The tracked value is a frequency map of the letters currently in
// the window, incremented as right grows, decremented as left shrinks.

function characterReplacement(s, k) {
    const counts = new Map();
    let left = 0;
    let best = 0;

    for (let right = 0; right < s.length; right++) {
        counts.set(s[right], (counts.get(s[right]) || 0) + 1);

        // Recompute the most frequent letter's count from the map
        // each time. At most 26 entries, so this stays cheap.
        while (right - left + 1 - Math.max(...counts.values()) > k) {
            counts.set(s[left], counts.get(s[left]) - 1);
            left++;
        }

        best = Math.max(best, right - left + 1);
    }

    return best;
}

module.exports = { characterReplacement };
