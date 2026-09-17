// Happy Number, revisited with Floyd's instead of a set
// https://leetcode.com/problems/happy-number/description/
//
// Same problem solved in the Hashing chapter with a set tracking
// every value seen. The sequence of computed values is really an
// implicit linked list, each value's "next" is whatever
// sumOfSquaredDigits produces from it, so the exact same cycle
// detection used on real linked lists applies here too, trading the
// set's O(n) space for two pointers at O(1).

function sumOfSquaredDigits(n) {
    let sum = 0;
    while (n > 0) {
        const digit = n % 10;
        sum += digit * digit;
        n = Math.floor(n / 10);
    }
    return sum;
}

function isHappy(n) {
    let slow = n;
    let fast = n;

    do {
        slow = sumOfSquaredDigits(slow);
        fast = sumOfSquaredDigits(sumOfSquaredDigits(fast));
    } while (slow !== fast);

    // They only ever meet at 1 (a self-loop) or somewhere inside
    // the non-happy cycle. Meeting at 1 is the only happy case.
    return slow === 1;
}

module.exports = { isHappy };
