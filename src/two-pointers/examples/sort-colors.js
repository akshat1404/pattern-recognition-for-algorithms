// Sort Colors
// https://leetcode.com/problems/sort-colors/description/
//
// Problem: given an array containing only 0s, 1s, and 2s, sort it
// in place, in one pass, without counting occurrences first.
//
// Move Zeroes only needed two pointers because it only had two
// categories, zero and non-zero. Three categories need a third
// pointer, low marks the boundary of the confirmed-0 region, high
// marks the boundary of the confirmed-2 region, mid scans forward
// classifying whatever it currently sits on.

function sortColors(nums) {
    let low = 0;
    let mid = 0;
    let high = nums.length - 1;

    while (mid <= high) {
        if (nums[mid] === 0) {
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++;
            mid++;
        } else if (nums[mid] === 1) {
            mid++;
        } else {
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
            // mid does not advance here. The value just swapped in
            // from high hasn't been classified yet, it needs to be
            // checked on the next iteration, not skipped past.
        }
    }
}

module.exports = { sortColors };
