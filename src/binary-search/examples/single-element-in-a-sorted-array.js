// Single Element in a Sorted Array
// https://leetcode.com/problems/single-element-in-a-sorted-array/description/
//
// Problem: nums is sorted, every value appears exactly twice except one,
// which appears once. Return that value in O(log n) time and O(1) space.
//
// Before the single element, every pair starts on an even index. After
// it, every pair starts on an odd index, since the single element shifts
// everything by one. So the search runs over pair numbers: pair k starts
// at index 2k, and "is pair k intact" is true before the single element
// and false from it onward.

function singleNonDuplicate(nums) {
    let low = 0;
    let high = Math.floor(nums.length / 2);

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const i = 2 * mid;

        if (nums[i] !== nums[i - 1] && nums[i] !== nums[i + 1]) {
            return nums[i];
        }

        if (nums[i] === nums[i + 1]) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
}

module.exports = { singleNonDuplicate };
