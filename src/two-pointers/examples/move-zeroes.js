// Move Zeroes
// https://leetcode.com/problems/move-zeroes/description/
//
// Problem: given an array, move all zeroes to the end while keeping
// the relative order of the non-zero elements, in place, without
// making a copy of the array.
//
// Unlike Remove Duplicates, the decision here doesn't need to
// compare fast against slow at all, only whether nums[fast] is
// zero. And since the zeroes can't just be discarded, they still
// need to exist somewhere in the array, slow and fast swap places
// instead of overwriting, which relocates a zero into fast's old
// spot rather than losing track of it.

function moveZeroes(nums) {
    let slow = 0;

    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== 0) {
            [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
            slow++;
        }
    }
}

module.exports = { moveZeroes };
