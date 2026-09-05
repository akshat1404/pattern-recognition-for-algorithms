// Contains Duplicate II
// https://leetcode.com/problems/contains-duplicate-ii/description/
//
// Problem: given an array of integers and an integer k, return true
// if there are two distinct indices i and j such that nums[i] ==
// nums[j] and the distance between i and j is at most k.
//
// Strip away the k constraint for a moment and this is just Contains
// Duplicate again, does any value repeat (that's what nums[i] == nums[j] means right?) , answered by remembering
// every value we pass. The k constraint doesn't change that core
// question, it only restricts which repeats are allowed to count.
// A far-apart repeat is not a match here, so knowing a value repeated
// is no longer enough, we also need to know how far apart the two
// occurrences are. That means the map can't just record "seen or
// not," it has to record the index each value was last seen at, so
// the distance can actually be checked when a repeat shows up.

function containsNearbyDuplicate(nums, k) {
    const lastSeenAt = new Map(); // value -> most recent index

    for (let i = 0; i < nums.length; i++) {
        const n = nums[i];

        if (lastSeenAt.has(n) && i - lastSeenAt.get(n) <= k) {
            return true;
        }

        // Record (or overwrite) this value's most recent position,
        // so the next repeat only measures distance from here.
        lastSeenAt.set(n, i);
    }

    return false;
}

module.exports = { containsNearbyDuplicate };
