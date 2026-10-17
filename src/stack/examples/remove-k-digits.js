// Remove K Digits
// https://leetcode.com/problems/remove-k-digits/description/
//
// Problem: num is a string of digits. Remove exactly k digits, keeping
// the rest in order, so the remaining number is as small as possible.
// Return it with no leading zeros, or "0" if nothing is left.
//
// The answer has n - k positions, and each should hold the smallest digit
// it can. The stack builds the answer left to right. A smaller digit
// arriving means the digit on top was a worse choice for its position, so
// it is popped, while removals are left.

function removeKdigits(num, k) {
    const keep = num.length - k;
    const stack = [];

    for (const digit of num) {
        while (k > 0 && stack.length > 0 && stack[stack.length - 1] > digit) {
            stack.pop();
            k--;
        }
        stack.push(digit);
    }

    // Removals left over: the stack never went down, so its largest
    // digits are at the end.
    const result = stack.slice(0, keep).join('').replace(/^0+/, '');

    return result === '' ? '0' : result;
}

module.exports = { removeKdigits };
