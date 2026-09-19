// Longest Substring Without Repeating Characters
// https://leetcode.com/problems/longest-substring-without-repeating-characters/description/
//
// Problem: given a string, return the length of the longest
// substring that contains no repeated character.
//
// "Longest" is the max ask, "substring" is the contiguous range,
// "without repeating" is the condition that moves left forward.
// The tracked value is a set of the characters currently inside
// the window, added to as right grows, removed from as left shrinks.

function lengthOfLongestSubstring(s) {
    const inWindow = new Set();
    let left = 0;
    let best = 0;

    for (let right = 0; right < s.length; right++) {
        // A Set can't hold a duplicate, so the check has to happen
        // before adding, not after. If the character entering is
        // already inside the window, shrink from the left until it
        // isn't.
        while (inWindow.has(s[right])) {
            inWindow.delete(s[left]);
            left++;
        }

        inWindow.add(s[right]);
        best = Math.max(best, right - left + 1);
    }

    return best;
}

module.exports = { lengthOfLongestSubstring };
