// Jump Game VI
// https://leetcode.com/problems/jump-game-vi/description/
//
// Problem: start at index 0. From index i, jump to any index from i + 1
// to i + k. The score is the sum of nums at every index landed on,
// including the first and last. Return the highest score that reaches
// the last index.
//
// best[i] = nums[i] + the largest best among the k indices before i.
// That largest value is the maximum of a window that slides forward, so a
// deque of indices, best values falling from front to back, keeps it.

function maxResult(nums, k) {
    const best = new Array(nums.length);
    best[0] = nums[0];

    const deque = [0];
    let head = 0;

    for (let i = 1; i < nums.length; i++) {
        // The front fell out of reach.
        if (deque[head] < i - k) head++;

        best[i] = nums[i] + best[deque[head]];

        // Indices with a best no larger than best[i] can never be chosen again.
        while (deque.length > head && best[deque[deque.length - 1]] <= best[i]) {
            deque.pop();
        }
        deque.push(i);
    }

    return best[nums.length - 1];
}

module.exports = { maxResult };
