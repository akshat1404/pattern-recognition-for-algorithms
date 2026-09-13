// Container With Most Water
// https://leetcode.com/problems/container-with-most-water/description/
//
// Problem: given an array of heights, each pair of indices forms a
// container with the x-axis, holding water up to the shorter of the
// two heights, over a width equal to the distance between them.
// Return the maximum amount of water any pair can hold.
//
// This array isn't sorted, there's no numeric order to exploit. The
// order being exploited here is positional: width is always
// right - left, known for free from position, no lookup needed. The
// safety argument comes from the values, whichever side is shorter
// caps the area no matter what the other side is, so moving that
// side is the only move that could ever find something better.

function maxArea(heights) {
    let left = 0;
    let right = heights.length - 1;
    let best = 0;

    while (left < right) {
        const width = right - left;
        const area = Math.min(heights[left], heights[right]) * width;
        best = Math.max(best, area);

        // The shorter wall is the one capping the area. Keeping it
        // and shrinking the width can never beat what we already
        // have, so it's the only side worth abandoning.
        if (heights[left] < heights[right]) {
            left++;
        } else {
            right--;
        }
    }

    return best;
}

module.exports = { maxArea };
