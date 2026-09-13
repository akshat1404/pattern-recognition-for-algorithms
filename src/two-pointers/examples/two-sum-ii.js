// Two Sum II - Input Array Is Sorted
// https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/
//
// Problem: given a 1-indexed array already sorted in ascending
// order, return the 1-indexed positions of the two numbers that add
// up to a given target. Exactly one solution exists.
//
// Sorted means position already tells us something about size, the
// rightmost value in range is always the largest remaining, the
// leftmost is always the smallest. That's enough to know, from one
// comparison, which side is safe to move, no lookup needed.

function twoSum(numbers, target) {
    let left = 0;
    let right = numbers.length - 1;

    while (left < right) {
        const sum = numbers[left] + numbers[right];

        if (sum === target) {
            // Problem wants 1-indexed positions, not 0-indexed.
            return [left + 1, right + 1];
        }

        if (sum < target) {
            // Current sum is too small. left holds the smallest
            // value remaining, so it's the only side that can ever
            // be too small, moving it to a bigger value is safe.
            left++;
        } else {
            // Current sum is too big. right holds the largest value
            // remaining, so it's the only side that can ever be too
            // big, moving it to a smaller value is safe.
            right--;
        }
    }

    return [];
}

module.exports = { twoSum };
