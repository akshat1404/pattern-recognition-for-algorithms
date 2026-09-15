// Squares of a Sorted Array
// https://leetcode.com/problems/squares-of-a-sorted-array/description/
//
// Problem: given an array sorted in ascending order, possibly with
// negative numbers, return the squares of every element, sorted in
// ascending order.
//
// No target here, just a comparison at each step. In a sorted array,
// the largest absolute value always sits at one of the two ends,
// the most negative number on the left or the most positive on the
// right, so the largest square is always at one of the two ends too.
// Fill the result from the back, largest first, and move whichever
// pointer produced it.

function sortedSquares(nums) {
    const n = nums.length;
    const result = new Array(n);
    let left = 0;
    let right = n - 1;

    let i = n - 1;
    while (left <= right) {
        const leftSquare = nums[left] * nums[left];
        const rightSquare = nums[right] * nums[right];

        if (leftSquare > rightSquare) {
            result[i] = leftSquare;
            left++;
        } else {
            result[i] = rightSquare;
            right--;
        }
        i--;
    }

    return result;
}

module.exports = { sortedSquares };
