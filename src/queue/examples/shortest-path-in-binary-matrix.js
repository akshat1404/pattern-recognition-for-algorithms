// Shortest Path in Binary Matrix
// https://leetcode.com/problems/shortest-path-in-binary-matrix/description/
//
// Problem: in an n x n grid of 0s and 1s, find the shortest path from the
// top-left cell to the bottom-right cell that only uses 0 cells, moving
// to any of the 8 neighbors. The length counts the cells on the path.
// Return -1 if there is no path.
//
// Spread outward from the start one step at a time. The first time the
// bottom-right cell is reached, it is reached by a shortest path. Cells
// are marked when they join the queue, so none joins twice.

function shortestPathBinaryMatrix(grid) {
    const n = grid.length;
    if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return -1;

    const length = grid.map(row => row.map(() => 0));
    length[0][0] = 1;
    const queue = [[0, 0]];
    let head = 0;

    while (head < queue.length) {
        const [r, c] = queue[head];
        head++;

        if (r === n - 1 && c === n - 1) return length[r][c];

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
                if (grid[nr][nc] === 1 || length[nr][nc] !== 0) continue;

                length[nr][nc] = length[r][c] + 1;
                queue.push([nr, nc]);
            }
        }
    }

    return -1;
}

module.exports = { shortestPathBinaryMatrix };
