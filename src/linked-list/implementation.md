# Implementation

JavaScript has no built-in linked list. A node is a small object holding a value and a reference to the next node, and the list is just its first node, the head. The last node points to `null`.

```javascript
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

// 1 -> 2 -> 3
const head = new ListNode(1, new ListNode(2, new ListNode(3)));
```

Walking the list means following `.next` until it runs out. There is no `head[i]`, reaching the `i`th node takes `i` steps.

```javascript
let node = head;
while (node !== null) {
    // use node.val
    node = node.next;
}
```

Every technique below rearranges nodes by changing where `.next` points. Nothing is copied. The one rule that applies to all of them is to save `node.next` before changing it, since once it changes, the rest of the list is unreachable.

## Reversal

Turn every `.next` around while walking forward. Three nodes are in hand at each step, the one behind, the current one, and the one ahead, saved before the current one's pointer is turned.

```javascript
function reverseList(head) {
    let prev = null;
    let curr = head;

    while (curr !== null) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }

    return prev;
}
```

When the loop ends, `curr` has run off the end and `prev` is the old last node, now the first. The old first node points to `null`, because `prev` started as `null`. Reversing only part of a list is the same loop run for a fixed number of steps, followed by reconnecting the nodes on either side of the reversed stretch.

## Dummy node

When the first node of the answer is not known in advance, or may be removed, start with a placeholder node that is not part of the answer. Build the answer after it by moving a `tail` pointer along, and return `dummy.next` at the end.

```javascript
function mergeTwoLists(a, b) {
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
```

Without the dummy, the first node chosen would need its own branch, since there is no earlier node to attach it to. With it, there is always a node to attach to, and the first node of the answer is handled like every other. The same move handles removing nodes, where the head itself might be removed.

```javascript
function removeElements(head, val) {
    const dummy = new ListNode(0, head);
    let node = dummy;

    while (node.next !== null) {
        if (node.next.val === val) {
            node.next = node.next.next;
        } else {
            node = node.next;
        }
    }

    return dummy.next;
}
```

Removal looks one node ahead. To remove a node, the node before it has to skip it, so the walk stands on the node before and checks `node.next`. The dummy gives the head a node before it.

## Split and rejoin

A rotation or regrouping is the same nodes cut into pieces and joined in a new order. Two small moves cover it, cutting after a given number of nodes, and finding the last node of a piece to join it to the next.

```javascript
// Cut after the first k nodes and return the head of the rest.
function cutAfter(head, k) {
    let node = head;
    for (let i = 1; i < k && node !== null; i++) {
        node = node.next;
    }
    if (node === null) return null;

    const rest = node.next;
    node.next = null;
    return rest;
}

function lastNode(head) {
    let node = head;
    while (node.next !== null) {
        node = node.next;
    }
    return node;
}
```

`node.next = null` is what makes the cut, the first piece now ends there. Any new chain has to end the same way, with its last node pointing to `null`. A node left pointing to its old neighbor can join the new list back into itself and form a loop.

## Hash map and doubly linked list

When nodes have to move from anywhere to one end in constant time, each node gets a pointer back to the node before it as well. Two placeholder nodes, one at each end, mean every real node always has a neighbor on both sides, so removing and inserting never need a special case.

```javascript
class DNode {
    constructor(key, val) {
        this.key = key;
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}

class OrderedList {
    constructor() {
        this.front = new DNode(null, null);
        this.back = new DNode(null, null);
        this.front.next = this.back;
        this.back.prev = this.front;
    }

    remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    addToFront(node) {
        node.next = this.front.next;
        node.prev = this.front;
        this.front.next.prev = node;
        this.front.next = node;
    }

    oldest() {
        return this.back.prev === this.front ? null : this.back.prev;
    }
}
```

Paired with a `Map` from each key to its node, this gives constant-time lookup and constant-time reordering. To use a key, find its node in the map, `remove` it, and `addToFront`. To drop the oldest, take `oldest()`, `remove` it, and delete its key from the map, which is why each node stores its own key.

## The one thing that actually matters

Every technique here is a short list of pointer changes, and the code is right when each change happens in the right order. Save what a pointer points to before changing it. Give the head a node before it when the head might change. End every new chain with `null`. Once a problem's answer is described as "the same nodes, connected differently", the work is to write down which `.next` changes, in which order, and check each of those three rules.
