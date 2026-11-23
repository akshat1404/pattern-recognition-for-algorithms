// Max Consecutive Ones III
// https://leetcode.com/problems/max-consecutive-ones-iii/description/
//
// Problem: given an array of 0s and 1s and a number k, change at most k
// of the 0s into 1s and return the longest run of consecutive 1s.
//
// A run can become all 1s exactly when it holds at most k zeros. Grow the
// window on the right, and while it holds more than k zeros, shrink it
// from the left. Every valid window is a candidate for the answer.

function longestOnes(nums, k) {
    let left = 0;
    let zeros = 0;
    let best = 0;

    for (let right = 0; right < nums.length; right++) {
        if (nums[right] === 0) zeros++;

        while (zeros > k) {
            if (nums[left] === 0) zeros--;
            left++;
        }

        best = Math.max(best, right - left + 1);
    }

    return best;
}

module.exports = { longestOnes };
