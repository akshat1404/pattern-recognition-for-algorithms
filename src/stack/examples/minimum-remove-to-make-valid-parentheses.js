// Minimum Remove to Make Valid Parentheses
// https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/description/
//
// Problem: s has '(', ')' and lowercase letters. Remove as few parentheses
// as possible so the result is valid, and return any valid result.
//
// Match brackets as in Valid Parentheses, but keep indices so the bad
// ones can be removed. A ')' with nothing open is bad the moment it
// arrives. A '(' still on the stack at the end never got closed.

function minRemoveToMakeValid(s) {
    const stack = [];
    const remove = new Set();

    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            stack.push(i);
        } else if (s[i] === ')') {
            if (stack.length > 0) {
                stack.pop();
            } else {
                remove.add(i);
            }
        }
    }

    for (const i of stack) {
        remove.add(i);
    }

    let result = '';
    for (let i = 0; i < s.length; i++) {
        if (!remove.has(i)) result += s[i];
    }

    return result;
}

module.exports = { minRemoveToMakeValid };
