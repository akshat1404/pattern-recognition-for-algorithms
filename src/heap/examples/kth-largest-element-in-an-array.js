// Kth Largest Element in an Array
// https://leetcode.com/problems/kth-largest-element-in-an-array/description/
//
// Problem: return the kth largest element of an unsorted array, counting
// duplicates, so in [3, 2, 3, 1] the 2nd largest is 3.
//
// Keep the k largest seen so far in a min-heap. Its top is the smallest
// of them, the one to throw out when something bigger arrives, and at the
// end it is the kth largest.

const { Heap } = require('./heap');

function findKthLargest(nums, k) {
    const heap = new Heap();

    for (const num of nums) {
        heap.push(num);
        if (heap.size() > k) heap.pop();
    }

    return heap.peek();
}

module.exports = { findKthLargest };
