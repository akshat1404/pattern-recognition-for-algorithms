// Permutation in String
// https://leetcode.com/problems/permutation-in-string/description/
//
// Problem: given two strings of lowercase letters, s1 and s2,
// return true if s2 contains a permutation of s1 as a contiguous
// substring.
//
// A permutation of s1 is an anagram of s1, same letters, same
// counts. That's the Valid Anagram question from the Hashing
// chapter, asked of every window of s2 that is exactly s1's length.
// Sliding window supplies the other half, sliding forward changes
// only two letters, so the counts adjust in constant time instead
// of being rebuilt for every window.
//
// Instead of comparing the two count arrays in full every step,
// keep a counter, matches, of how many of the 26 letters currently
// have equal counts in both. The window is a permutation exactly
// when matches reaches 26.

function checkInclusion(s1, s2) {
    const k = s1.length;
    if (k > s2.length) return false;

    const index = (ch) => ch.charCodeAt(0) - "a".charCodeAt(0);
    const need = new Array(26).fill(0);
    const window = new Array(26).fill(0);

    for (let i = 0; i < k; i++) {
        need[index(s1[i])]++;
        window[index(s2[i])]++;
    }

    let matches = 0;
    for (let i = 0; i < 26; i++) {
        if (need[i] === window[i]) matches++;
    }
    if (matches === 26) return true;

    for (let right = k; right < s2.length; right++) {
        const entering = index(s2[right]);
        const leaving = index(s2[right - k]);

        // Update matches after each change, a letter becomes matched
        // when its count reaches the need, and stops being matched
        // when it moves one past the need.
        window[entering]++;
        if (window[entering] === need[entering]) matches++;
        else if (window[entering] === need[entering] + 1) matches--;

        window[leaving]--;
        if (window[leaving] === need[leaving]) matches++;
        else if (window[leaving] === need[leaving] - 1) matches--;

        if (matches === 26) return true;
    }

    return false;
}

module.exports = { checkInclusion };
