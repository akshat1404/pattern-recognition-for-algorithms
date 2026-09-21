// Sliding Window Maximum
// https://leetcode.com/problems/sliding-window-maximum/description/
//
// Problem: given an array and a window size k, return an array where
// each entry is the maximum of one window as it slides across, so
// the result has one number per window position.
//
// The window's size is given, so this is the fixed-size shape. The
// difficulty is the tracked value. A maximum has no undo, when the
// current max leaves the window there is nothing to subtract, and
// the next biggest has to already be known.
//
// A deque of indices solves it. It holds only the numbers that could
// still become the max, in decreasing order of value, so the front
// is always the current max.
//
//   New number arrives: remove from the back while the back is
//   smaller than or equal to it, those are older and smaller, so
//   they leave the window first and can never win again. Then add
//   the new number at the back.
//
//   Front number has slid out of the window: remove it from the
//   front.
//
//   Max needed: read the front.
//
// JavaScript has no built-in deque. An array handles the back
// (push and pop are fast). For the front, a head index moves forward
// instead of calling shift(), which can be slow on large arrays.

function maxSlidingWindow(nums, k) {
    const deque = []; // indices into nums, values decreasing
    let head = 0; // deque[head] is the front
    const result = [];

    for (let right = 0; right < nums.length; right++) {
        // Drop everything at the back that the new number beats.
        while (deque.length > head && nums[deque[deque.length - 1]] <= nums[right]) {
            deque.pop();
        }
        deque.push(right);

        // The window covers right - k + 1 through right. If the
        // front's index is older than that, it has slid out.
        if (deque[head] <= right - k) {
            head++;
        }

        // Windows only exist once the first k numbers have arrived.
        if (right >= k - 1) {
            result.push(nums[deque[head]]);
        }
    }

    return result;
}

module.exports = { maxSlidingWindow };
