# Linked List: Examples

Worked problems, reasoning and code together, one technique at a time. Every example uses the same node shape.

```javascript
{{#include ./examples/list-node.js}}
```

## Reversal

[Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/description/) gives the head of a linked list and asks for every two adjacent nodes to be swapped, returning the new head. The nodes themselves have to move, swapping the values inside them is not allowed. `[1, 2, 3, 4]` becomes `[2, 1, 4, 3]`, `[1, 2, 3]` becomes `[2, 1, 3]` since the last node has no partner, and `[]` stays `[]`.

**Asks for.** The same nodes, with each pair reversed.

**Offers.** `.next` pointers that can be redirected, and a head that changes, since `2` becomes the first node.

Swapping a pair is a reversal of two nodes. The first node of the answer changes, `2` instead of `1`, so a dummy node in front of the head gives the first pair a node before it, the same as every later pair has. With `prev` standing on the node before a pair, the pair is `first = prev.next` and `second = first.next`, and three pointers change.

```
before:  prev -> first -> second -> rest
after:   prev -> second -> first -> rest
```

`first.next` becomes `rest`, which is `second.next`, so it has to be set before `second.next` is changed. Then `second.next` becomes `first`, and `prev.next` becomes `second`. After the swap, `first` is the last node of the pair and sits right before the next pair, so it becomes the new `prev`. The loop stops when fewer than two nodes are left after `prev`.

Take `[1, 2, 3, 4]`.

```
prev   first  second  list after the swap
dummy  1      2       dummy -> 2 -> 1 -> 3 -> 4
1      3      4       dummy -> 2 -> 1 -> 4 -> 3
3      stop, nothing left after prev
```

```javascript
{{#include ./examples/swap-nodes-in-pairs.js}}
```

[Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/description/) gives the head of a linked list and a number `k`, and asks for the nodes to be reversed `k` at a time, returning the new head. If the nodes left at the end are fewer than `k`, they stay in their original order. The nodes themselves have to move. `[1, 2, 3, 4, 5]` with `k = 2` becomes `[2, 1, 4, 3, 5]`, and with `k = 3` it becomes `[3, 2, 1, 4, 5]`.

**Asks for.** The same nodes, with each full group of `k` reversed.

**Offers.** Groups that can each be reversed with the plain reversal loop, and a head that changes.

Swap Nodes in Pairs is this problem with `k = 2`, but three hand-written pointer changes do not stretch to any `k`. What does stretch is treating each group as a short list of its own, reversing it with the loop from Implementation, and reconnecting it at both ends. Each group goes through three steps.

The first step is checking that a full group exists. From `groupPrev`, the node before the group, step forward `k` times. If the list runs out first, fewer than `k` nodes are left, and the work is done. Otherwise the step lands on `kth`, the last node of the group, and `groupNext = kth.next` is the first node after it.

The second step reverses the group. It is the plain reversal loop, with one change. Instead of starting `prev` at `null`, it starts at `groupNext`. The first node of the group is the first one turned around, so it ends up pointing to `groupNext`, which connects the back of the reversed group to the rest of the list with no extra step. The loop stops when it reaches `groupNext`.

The third step connects the front. The group's old first node is now its last, and `kth` is now its first. `groupPrev.next` becomes `kth`, and the old first node becomes the next group's `groupPrev`, since it now sits right before the next group. The dummy node gives the first group a `groupPrev`, which is what lets the head change without a special case.

Take `[1, 2, 3, 4, 5]` with `k = 3`.

```
groupPrev  kth  groupNext  after reversing and reconnecting
dummy      3    4          dummy -> 3 -> 2 -> 1 -> 4 -> 5
1          none, only 4 and 5 left, stop
result [3, 2, 1, 4, 5]
```

```javascript
{{#include ./examples/reverse-nodes-in-k-group.js}}
```
