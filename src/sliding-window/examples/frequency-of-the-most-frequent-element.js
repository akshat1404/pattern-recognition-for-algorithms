// Frequency of the Most Frequent Element
// https://leetcode.com/problems/frequency-of-the-most-frequent-element/description/
//
// Problem: in one operation, increase any element by 1. With at most
// k operations, return the highest frequency any single value can
// reach.
//
// Increments only go up, so a group of elements can only be raised
// to the group's largest value. The cheapest group of a given size
// to raise to a target is the elements closest to it just below it,
// which is a contiguous stretch once the array is sorted. That is
// what makes sorting first the right move, and what makes a window
// over the sorted array valid.
//
// The condition that moves left is a cost, not a count or a sum on
// its own. Raising every element in a window to the value at right
// costs nums[right] * windowSize - windowSum, and the window is
// valid while that stays within k.
//
// Growing right can only raise that cost (the array is sorted, so
// the target only gets bigger), and dropping from left can only
// lower it, so shrinking from the left is safe.

function maxFrequency(nums, k) {
    const sorted = [...nums].sort((a, b) => a - b);
    let left = 0;
    let windowSum = 0;
    let best = 1;

    for (let right = 0; right < sorted.length; right++) {
        windowSum += sorted[right];

        while (sorted[right] * (right - left + 1) - windowSum > k) {
            windowSum -= sorted[left];
            left++;
        }

        best = Math.max(best, right - left + 1);
    }

    return best;
}

module.exports = { maxFrequency };
