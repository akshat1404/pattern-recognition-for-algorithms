// 01 Matrix
// https://leetcode.com/problems/01-matrix/description/
//
// Problem: given a grid of 0s and 1s, return a grid where each cell holds
// the distance to the nearest 0, moving up, down, left, or right.
//
// Spread outward from every 0 at once. A queue handles cells in the order
// they were reached, so all cells at distance d are handled before any at
// distance d + 1, and the first time a cell is reached is its distance.

function updateMatrix(mat) {
    const rows = mat.length;
    const cols = mat[0].length;
    const dist = Array.from({ length: rows }, () => new Array(cols).fill(-1));
    const queue = [];
    let head = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (mat[row][col] === 0) {
                dist[row][col] = 0;
                queue.push([row, col]);
            }
        }
    }

    const steps = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    while (head < queue.length) {
        const [row, col] = queue[head];
        head++;

        for (const [rowStep, colStep] of steps) {
            const nextRow = row + rowStep;
            const nextCol = col + colStep;
            if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
            if (dist[nextRow][nextCol] !== -1) continue;

            dist[nextRow][nextCol] = dist[row][col] + 1;
            queue.push([nextRow, nextCol]);
        }
    }

    return dist;
}

module.exports = { updateMatrix };
