// Simplify Path
// https://leetcode.com/problems/simplify-path/description/
//
// Problem: given an absolute Unix path, return its simplified form. "."
// does nothing, ".." goes up one directory (staying at the root if
// already there), repeated slashes count as one, and any other name,
// including "...", is a directory.
//
// The stack holds the directory names still in the path. A ".." cancels
// the most recent one, the top.

function simplifyPath(path) {
    const stack = [];

    for (const piece of path.split('/')) {
        if (piece === '' || piece === '.') {
            continue;
        }

        if (piece === '..') {
            if (stack.length > 0) stack.pop();
        } else {
            stack.push(piece);
        }
    }

    return '/' + stack.join('/');
}

module.exports = { simplifyPath };
