// Remove Duplicates from Sorted List II
// https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/description/
//
// Problem: the list is sorted. Remove every node whose value appears more
// than once, keeping only values that appear exactly once, and return the
// head of the result.
//
// The head itself may be removed, so a dummy node goes in front. The walk
// stands on the last kept node and looks ahead. When the next value
// repeats, every node with that value is skipped in one go.

const { ListNode } = require('./list-node');

function deleteDuplicates(head) {
    const dummy = new ListNode(0, head);
    let prev = dummy;

    while (prev.next !== null) {
        let node = prev.next;

        if (node.next !== null && node.next.val === node.val) {
            const repeated = node.val;
            while (node !== null && node.val === repeated) {
                node = node.next;
            }
            prev.next = node;
        } else {
            prev = node;
        }
    }

    return dummy.next;
}

module.exports = { deleteDuplicates };
