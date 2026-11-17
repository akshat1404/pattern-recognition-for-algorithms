// Find K Pairs with Smallest Sums
// https://leetcode.com/problems/find-k-pairs-with-smallest-sums/description/
//
// Problem: nums1 and nums2 are sorted ascending. A pair takes one number
// from each. Return the k pairs with the smallest sums.
//
// Picture one row per element of nums1, pairing it with every element of
// nums2 in order. Each row is sorted, so only the front of each row can be
// next. A heap of row fronts gives the smallest pair, and taking a row's
// front puts that row's next pair in.

const { Heap } = require('./heap');

function kSmallestPairs(nums1, nums2, k) {
    const heap = new Heap((a, b) => (nums1[a[0]] + nums2[a[1]]) - (nums1[b[0]] + nums2[b[1]]));

    for (let i = 0; i < Math.min(nums1.length, k); i++) {
        heap.push([i, 0]);
    }

    const result = [];
    while (result.length < k && heap.size() > 0) {
        const [i, j] = heap.pop();
        result.push([nums1[i], nums2[j]]);

        if (j + 1 < nums2.length) heap.push([i, j + 1]);
    }

    return result;
}

module.exports = { kSmallestPairs };
