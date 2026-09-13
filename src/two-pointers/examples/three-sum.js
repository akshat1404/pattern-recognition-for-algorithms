// 3Sum
// https://leetcode.com/problems/3sum/description/
//
// Problem: given an array of integers, return all unique triplets
// that sum to 0. The result can't contain duplicate triplets.
//
// Sort first, then fix one value as an anchor and converge on the
// other two, same shape as Two Sum II, just with a moving target,
// -sorted[i] instead of a fixed one. The anchor is a third value
// held outside the two pointers, the triplet is anchor + left + right
// together, not something the two pointers produce on their own.

function threeSum(nums) {
    const sorted = [...nums].sort((a, b) => a - b);
    const result = [];

    for (let i = 0; i < sorted.length - 2; i++) {
        // Same anchor value as the previous iteration would only
        // ever rediscover the same triplets, skip it.
        if (i > 0 && sorted[i] === sorted[i - 1]) continue;

        let left = i + 1;
        let right = sorted.length - 1;
        const target = -sorted[i];

        while (left < right) {
            const sum = sorted[left] + sorted[right];

            if (sum === target) {
                result.push([sorted[i], sorted[left], sorted[right]]);
                left++;
                right--;

                // Skip past any repeats of the values that just
                // matched, so the same triplet isn't recorded twice.
                while (left < right && sorted[left] === sorted[left - 1]) left++;
                while (left < right && sorted[right] === sorted[right + 1]) right--;
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }

    return result;
}

module.exports = { threeSum };
