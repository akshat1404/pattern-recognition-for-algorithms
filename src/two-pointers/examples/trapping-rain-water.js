// Trapping Rain Water
// https://leetcode.com/problems/trapping-rain-water/description/
//
// Problem: given an array of wall heights, return the total amount
// of water trapped between the walls after it rains.
//
// Water trapped at any index i is min(maxLeftOf(i), maxRightOf(i))
// minus height[i], the shorter of the two boundary walls decides
// the water level, same idea as Container With Most Water, just
// asked at every index instead of once between two chosen walls.
//
// Alongside left and right, track a running maxLeft and maxRight,
// the tallest wall seen so far from each side. Those only ever grow
// and never need correcting, which is what keeps this within the
// two-pointer pattern rather than needing two full extra passes.

function trap(heights) {
    let left = 0;
    let right = heights.length - 1;
    let maxLeft = 0;
    let maxRight = 0;
    let water = 0;

    while (left < right) {
        if (heights[left] < heights[right]) {
            // heights[right] is somewhere to the right of left, so
            // it's proof on its own that maxRightOf(left) is at
            // least heights[right], which is already more than
            // heights[left]. maxLeft is known exactly, so it alone
            // decides the water level here, no need to know the
            // real maxRightOf(left).
            if (heights[left] >= maxLeft) {
                maxLeft = heights[left];
            } else {
                water += maxLeft - heights[left];
            }
            left++;
        } else {
            // Same argument mirrored, heights[left] proves
            // maxLeftOf(right) is at least heights[left], already
            // more than heights[right], so maxRight alone decides.
            if (heights[right] >= maxRight) {
                maxRight = heights[right];
            } else {
                water += maxRight - heights[right];
            }
            right--;
        }
    }

    return water;
}

module.exports = { trap };
