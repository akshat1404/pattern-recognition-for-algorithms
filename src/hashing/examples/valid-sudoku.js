// Valid Sudoku
// https://leetcode.com/problems/valid-sudoku/description/
//
// Problem: given a 9x9 Sudoku board, partially filled, determine if
// the filled cells satisfy the rules, no repeated digit in any row,
// column, or 3x3 box. Only filled cells need checking, empty cells
// ('.') are skipped entirely, the board doesn't need to be
// completable or solved, just not already broken.
//
// Every cell belongs to three groups at once, its row, its column,
// and its box. Keep one set per group, 9 rows + 9 columns + 9 boxes,
// and for each filled cell check its digit against all three of its
// groups before adding it to all three.

function boxIndex(row, col) {
    // A 9x9 grid is a 3x3 grid of boxes. Flooring row and col to
    // their box-row and box-col, then flattening that pair into a
    // single index the way any 2D grid flattens into 1D.
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

function isValidSudoku(board) {
    const rows = Array.from({ length: 9 }, () => new Set());
    const cols = Array.from({ length: 9 }, () => new Set());
    const boxes = Array.from({ length: 9 }, () => new Set());

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const digit = board[r][c];
            if (digit === ".") continue;

            const b = boxIndex(r, c);

            if (rows[r].has(digit) || cols[c].has(digit) || boxes[b].has(digit)) {
                return false;
            }

            rows[r].add(digit);
            cols[c].add(digit);
            boxes[b].add(digit);
        }
    }

    return true;
}

module.exports = { isValidSudoku };
