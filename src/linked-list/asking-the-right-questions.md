# Linked List: Asking the Right Questions

## Seeing it in a statement

Every problem statement has two parts. What it asks for, the shape of the answer. What it offers, the structure in the input we can lean on. For a linked list, the second part is usually free, since most statements say outright that the input is a linked list. The recognition that matters is which technique the problem needs once the list is known, and, less often, spotting a list in a problem that never mentions one.

A linked list offers one thing an array does not, nodes can be rearranged by changing where their `.next` points, without moving or copying anything. It denies one thing an array has, there is no jumping to an index, only stepping forward one node at a time.

| Asks for | Offers | Technique |
|---|---|---|
| All or part of the list in reverse order | `.next` pointers that can be turned around | Reversal, keeping the previous, current, and next node |
| Nodes merged, removed, or split by some rule, where the first node may change | A head that can be lost | A dummy node in front of the head |
| A rotation, regrouping, or new order of the same nodes | Pieces that can be cut apart and joined again | Split, then rejoin, sometimes with a reversal or merge in between |
| Constant-time lookup together with constant-time reordering | A sequence where any element may jump to the front and the oldest leaves | A hash map pointing into a doubly linked list |

If the problem only needs positions inside the list, the middle, a cycle, a node a fixed distance from the end, and never redirects a pointer, it is fast and slow pointers, covered in [Two Pointers](../two-pointers/asking-the-right-questions.md).

Five problems follow, each read from its statement to the technique. No code here, the code lives in Implementation and Examples.

## 1. Reverse Linked List II

**The statement.** [Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/description/) gives the head of a singly linked list and two positions, `left` and `right`, counted from `1`, with `left <= right`. It asks for the nodes from position `left` to position `right` to be reversed, and for the head of the resulting list. For `[1, 2, 3, 4, 5]` with `left = 2` and `right = 4`, the result is `[1, 4, 3, 2, 5]`.

**Asks for.** Part of the list in reverse order.

**Offers.** `.next` pointers inside that stretch that can be turned around, and nodes on each side of it that have to be reconnected.

**Why it fits.** On an array, reversing a stretch means swapping values from both ends inward. A singly linked list cannot step backward, so that does not work. What it can do is turn each `.next` around as it walks forward, so `2 → 3 → 4` becomes `2 ← 3 ← 4`, which needs three nodes in hand at every step, the one behind, the current one, and the one ahead, saved before its pointer is changed so the rest of the list is not lost.

The reversed stretch then has to be reconnected at both ends. The node before position `left` must point to the new front of the stretch, the old node at `right`, and the old node at `left`, now at the back, must point to whatever came after `right`. When `left` is `1`, there is no node before the stretch and the head itself changes, which is the case a dummy node in front of the head removes.

## 2. Partition List

**The statement.** [Partition List](https://leetcode.com/problems/partition-list/description/) gives the head of a linked list and a value `x`. It asks for the list to be rearranged so that every node with a value less than `x` comes before every node with a value at least `x`, keeping the original order within each of the two groups. For `[1, 4, 3, 2, 5, 2]` with `x = 3`, the result is `[1, 2, 2, 4, 3, 5]`.

**Asks for.** Nodes split by a rule, with the order inside each group kept.

**Offers.** Nodes that can be unhooked and attached to the end of a different chain, and a first node that may change.

**Why it fits.** Walk the list once and build two separate chains, one for the smaller values and one for the rest, attaching each node to the end of the chain it belongs to. Attaching to the end keeps the original order inside each chain. Then the end of the first chain points to the start of the second.

Either chain may end up empty, and the first node of the answer is not known until a smaller value appears. Starting each chain with a dummy node, a placeholder that is not part of the answer, means there is always a node to attach to, and no special case for the first node. The answer starts at the node after the first dummy. One more detail, the last node of the second chain must be made to point to nothing, or it may still point back into the list from its old position and form a loop.

## 3. Rotate List

**The statement.** [Rotate List](https://leetcode.com/problems/rotate-list/description/) gives the head of a linked list and a number `k`, and asks for the list rotated to the right by `k` places, so the last `k` nodes move to the front. For `[1, 2, 3, 4, 5]` with `k = 2`, the result is `[4, 5, 1, 2, 3]`. `k` can be larger than the length of the list.

**Asks for.** The same nodes in a rotated order.

**Offers.** A list that can be cut at one point and joined end to start.

**Why it fits.** Rotating an array by `k` moves every element. Rotating a list moves nothing. The answer `[4, 5, 1, 2, 3]` is the original list cut between `3` and `4`, with the old last node `5` joined to the old first node `1`. Only two pointers change, the node before the cut now points to nothing, and the old tail points to the old head.

Since `k` can exceed the length, rotating by the length brings the list back to where it started, so only `k` modulo the length matters. That means the length has to be known first, which takes one walk to the end, and that same walk finds the old tail. The cut then falls after the node at position `length - (k % length)`.

## 4. Odd Even Linked List

**The statement.** [Odd Even Linked List](https://leetcode.com/problems/odd-even-linked-list/description/) gives the head of a linked list and asks for all nodes at odd positions, the first, third, fifth, and so on, to be grouped together, followed by all nodes at even positions, keeping the original order within each group. It must use a fixed amount of extra space and one pass. For `[1, 2, 3, 4, 5]` the result is `[1, 3, 5, 2, 4]`, and for `[2, 1, 3, 5, 6, 4, 7]` it is `[2, 3, 6, 7, 1, 5, 4]`, since the grouping is by position, not by value.

**Asks for.** The same nodes regrouped into a new order.

**Offers.** Nodes that can be split into two chains by alternating, and a space limit that rules out copying them into an array.

**Why it fits.** The fixed-space limit rules out collecting the nodes into an array and rebuilding. What is left is rewiring. Every odd node is followed by an even node, so the list splits into two chains by having each node skip the one after it, each odd node pointing to the next odd node and each even node to the next even node. Walking both chains together, one step each, does this in one pass.

Once both chains are built, the last odd node points to the first even node. That first even node has to be remembered before the split starts, since after the rewiring nothing in the odd chain points to it any more.

## 5. LRU Cache

**The statement.** [LRU Cache](https://leetcode.com/problems/lru-cache/description/) asks for a cache with a fixed capacity and two operations. `get(key)` returns the value stored for `key`, or `-1` if there is none, and counts as a use of that key. `put(key, value)` stores or updates the value and also counts as a use. If storing a new key goes over capacity, the key used longest ago is removed. Both operations have to run in constant time on average. With capacity `2`, after `put(1, 1)`, `put(2, 2)`, and `get(1)`, a `put(3, 3)` removes key `2`, since key `1` was used more recently.

**Asks for.** Lookup by key in constant time, together with keeping every key in order of last use, also in constant time.

**Offers.** The statement never mentions a list. What it offers is a sequence where any key can jump to the front, on every `get` and `put`, and the oldest key leaves from the back.

**Why it fits.** Each requirement alone has an easy answer, and each easy answer fails the other. A hash map finds a key in constant time but keeps no order of use. An array keeps the order, but moving a key from the middle to the front shifts everything between, which is not constant time.

A doubly linked list, where every node points both to the next node and to the previous one, can unhook a node from the middle and put it at the front in constant time, as long as we already have that node. A singly linked list cannot, since unhooking a node needs the node before it. The hash map supplies the missing piece, it maps each key to its node. So the map answers "where is this key", and the list answers "which key is oldest" and "move this key to the front". This is hashing and a linked list working together. The cue to look for is a demand for constant-time reordering, an element moving from anywhere to one end, which no array gives.

## What the five share

In every one, the answer is a new arrangement of the same nodes, a reversal, two groups, a rotation, a regrouping, an order of use, and nothing is copied. The work is redirecting `.next`. Three things go wrong in this kind of work, and each technique guards against one of them. Losing the rest of the list when a pointer changes, which saving the next node first prevents. A head that changes or a chain that starts empty, which a dummy node handles. And a last node left pointing into its old place, which ending each new chain with nothing prevents. When a problem needs a position inside a list but never redirects a pointer, it belongs to [Two Pointers](../two-pointers/asking-the-right-questions.md). When it needs constant-time reordering and never says "list", the list is hidden, as in LRU Cache.
