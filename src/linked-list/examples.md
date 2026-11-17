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

## Dummy Node

[Remove Duplicates from Sorted List II](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/description/) gives the head of a sorted linked list and asks for every node whose value appears more than once to be removed, keeping only the values that appear exactly once. `[1, 2, 3, 3, 4, 4, 5]` becomes `[1, 2, 5]`, and `[1, 1, 1, 2, 3]` becomes `[2, 3]`.

**Asks for.** Nodes removed by a rule.

**Offers.** A sorted list, so equal values sit next to each other, and a head that may be removed, as the second example shows.

Since the list is sorted, every value that repeats appears as one run of neighbors, so deciding whether a value repeats only needs a look at the next node. Removing a node means making the node before it skip it, so the walk stands on the last node that is being kept, called `prev`, and looks ahead at `prev.next`. The head can be part of a repeated run, so a dummy node goes in front of it, which gives every node, the head included, a node before it.

At each step there are two cases. If the node after `prev` has the same value as the one after that, the value repeats, so the walk moves forward past every node holding that value, and `prev.next` skips straight to the first node after the run. `prev` does not move, since the node now after it has not been checked yet and may start another run. If the value does not repeat, that node is kept, and `prev` moves onto it.

Take `[1, 1, 1, 2, 3]`.

```
prev   next value  repeats?  action                     list
dummy  1           yes       skip all the 1s            dummy -> 2 -> 3
dummy  2           no        keep it, prev moves to 2   dummy -> 2 -> 3
2      3           no        keep it, prev moves to 3   dummy -> 2 -> 3
3      none, stop
result [2, 3]
```

The run of `1`s included the head, and the dummy is what made that case look like any other.

```javascript
{{#include ./examples/remove-duplicates-from-sorted-list-ii.js}}
```

[Add Two Numbers](https://leetcode.com/problems/add-two-numbers/description/) gives two non-negative numbers stored as linked lists of digits, with the ones digit first, and asks for their sum as a list in the same form. `[2, 4, 3]` is `342` and `[5, 6, 4]` is `465`, so the answer is `[7, 0, 8]`, which is `807`. `[9, 9, 9, 9]` plus `[9, 9]` is `[8, 9, 0, 0, 1]`, `9999 + 99 = 10098`.

**Asks for.** A new list, built one node at a time.

**Offers.** Digits stored ones digit first, which is the order column addition works in.

Adding by hand starts at the ones column and moves left, carrying a `1` whenever a column reaches `10`. The lists hand over the digits in exactly that order, so the addition can walk both lists together from the head, with no reversing. Each step adds one digit from each list and the carry, writes `sum % 10` as the next node, and carries `Math.floor(sum / 10)` into the next step.

Unlike the other problems in this chapter, this one builds new nodes instead of rewiring old ones. The dummy node still applies, since the first node of the answer only exists once the first column is added. Building after a placeholder, with `tail` always on the last node built, means every digit is attached the same way.

The lists can have different lengths. When one runs out, it counts as `0` for the rest. And the loop does not stop just because both lists ran out, a carry may still be left, as in `9999 + 99`, where the final carry becomes a new last digit.

```
a    b    carry in  sum  digit  carry out
9    9    0         18   8      1
9    9    1         19   9      1
9    -    1         10   0      1
9    -    1         10   0      1
-    -    1         1    1      0
result [8, 9, 0, 0, 1]
```

```javascript
{{#include ./examples/add-two-numbers.js}}
```
