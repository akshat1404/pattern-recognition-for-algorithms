// Happy Number
// https://leetcode.com/problems/happy-number/description/
//
// Problem: given a positive integer, repeatedly replace it with the
// sum of the squares of its digits. If this process reaches 1,
// the number is happy. If it loops forever without ever reaching 1,
// it is not happy. Determine which case a given number falls into.
//
// The seen-before check here isn't spotting a duplicate in an array,
// it's spotting a cycle. If a value we computed before ever shows up
// again, we are back on a path we already walked, and walking it
// again can only produce the same values in the same order forever.
// That repeat is the only signal telling us to stop and say "no."

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
    const seen = new Set();

    while (n !== 1 && !seen.has(n)) {
        seen.add(n);
        n = sumOfSquaredDigits(n);
    }

    // Loop only ends one of two ways, n reached 1, or n repeated.
    return n === 1;
}

module.exports = { isHappy };
