// Swap Nodes in Pairs
// https://leetcode.com/problems/swap-nodes-in-pairs/description/
//
// Problem: swap every two adjacent nodes and return the new head. The
// nodes themselves must move, not the values inside them.
//
// A dummy node gives the first pair a node before it. For each pair,
// three pointers change: the node before the pair, the first node, and
// the second node.

const { ListNode } = require('./list-node');

function swapPairs(head) {
    const dummy = new ListNode(0, head);
    let prev = dummy;

    while (prev.next !== null && prev.next.next !== null) {
        const first = prev.next;
        const second = first.next;

        first.next = second.next;
        second.next = first;
        prev.next = second;

        prev = first;
    }

    return dummy.next;
}

module.exports = { swapPairs };
