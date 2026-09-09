// Two Sum
// https://leetcode.com/problems/two-sum/description/
//
// Problem: given an array of integers and a target, return the
// indices of the two numbers that add up to the target. Exactly one
// valid pair exists, and the same element can't be used twice.
//
// For each number, the question is "does some other number in the
// array complete this one to the target." Rather than searching for
// that other number, we compute exactly what it would have to be,
// target - current, and check whether we've already recorded it.

function twoSum(nums, target) {
    const seenAt = new Map(); // value -> index

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        // Check before inserting, so nums[i] never pairs with
        // itself, only with a number that came before it.
        if (seenAt.has(complement)) {
            return [seenAt.get(complement), i];
        }

        seenAt.set(nums[i], i);
    }

    return [];
}

module.exports = { twoSum };
