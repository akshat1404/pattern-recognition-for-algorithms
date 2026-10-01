// Search in Rotated Sorted Array
// https://leetcode.com/problems/search-in-rotated-sorted-array/description/
//
// Problem: nums is sorted ascending with distinct values, then rotated
// at an unknown pivot. Return the index of target, or -1, in O(log n).
//
// Comparing nums[mid] to target alone no longer says which side to
// discard. What still holds is that the rotation's single drop sits in
// at most one half, so the other half is sorted. Find the sorted half,
// test target against its range, and discard accordingly.

function search(nums, target) {
    let low = 0;
    let high = nums.length - 1;

    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);

        if (nums[mid] === target) return mid;

        if (nums[low] <= nums[mid]) {
            // Left half is sorted, so its range is a trustworthy check.
            if (nums[low] <= target && target < nums[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            // Right half is sorted.
            if (nums[mid] < target && target <= nums[high]) low = mid + 1;
            else high = mid - 1;
        }
    }

    return -1;
}

module.exports = { search };
