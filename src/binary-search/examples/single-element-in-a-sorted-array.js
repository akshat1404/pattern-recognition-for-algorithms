// Single Element in a Sorted Array
// https://leetcode.com/problems/single-element-in-a-sorted-array/description/
//
// Problem: nums is sorted, every value appears exactly twice except one,
// which appears once. Return that value in O(log n) time and O(1) space.
//
// Before the single element, every pair starts on an even index. After
// it, every pair starts on an odd index, since the single element shifts
// everything by one. So at an even index, "is the pair here intact" is
// true before the single element and false from it onward, flipping once.

function singleNonDuplicate(nums) {
    let low = 0;
    let high = nums.length - 1;

    while (low < high) {
        let mid = low + Math.floor((high - low) / 2);
        // The check only means something at the start of a pair.
        if (mid % 2 === 1) mid--;

        if (nums[mid] === nums[mid + 1]) {
            low = mid + 2;
        } else {
            high = mid;
        }
    }

    return nums[low];
}

module.exports = { singleNonDuplicate };
