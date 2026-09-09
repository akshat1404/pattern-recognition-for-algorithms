// Majority Element
// https://leetcode.com/problems/majority-element/description/
//
// Problem: given an array of size n, return the element that appears
// more than n / 2 times. The problem guarantees one always exists,
// so there's no need to handle the case where nothing qualifies.
//
// Count each value as we go, and the moment any single value's count
// crosses n / 2, that value has to be the answer, since more than
// half the array can only belong to one value at a time.

function majorityElement(nums) {
    const counts = new Map();
    const majorityThreshold = nums.length / 2;

    for (const n of nums) {
        const count = (counts.get(n) || 0) + 1;
        counts.set(n, count);

        // No need to finish counting everything else once one value
        // has already crossed the threshold, it's the only one that
        // can, so we can return the moment it happens.
        if (count > majorityThreshold) return n;
    }
}

module.exports = { majorityElement };
