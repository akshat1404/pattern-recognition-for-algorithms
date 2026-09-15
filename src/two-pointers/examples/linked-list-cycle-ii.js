// Linked List Cycle II
// https://leetcode.com/problems/linked-list-cycle-ii/description/
//
// Problem: given the head of a linked list, if it has a cycle,
// return the node where the cycle begins. If it doesn't, return
// null. Same O(1) space constraint as Linked List Cycle, no
// modifying the list, no extra structure to track visited nodes.
//
// Phase one is identical to Linked List Cycle, slow and fast moving
// at different speeds until they meet somewhere inside the cycle.
// Phase two uses that meeting point, reset one pointer to head,
// leave the other at the meeting point, advance both one step at a
// time, they're guaranteed to meet again exactly at the cycle's
// start.
//
// Why that works: let a = distance from head to the cycle's start,
// b = distance from the cycle's start to the meeting point, c = the
// rest of the cycle back to the start, so the cycle length is b + c.
// When slow and fast meet, slow has traveled a + b, fast has
// traveled twice that, and fast's extra distance beyond slow's is
// some whole number of full laps around the cycle. Working through
// that equality gives a = c, plus possibly a few extra full laps,
// which don't matter, a full lap returns to the same node. So
// walking `a` steps from head and `c` steps from the meeting point
// land on the same node, the cycle's start.

function detectCycle(head) {
    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) {
            let ptr = head;
            while (ptr !== slow) {
                ptr = ptr.next;
                slow = slow.next;
            }
            return ptr;
        }
    }

    return null;
}

module.exports = { detectCycle };
