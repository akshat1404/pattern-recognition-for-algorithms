// Remove Duplicates from Sorted Array
// https://leetcode.com/problems/remove-duplicates-from-sorted-array/description/
//
// Problem: given a sorted array, remove duplicates in place so each
// unique value appears once, keeping relative order, and return the
// new length. The first part of the array, up to that length, must
// hold the result.
//
// Without sorting, checking "have I kept this value already" would
// need a set, remembering everything written so far, O(n) extra
// space. Sorted means duplicates are guaranteed to sit next to each
// other, so the only check needed is against the single most
// recently kept value, no set required.

function removeDuplicates(nums) {
    let slow = 0;

    for (let fast = 1; fast < nums.length; fast++) {
        // A new value only ever needs comparing against the last
        // one kept, sorted order guarantees nothing else could
        // possibly match it.
        if (nums[fast] !== nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }

    return slow + 1;
}

module.exports = { removeDuplicates };
