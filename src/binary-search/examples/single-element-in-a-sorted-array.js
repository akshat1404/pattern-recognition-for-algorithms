// Single Element in a Sorted Array
// https://leetcode.com/problems/single-element-in-a-sorted-array/description/
//
// Problem: nums is sorted, every value appears exactly twice except one,
// which appears once. Return that value in O(log n) time and O(1) space.
//
// Find mid's pair, then count the elements to the left of that pair. An
// even count means the left side is made only of complete pairs, so the
// single element is on the right. An odd count means it is on the left.

function singleNonDuplicate(nums) {
    let low = 0;
    let high = nums.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        let leftCount;
        if (nums[mid] === nums[mid - 1]) {
            leftCount = mid - 1;
        } else if (nums[mid] === nums[mid + 1]) {
            leftCount = mid;
        } else {
            return nums[mid];
        }

        if (leftCount % 2 === 0) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
}

module.exports = { singleNonDuplicate };
