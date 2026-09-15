// Reorder List
// https://leetcode.com/problems/reorder-list/description/
//
// Problem: given a list L0 -> L1 -> ... -> Ln, reorder it in place
// to L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ..., without a second
// data structure to index nodes from both ends at once.
//
// Three phases, each one already covered elsewhere in this chapter.
// Find the middle with fast and slow, exactly like Middle of the
// Linked List. Reverse everything after the middle, so the second
// half can now be walked front-to-back instead of needing to be
// walked backward. Then merge the two halves by alternating nodes,
// one from the front half, one from the reversed back half.

function reorderList(head) {
    if (!head || !head.next) return;

    // Phase 1: find the middle.
    let slow = head;
    let fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // Phase 2: cut the list in half and reverse the second half.
    let second = slow.next;
    slow.next = null;
    let prev = null;
    while (second) {
        const next = second.next;
        second.next = prev;
        prev = second;
        second = next;
    }
    second = prev;

    // Phase 3: merge by alternating nodes from each half.
    let first = head;
    while (second) {
        const firstNext = first.next;
        const secondNext = second.next;

        first.next = second;
        second.next = firstNext;

        first = firstNext;
        second = secondNext;
    }
}

module.exports = { reorderList };
