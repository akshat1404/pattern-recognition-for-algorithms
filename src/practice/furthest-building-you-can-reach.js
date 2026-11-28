// Furthest Building You Can Reach
// https://leetcode.com/problems/furthest-building-you-can-reach/description/
//
// Problem: walk from building 0 to the right. A climb up needs one ladder or
// as many bricks as the height difference. Return the furthest index reached.
//
// Ladders should cover the largest climbs. Keep the climbs on ladders in a
// min-heap of size ladders. When a new climb makes it too big, the smallest
// climb in it switches to bricks. Running out of bricks is where the walk ends.

const { Heap } = require('../heap/examples/heap');

function furthestBuilding(heights, bricks, ladders) {
    // The climbs currently on ladders, smallest on top.
    const ladderClimbs = new Heap((a, b) => a - b);

    for (let i = 0; i < heights.length - 1; i++) {
        const climb = heights[i + 1] - heights[i];
        if (climb <= 0) continue;

        ladderClimbs.push(climb);

        // One climb more than there are ladders: the smallest pays with bricks.
        if (ladderClimbs.size() > ladders) {
            bricks -= ladderClimbs.pop();
            if (bricks < 0) return i;
        }
    }

    return heights.length - 1;
}

module.exports = { furthestBuilding };
