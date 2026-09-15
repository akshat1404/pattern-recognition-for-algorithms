// Middle of the Linked List
// https://leetcode.com/problems/middle-of-the-linked-list/description/
//
// Problem: given the head of a linked list, return its middle node.
// If there are two middle nodes (an even length list), return the
// second one.
//
// A linked list has no O(1) length the way an array does, so the
// direct fix is two passes, walk once to count the nodes, then walk
// again to the halfway point. Fast and slow gets it in one pass
// instead. fast covers twice the ground of slow in the same number
// of steps, so by the time fast has reached the end, slow has
// covered exactly half the distance.

function middleNode(head) {
    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;
}

module.exports = { middleNode };
