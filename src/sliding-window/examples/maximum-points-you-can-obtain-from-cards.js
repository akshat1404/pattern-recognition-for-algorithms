// Maximum Points You Can Obtain from Cards
// https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/description/
//
// Problem: cards lie in a row, each with a point value. In each of
// k steps, take one card from either the left end or the right end.
// Return the maximum total points obtainable.
//
// The cards taken are never a contiguous range, they come from the
// two ends. The cards left behind are. Taking i cards from the left
// and k - i from the right always leaves exactly n - k cards in a
// row in the middle, and every position of that middle block is
// reachable. So maximizing what is taken means minimizing what is
// left, the smallest sum of any window of size n - k.

function maxScore(cardPoints, k) {
    const n = cardPoints.length;
    const windowSize = n - k;

    let total = 0;
    for (const points of cardPoints) {
        total += points;
    }

    // Taking every card leaves an empty window.
    if (windowSize === 0) return total;

    let windowSum = 0;
    for (let i = 0; i < windowSize; i++) {
        windowSum += cardPoints[i];
    }
    let minWindow = windowSum;

    for (let right = windowSize; right < n; right++) {
        windowSum += cardPoints[right] - cardPoints[right - windowSize];
        minWindow = Math.min(minWindow, windowSum);
    }

    return total - minWindow;
}

module.exports = { maxScore };
