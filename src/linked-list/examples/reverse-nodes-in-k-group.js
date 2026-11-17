// Reverse Nodes in k-Group
// https://leetcode.com/problems/reverse-nodes-in-k-group/description/
//
// Problem: reverse the nodes of the list k at a time and return the new
// head. A group of fewer than k nodes at the end stays as it is.
//
// For each group: check that k nodes exist, reverse them with the plain
// reversal loop, then reconnect the group to the node before it and the
// node after it.

const { ListNode } = require('./list-node');

function reverseKGroup(head, k) {
    const dummy = new ListNode(0, head);
    let groupPrev = dummy;

    while (true) {
        let kth = groupPrev;
        for (let i = 0; i < k && kth !== null; i++) {
            kth = kth.next;
        }
        if (kth === null) break;

        const groupNext = kth.next;
        const first = groupPrev.next;

        // Starting prev at groupNext makes the reversed group's last node
        // point straight to the rest of the list.
        let prev = groupNext;
        let curr = first;
        while (curr !== groupNext) {
            const next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }

        groupPrev.next = kth;
        groupPrev = first;
    }

    return dummy.next;
}

module.exports = { reverseKGroup };
