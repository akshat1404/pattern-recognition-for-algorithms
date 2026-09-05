// Longest Consecutive Sequence
// https://leetcode.com/problems/longest-consecutive-sequence/description/
//
// Problem: given an unsorted array of integers, return the length of
// the longest run of consecutive integers, in any order in the input,
// solved in O(n) time.
//
// The seen-before question here is "is this value present in the
// array at all," asked over and over as we try to extend a run.
// A set answers that in one lookup instead of a scan, which is what
// keeps the whole thing linear.

function longestConsecutive(nums) {
    // This is the first pass, even though there's no visible loop.
    // Set(nums) walks nums once internally to load every value in.
    const present = new Set(nums);
    let longest = 0;

    // Second pass, over the set, not nums, so a value repeated in
    // the input only gets processed once here.
    for (const n of present) {
        // No need to check whether n was already claimed by an
        // earlier run. If it was, it was deleted below before this
        // loop reached it, and a Set's iterator skips entries that
        // were already deleted, so n simply never shows up here.
        present.delete(n);
        let length = 1;

        // Expand right, deleting each number as it joins this run so
        // no later iteration step processes it again.
        let right = n + 1;
        while (present.has(right)) {
            present.delete(right);
            length++;
            right++;
        }

        // Expand left the same way.
        let left = n - 1;
        while (present.has(left)) {
            present.delete(left);
            length++;
            left--;
        }

        longest = Math.max(longest, length);
    }

    return longest;
}

module.exports = { longestConsecutive };
