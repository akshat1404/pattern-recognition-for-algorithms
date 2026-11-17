// Add Two Numbers
// https://leetcode.com/problems/add-two-numbers/description/
//
// Problem: two non-negative numbers are stored as linked lists of digits,
// with the ones digit first. Return their sum as a list in the same form.
//
// The digits come ones first, which is the order column addition works
// in. Add digit by digit with a carry, building the answer after a dummy
// node. The loop runs while either list has digits or a carry is left.

const { ListNode } = require('./list-node');

function addTwoNumbers(a, b) {
    const dummy = new ListNode(0);
    let tail = dummy;
    let carry = 0;

    while (a !== null || b !== null || carry > 0) {
        const sum = (a !== null ? a.val : 0) + (b !== null ? b.val : 0) + carry;
        carry = Math.floor(sum / 10);

        tail.next = new ListNode(sum % 10);
        tail = tail.next;

        if (a !== null) a = a.next;
        if (b !== null) b = b.next;
    }

    return dummy.next;
}

module.exports = { addTwoNumbers };
