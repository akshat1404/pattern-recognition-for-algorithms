// Subarray Sum Equals K
// https://leetcode.com/problems/subarray-sum-equals-k/description/
//
// Problem: given an array of integers and an integer k, return the
// number of contiguous subarrays whose elements sum to k.
//
// Track a running prefix sum, y, as we walk the array. The subarray
// between some earlier point x and here sums to y - x. We want that
// to equal k, so y - x = k, which means x = y - k. So at each step,
// the earlier prefix sum we need is y - k, and we check whether it
// already exists.
//
// This has to count how many subarrays sum to k, not just whether
// one does, so the map holds how many times each prefix sum has
// occurred, not just whether it occurred. Seed the map with
// { 0: 1 } before starting, so a subarray that sums to k starting
// right at index 0 still has a prefix sum of 0 to pair against.

function subarraySum(nums, k) {
    const prefixSumCounts = new Map();
    prefixSumCounts.set(0, 1);

    let runningSum = 0;
    let count = 0;

    for (const n of nums) {
        runningSum += n;

        const needed = runningSum - k;
        if (prefixSumCounts.has(needed)) {
            count += prefixSumCounts.get(needed);
        }

        prefixSumCounts.set(runningSum, (prefixSumCounts.get(runningSum) || 0) + 1);
    }

    return count;
}

module.exports = { subarraySum };
