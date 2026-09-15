// Linked List Cycle
// https://leetcode.com/problems/linked-list-cycle/description/
//
// Problem: given the head of a linked list, determine whether it
// contains a cycle, some node's `next` eventually points back to a
// node already visited, rather than ending at null.
//
// A set of visited nodes would answer this in O(n) space, checking
// each node against everything seen so far, the seen-before pattern
// from hashing. Two pointers at different speeds answers it in O(1)
// space instead. If there's no cycle, the faster pointer simply
// reaches the end first. If there is one, the faster pointer enters
// the cycle first and laps the slower one, since it closes the gap
// between them by one node every step, guaranteeing they land on
// the same node eventually rather than passing each other.

function hasCycle(head) {
    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }

    return false;
}

module.exports = { hasCycle };
