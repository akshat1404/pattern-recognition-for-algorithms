// Swapping Nodes in a Linked List
// https://leetcode.com/problems/swapping-nodes-in-a-linked-list/description/
//
// Problem: given the head of a linked list and an integer k, swap
// the values of the kth node from the start and the kth node from
// the end (1-indexed), then return the list.
//
// The kth node from the start is easy, walk k - 1 steps from head.
// The kth node from the end is the problem, a linked list has no
// length to compute an index from directly. The fix is a fixed gap
// between two pointers instead of a computed index: once one
// pointer is k - 1 steps ahead of the other, sliding both forward
// together until the front one hits the last node leaves the back
// one exactly k nodes from the end, the gap between them never
// changes, only where it sits in the list does.

function swapNodes(head, k) {
    let first = head;
    for (let i = 1; i < k; i++) {
        first = first.next;
    }
    // first is now the kth node from the start.

    let second = head;
    let runner = first;
    while (runner.next) {
        runner = runner.next;
        second = second.next;
    }
    // runner reached the last node, second is now the kth from the
    // end, having moved the exact same number of steps as runner.

    [first.val, second.val] = [second.val, first.val];
    return head;
}

module.exports = { swapNodes };
