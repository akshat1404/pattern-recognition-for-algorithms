// Count Number of Nice Subarrays
// https://leetcode.com/problems/count-number-of-nice-subarrays/description/
//
// Problem: given an array of positive integers and an integer k,
// count the contiguous subarrays that contain exactly k odd numbers.
//
// "Exactly k" doesn't fit a window that grows and shrinks, a window
// with too few odd numbers and one with too many are both invalid,
// so no single direction of shrinking fixes both.
//
// What decides a subarray is only which k consecutive odd numbers it
// contains. Even numbers around them change nothing. So list the
// positions of the odd numbers, and slide a window of size k over
// that list. For each group of k odd positions, the subarray can
// start anywhere after the previous odd number up to the group's
// first odd, and end anywhere from the group's last odd up to just
// before the next odd number. Those two counts multiply.
//
// Markers at -1 and at nums.length stand in for "no previous odd"
// and "no next odd", so the first and last groups need no special case.

function numberOfSubarrays(nums, k) {
    const oddPositions = [-1];
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] % 2 === 1) oddPositions.push(i);
    }
    oddPositions.push(nums.length);

    const realOdds = oddPositions.length - 2;
    let count = 0;

    // A group covers oddPositions[i] through oddPositions[i + k - 1].
    for (let i = 1; i + k - 1 <= realOdds; i++) {
        const leftChoices = oddPositions[i] - oddPositions[i - 1];
        const rightChoices = oddPositions[i + k] - oddPositions[i + k - 1];
        count += leftChoices * rightChoices;
    }

    return count;
}

// The general alternative: exactly k = (at most k) - (at most k - 1).
// Every subarray with at most k odd numbers either has exactly k or
// has at most k - 1. "At most" passes the direction check, so it is
// a plain window. Once [left, right] holds at most k odd numbers,
// every subarray ending at right and starting anywhere from left to
// right does too, which is right - left + 1 new subarrays.

function atMost(nums, k) {
    if (k < 0) return 0;

    let left = 0;
    let odds = 0;
    let count = 0;

    for (let right = 0; right < nums.length; right++) {
        if (nums[right] % 2 === 1) odds++;

        while (odds > k) {
            if (nums[left] % 2 === 1) odds--;
            left++;
        }

        count += right - left + 1;
    }

    return count;
}

function numberOfSubarraysBySubtraction(nums, k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}

module.exports = { numberOfSubarrays, numberOfSubarraysBySubtraction };
