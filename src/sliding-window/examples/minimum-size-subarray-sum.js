// Minimum Size Subarray Sum
// https://leetcode.com/problems/minimum-size-subarray-sum/description/
//
// Problem: given an array of POSITIVE integers and a target, return
// the length of the shortest contiguous subarray whose sum is at
// least the target, or 0 if none exists.
//
// "Minimum" is the min ask, "subarray" is the contiguous range.
// The condition that moves left is the window's sum reaching the
// target. Once it does, the window is valid, and left keeps stepping
// forward for as long as it stays valid, recording a smaller answer
// at every step.
//
// This only works because every number is positive. Growing the
// window can only raise the sum, shrinking it can only lower it,
// so once dropping the leftmost element breaks the window, nothing
// further along could have helped.

function minSubArrayLen(target, nums) {
    let left = 0;
    let windowSum = 0;
    let best = Infinity;

    for (let right = 0; right < nums.length; right++) {
        windowSum += nums[right];

        while (windowSum >= target) {
            best = Math.min(best, right - left + 1);
            windowSum -= nums[left];
            left++;
        }
    }

    return best === Infinity ? 0 : best;
}

module.exports = { minSubArrayLen };
