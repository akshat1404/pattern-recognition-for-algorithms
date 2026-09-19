// Maximum Average Subarray I
// https://leetcode.com/problems/maximum-average-subarray-i/description/
//
// Problem: given an array and an integer k, find the contiguous
// subarray of length k with the highest average, and return that
// average.
//
// The window's size is given directly, so what moves left forward
// is just the window's length reaching past k, nothing about its
// contents. Build the sum of the first k elements once, then slide,
// adding the element entering and subtracting the one leaving.

function findMaxAverage(nums, k) {
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
        windowSum += nums[i];
    }

    let bestSum = windowSum;

    for (let right = k; right < nums.length; right++) {
        // nums[right] enters, nums[right - k] leaves, the window
        // stays exactly k wide without any separate size check.
        windowSum += nums[right] - nums[right - k];
        bestSum = Math.max(bestSum, windowSum);
    }

    return bestSum / k;
}

module.exports = { findMaxAverage };
