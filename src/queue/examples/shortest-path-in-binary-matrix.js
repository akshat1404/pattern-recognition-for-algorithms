// Shortest Path in Binary Matrix
// https://leetcode.com/problems/shortest-path-in-binary-matrix/description/
//
// Problem: in an n x n grid of 0s and 1s, find the shortest path from the
// top-left cell to the bottom-right cell that only uses 0 cells, moving
// to any of the 8 neighbors. The length counts the cells on the path.
// Return -1 if there is no path.
//
// Spread outward from the start one step at a time. The first time the
// bottom-right cell is taken from the queue, it was reached by a shortest
// path. A reached cell is set to 1, so it is treated as a wall and never
// joins the queue twice.

function shortestPathBinaryMatrix(grid) {
    const n = grid.length;
    if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return -1;

    // How far one move shifts the row and the column, for all 8 neighbors.
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
    ];

    // Each entry is [row, col, cells on the path so far].
    const queue = [[0, 0, 1]];
    grid[0][0] = 1;
    let head = 0;

    while (head < queue.length) {
        const [row, col, length] = queue[head];
        head++;

        if (row === n - 1 && col === n - 1) return length;

        for (const [rowStep, colStep] of directions) {
            const nextRow = row + rowStep;
            const nextCol = col + colStep;

            // Outside the grid.
            if (nextRow < 0 || nextRow >= n || nextCol < 0 || nextCol >= n) continue;
            // A wall, or a cell already reached.
            if (grid[nextRow][nextCol] === 1) continue;

            grid[nextRow][nextCol] = 1;
            queue.push([nextRow, nextCol, length + 1]);
        }
    }

    return -1;
}

module.exports = { shortestPathBinaryMatrix };
