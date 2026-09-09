// Minimum Number of Operations to Make Array Empty
// https://leetcode.com/problems/minimum-number-of-operations-to-make-array-empty/description/
//
// Problem: given an array, one operation removes two or three copies
// of the same value. Return the minimum number of operations to
// empty the array, or -1 if it can't be done.
//
// Only "how many copies of each value exist" matters, position and
// order don't, so this starts with a frequency map. From there the
// problem splits into one independent question per value: given a
// count c, what's the fewest groups of 2 or 3 that sum to it, and is
// it even possible.
//
// c = 1 is the only impossible count, nothing sums to 1 using 2s
// and 3s. Past that, using as many 3s as possible and covering the
// remainder works out to ceil(c / 3) operations, by three cases:
//   c = 3n:     n groups of 3.
//   c = 3n + 2: n groups of 3, one group of 2 for the remainder.
//   c = 3n + 1: (n - 1) groups of 3, two groups of 2 for the
//               leftover 4, since a lone group of 1 isn't valid.
// All three land on n or n + 1 operations, which is ceil(c / 3).

function minOperations(nums) {
    const counts = new Map();
    for (const n of nums) {
        counts.set(n, (counts.get(n) || 0) + 1);
    }

    let operations = 0;
    for (const count of counts.values()) {
        if (count === 1) return -1;
        operations += Math.ceil(count / 3);
    }

    return operations;
}

module.exports = { minOperations };
