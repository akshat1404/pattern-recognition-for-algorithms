// Brick Wall
// https://leetcode.com/problems/brick-wall/description/
//
// Problem: each row of the wall lists brick widths, and every row has the
// same total width. Draw a vertical line, not along the outer edges, that
// crosses the fewest bricks, and return that number.
//
// A row's edges sit at the running sums of its widths. Count how many rows
// have an edge at each position, leaving out the right edge. The line goes
// where the count is highest, and crosses every other row.

function leastBricks(wall) {
    const edges = new Map();
    let most = 0;

    for (const row of wall) {
        let position = 0;

        // The last brick ends at the wall's right edge, which is not allowed.
        for (let i = 0; i < row.length - 1; i++) {
            position += row[i];
            const count = (edges.get(position) || 0) + 1;
            edges.set(position, count);
            most = Math.max(most, count);
        }
    }

    return wall.length - most;
}

module.exports = { leastBricks };
