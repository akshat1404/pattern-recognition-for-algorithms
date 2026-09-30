// Find First and Last Position of Element in Sorted Array
// https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/description/
//
// Problem: nums is sorted. Return the first and last index of target,
// or [-1, -1] if it is absent, in O(log n).
//
// Sorted order puts every copy of target in one block, so the answer is
// the two edges of that block. A match at mid only proves the block
// touches mid, so it is recorded and the search keeps narrowing toward
// the edge being looked for. One search per edge.

function searchRange(nums, target) {
    return [findEdge(nums, target, true), findEdge(nums, target, false)];
}

function findEdge(nums, target, wantLeft) {
    let low = 0;
    let high = nums.length - 1;
    let result = -1;

    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);

        if (nums[mid] === target) {
            result = mid;
            // A better match can only sit on the side of the edge we want.
            if (wantLeft) high = mid - 1;
            else low = mid + 1;
        } else if (nums[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return result;
}

module.exports = { searchRange };
