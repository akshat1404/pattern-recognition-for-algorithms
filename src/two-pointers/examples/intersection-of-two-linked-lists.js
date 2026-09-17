// Intersection of Two Linked Lists
// https://leetcode.com/problems/intersection-of-two-linked-lists/description/
//
// Problem: given the heads of two singly linked lists that may
// merge into a shared tail, return the node where they intersect,
// or null if they never do. Compare by reference, not value.
//
// The two lists can have different lengths before the shared part
// starts, so walking both from their own heads at the same speed
// won't line them up. The fix: when a pointer reaches the end of
// its own list, redirect it to the head of the other list. That
// swap equalizes the total distance both pointers travel by the
// time they'd reach the intersection, so they arrive there
// together instead of offset by the length difference.

function getIntersectionNode(headA, headB) {
    let pointerA = headA;
    let pointerB = headB;

    while (pointerA !== pointerB) {
        pointerA = pointerA ? pointerA.next : headB;
        pointerB = pointerB ? pointerB.next : headA;
    }

    // Either the intersection node, or both null together if the
    // lists never intersect at all.
    return pointerA;
}

module.exports = { getIntersectionNode };
