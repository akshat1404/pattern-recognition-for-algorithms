// Find the Winner of the Circular Game
// https://leetcode.com/problems/find-the-winner-of-the-circular-game/description/
//
// Problem: n friends sit in a circle, numbered 1 to n. Starting at friend
// 1, count k friends clockwise, including the starting one. The last one
// counted leaves, and counting starts again from the next friend. Return
// the last friend left.
//
// Read the circle as a queue. Counting past a friend moves them from the
// front to the back. After k - 1 moves, the friend at the front is the
// kth counted, and leaves.

function findTheWinner(n, k) {
    const queue = [];
    for (let i = 1; i <= n; i++) queue.push(i);
    let head = 0;

    while (queue.length - head > 1) {
        for (let i = 0; i < k - 1; i++) {
            queue.push(queue[head]);
            head++;
        }
        head++; // the kth friend leaves
    }

    return queue[head];
}

// Without a structure: the Josephus recurrence. With friends numbered from
// 0, one friend wins at position 0, and adding a friend shifts the
// winner's position by k.
function findTheWinnerByFormula(n, k) {
    let winner = 0;
    for (let m = 2; m <= n; m++) {
        winner = (winner + k) % m;
    }
    return winner + 1;
}

module.exports = { findTheWinner, findTheWinnerByFormula };
