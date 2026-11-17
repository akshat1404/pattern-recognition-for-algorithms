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
