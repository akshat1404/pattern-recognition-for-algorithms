// Kth Smallest Element in a Sorted Matrix
// https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/description/
//
// Problem: an n x n matrix with every row and column sorted ascending.
// Return the kth smallest element in sorted order, counting duplicates.
//
// The matrix is not one sorted list, so positions cannot be searched.
// Values can. Guess a value and count the elements at or below it. The
// count only grows as the guess grows, and the smallest value whose
// count reaches k is the answer, always an element of the matrix.

function kthSmallest(matrix, k) {
    const n = matrix.length;
    let low = matrix[0][0];
    let high = matrix[n - 1][n - 1];
    let answer = high;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        if (countAtMost(matrix, mid) >= k) {
            answer = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    return answer;
}

// First version: count row by row. A row whose last element fits counts
// whole, a row whose first element is too big ends the count, and only
// the rows in between are walked. Up to n * n steps.
function countAtMostByRows(matrix, value) {
    const n = matrix.length;
    let count = 0;

    for (let row = 0; row < n; row++) {
        if (matrix[row][0] > value) break;
        if (matrix[row][n - 1] <= value) {
            count += n;
            continue;
        }
        for (let col = 0; col < n && matrix[row][col] <= value; col++) {
            count++;
        }
    }

    return count;
}

// Faster version, used above: walk from the bottom-left corner, where
// right means bigger and up means smaller. A cell at or below value means
// the whole column above it is too, so count it and step right. Otherwise
// step up. At most 2n steps.
function countAtMost(matrix, value) {
    const n = matrix.length;
    let row = n - 1;
    let col = 0;
    let count = 0;

    while (row >= 0 && col < n) {
        if (matrix[row][col] <= value) {
            count += row + 1;
            col++;
        } else {
            row--;
        }
    }

    return count;
}

module.exports = { kthSmallest, countAtMost, countAtMostByRows };
