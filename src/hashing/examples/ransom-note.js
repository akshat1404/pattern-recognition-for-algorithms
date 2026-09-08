// Ransom Note
// https://leetcode.com/problems/ransom-note/description/
//
// Problem: given a ransom note string and a magazine string, return
// true if the note can be built entirely out of letters from the
// magazine, using each letter in the magazine at most once.
//
// Count the letters available in the magazine, then walk the note
// spending from those counts. Unlike Valid Anagram, the magazine is
// allowed to have leftover letters, so we never check that anything
// hits exactly zero, only that we never spend a letter that isn't
// there to spend.

function canConstruct(ransomNote, magazine) {
    const available = new Map();
    for (const ch of magazine) {
        available.set(ch, (available.get(ch) || 0) + 1);
    }

    for (const ch of ransomNote) {
        const remaining = available.get(ch) || 0;

        // Nothing left of this letter to spend.
        if (remaining === 0) return false;

        available.set(ch, remaining - 1);
    }

    return true;
}

module.exports = { canConstruct };
