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
    const dist = mat.map(row => row.map(() => -1));
    const queue = [];
    let head = 0;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (mat[r][c] === 0) {
                dist[r][c] = 0;
                queue.push([r, c]);
            }
        }
    }

    const steps = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    while (head < queue.length) {
        const [r, c] = queue[head];
        head++;

        for (const [dr, dc] of steps) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (dist[nr][nc] !== -1) continue;

            dist[nr][nc] = dist[r][c] + 1;
            queue.push([nr, nc]);
        }
    }

    return dist;
}

module.exports = { updateMatrix };
