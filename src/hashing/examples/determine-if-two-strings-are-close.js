// Determine if Two Strings Are Close
// https://leetcode.com/problems/determine-if-two-strings-are-close/description/
//
// Problem: two strings are "close" if one can be turned into the
// other using any number of two operations, swap the counts of two
// existing characters, or swap the identity of two existing
// characters. Determine whether two given strings are close.
//
// Both operations only rearrange things among characters already
// present, they never introduce a new character or change how many
// distinct characters exist. So being close comes down to two
// separate frequency checks: the same set of characters has to be
// present in both strings, and the same multiset of counts has to
// be achievable, regardless of which character originally held
// which count.

function buildFrequencyMap(items) {
    const counts = new Map();
    for (const item of items) {
        counts.set(item, (counts.get(item) || 0) + 1);
    }
    return counts;
}

function mapsMatch(mapA, mapB) {
    if (mapA.size !== mapB.size) return false;
    for (const [key, value] of mapA) {
        if (mapB.get(key) !== value) return false;
    }
    return true;
}

function closeStrings(word1, word2) {
    // Reshuffling counts among existing characters can never change
    // how many letters a string has, so mismatched lengths can be
    // ruled out before building anything.
    if (word1.length !== word2.length) return false;

    const counts1 = buildFrequencyMap(word1);
    const counts2 = buildFrequencyMap(word2);

    // Same characters present, regardless of which count belongs
    // to which one, character identity itself can be swapped.
    for (const ch of counts1.keys()) {
        if (!counts2.has(ch)) return false;
    }
    if (counts1.size !== counts2.size) return false;

    // Same counts available, regardless of which character
    // originally held which count. Instead of sorting both lists of
    // counts and comparing them pairwise, count how many characters
    // share each count value, on both sides, and compare those two
    // frequency-of-frequency maps directly.
    const countOfCounts1 = buildFrequencyMap(counts1.values());
    const countOfCounts2 = buildFrequencyMap(counts2.values());

    return mapsMatch(countOfCounts1, countOfCounts2);
}

module.exports = { closeStrings };
