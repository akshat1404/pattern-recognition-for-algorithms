// Palindrome Linked List
// https://leetcode.com/problems/palindrome-linked-list/description/
//
// Problem: given the head of a linked list, determine whether it
// reads the same forwards and backwards, in O(1) extra space.
//
// Same three-phase idea as Reorder List, find the middle, reverse
// the second half, then compare, this time with Valid Palindrome's
// compare-and-fail-fast logic instead of a merge. One difference in
// the middle-finding loop: it checks fast.next and fast.next.next,
// not fast and fast.next, so that slow stops at the end of the
// first half rather than landing on the middle node itself, which
// keeps the comparison correct for both odd and even lengths.

function reverse(node) {
    let prev = null;
    while (node) {
        const next = node.next;
        node.next = prev;
        prev = node;
        node = next;
    }
    return prev;
}

function isPalindrome(head) {
    if (!head || !head.next) return true;

    let slow = head;
    let fast = head;
    while (fast.next && fast.next.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    let second = reverse(slow.next);
    let first = head;

    while (second) {
        if (first.val !== second.val) return false;
        first = first.next;
        second = second.next;
    }

    return true;
}

module.exports = { isPalindrome };
