// Remove Duplicates from Sorted Array II
// https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/description/
//
// Problem: given a sorted array, remove duplicates in place so each
// value appears at most twice, keeping relative order, and return
// the new length.
//
// Same shape as Remove Duplicates from Sorted Array, but comparing
// against the single last kept value isn't enough anymore, that
// would only ever allow one copy through. The comparison moves back
// one more slot, against the value kept two positions before slow,
// since that's exactly what tells us whether keeping the current
// value would be a third copy in a row.

function removeDuplicates(nums) {
    let slow = 0;

    for (let fast = 0; fast < nums.length; fast++) {
        // The first two positions are always safe to keep, there's
        // no way to have three copies yet. Past that, only keep a
        // value if it differs from what's two slots back in the
        // write region, matching there would make this a third copy.
        if (slow < 2 || nums[fast] !== nums[slow - 2]) {
            nums[slow] = nums[fast];
            slow++;
        }
    }

    return slow;
}

module.exports = { removeDuplicates };
