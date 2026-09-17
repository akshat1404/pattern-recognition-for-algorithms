// Remove Nth Node From End of List
// https://leetcode.com/problems/remove-nth-node-from-end-of-list/description/
//
// Problem: given the head of a linked list, remove the nth node
// from the end and return the head, in one pass.
//
// Same fixed-gap idea as Swapping Nodes, no length to compute an
// index from, so a gap is used instead. A dummy node in front of
// head handles the edge case of removing the head itself. Advance
// one pointer n + 1 steps ahead of the other, both starting at the
// dummy, then slide both forward together until the front one runs
// off the end, the back one lands exactly on the node just before
// the one to remove.

function removeNthFromEnd(head, n) {
    const dummy = { val: 0, next: head };
    let fast = dummy;
    let slow = dummy;

    for (let i = 0; i < n + 1; i++) {
        fast = fast.next;
    }

    while (fast !== null) {
        fast = fast.next;
        slow = slow.next;
    }

    // slow is the node just before the one being removed.
    slow.next = slow.next.next;

    return dummy.next;
}

module.exports = { removeNthFromEnd };
