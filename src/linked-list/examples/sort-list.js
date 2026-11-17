// Sort List
// https://leetcode.com/problems/sort-list/description/
//
// Problem: sort a linked list in ascending order and return its head.
//
// Merge sort, done with list moves. Split the list at its middle, found
// with slow and fast pointers, sort each half, and merge the two sorted
// halves with the dummy-node merge.

const { ListNode } = require('./list-node');

function sortList(head) {
    if (head === null || head.next === null) return head;

    // fast starts one ahead, so slow stops at the end of the first half.
    let slow = head;
    let fast = head.next;
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    const second = slow.next;
    slow.next = null;

    return merge(sortList(head), sortList(second));
}

function merge(a, b) {
    const dummy = new ListNode(0);
    let tail = dummy;

    while (a !== null && b !== null) {
        if (a.val <= b.val) {
            tail.next = a;
            a = a.next;
        } else {
            tail.next = b;
            b = b.next;
        }
        tail = tail.next;
    }

    tail.next = a !== null ? a : b;
    return dummy.next;
}

module.exports = { sortList };
