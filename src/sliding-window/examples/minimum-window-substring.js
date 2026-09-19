// Minimum Window Substring
// https://leetcode.com/problems/minimum-window-substring/description/
//
// Problem: given strings s and t, return the shortest substring of
// s that contains every character of t, duplicates included, or an
// empty string if no such substring exists.
//
// "Minimum" is the min ask, "substring" is the contiguous range.
// The condition that moves left is the window containing everything
// t needs. Two frequency maps are involved, what t requires (built
// once) and what the window currently holds (adjusted as right grows
// and left shrinks).
//
// Comparing the two maps in full after every move would cost a scan
// each time. Instead, keep a single counter, formed, of how many
// distinct required characters currently have enough copies in the
// window, and only touch it when a character's count crosses its
// required amount. Validity then becomes one comparison.

function minWindow(s, t) {
    if (t.length > s.length) return "";

    const need = new Map();
    for (const ch of t) {
        need.set(ch, (need.get(ch) || 0) + 1);
    }
    const required = need.size;

    const window = new Map();
    let formed = 0;
    let left = 0;
    let bestLength = Infinity;
    let bestStart = 0;

    for (let right = 0; right < s.length; right++) {
        const entering = s[right];
        window.set(entering, (window.get(entering) || 0) + 1);

        // Only the exact moment the count reaches the required
        // amount counts. Extra copies beyond that change nothing.
        if (need.has(entering) && window.get(entering) === need.get(entering)) {
            formed++;
        }

        while (formed === required) {
            if (right - left + 1 < bestLength) {
                bestLength = right - left + 1;
                bestStart = left;
            }

            const leaving = s[left];
            window.set(leaving, window.get(leaving) - 1);

            // Only dropping below the required amount breaks it.
            if (need.has(leaving) && window.get(leaving) < need.get(leaving)) {
                formed--;
            }
            left++;
        }
    }

    return bestLength === Infinity ? "" : s.substring(bestStart, bestStart + bestLength);
}

module.exports = { minWindow };
