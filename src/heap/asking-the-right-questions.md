# Heap: Asking the Right Questions

## Seeing it in a statement

Every problem statement has two parts. What it asks for, the shape of the answer. What it offers, the structure in the input we can lean on. A heap only knows order, which element is smallest, then which is next, and so on. So anything a heap can compute, sorting can compute too, even if slowly, by sorting again after every change. That gives the first check, and it comes before anything else.

**The gate.** Would sorting give the answer, sorting again after every change if the data changes? If it would not, the problem is not a heap problem, and no heap will help.

**The cost.** If sorting would give the answer, the choice between sorting and a heap is about time and nothing else.

| Situation | Sort | Heap | Use |
|---|---|---|---|
| Nothing changes, the full order is needed | `n log n` once | no gain | Sort |
| Nothing changes, only the top `k` are needed | `n log n` | `n log k` | Heap |
| Data changes, the top is needed after each change | `n log n` per change | `log n` per change | Heap |

A heap gives up the full order and keeps only which element is on top. Reading the top costs nothing, and each change costs `log n`, where a sorted array pays `n` to keep everything in place.

| Asks for | Offers | Use |
|---|---|---|
| The `k` largest, smallest, or closest | A fixed collection, with `k` much smaller than its size | Heap of size `k`, whose top is the one to throw out |
| The `k`th largest, or the extreme, after every update | Items arriving one at a time | A heap that takes in each arrival |
| The middle value after every update | Items arriving one at a time | Two heaps, one for the lower half and one for the upper half |
| The next smallest across several sorted sources | Sources where only the front of each can be next | Heap of the fronts |
| The best next choice at every step of a greedy process | Choices that change after being used | Heap of the choices, take the top, update it, put it back |

If the answer depends on position, the nearest greater element, the maximum of every window, then sorting the input destroys the information the problem needs, the problem fails the gate, and it belongs to [Stack](../stack/asking-the-right-questions.md) or [Sliding Window](../sliding-window/asking-the-right-questions.md).

Five problems follow, each read from its statement to the pattern. No code here, the code lives in Implementation and Examples.

## 1. K Closest Points to Origin

**The statement.** [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/description/) gives a list of points on a plane, each as `[x, y]`, and a number `k`, and asks for the `k` points closest to the origin `[0, 0]`, in any order. Distance is ordinary straight-line distance. For `[[3, 3], [5, -1], [-2, 4]]` with `k = 2`, the answer is `[[3, 3], [-2, 4]]`.

**Asks for.** The `k` smallest by distance.

**Offers.** A fixed list of points, and `k` that can be much smaller than the list.

**Why it fits.** The gate passes, sorting the points by distance and taking the first `k` answers it. Nothing changes afterwards, so the only question is cost. Sorting ranks every point when only `k` of them matter. A heap that never holds more than `k` points does less work, `n log k` instead of `n log n`.

The heap that does this is ordered with the farthest point on top, which looks backwards at first. It holds the `k` closest points seen so far, and its top is the worst of them, the one to throw out when a closer point arrives. Comparing squared distances, `x² + y²`, gives the same order as real distances and avoids square roots.

## 2. Kth Largest Element in a Stream

**The statement.** [Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/description/) asks for a class that starts with a number `k` and a list of numbers. Each call `add(val)` adds one more number and returns the `k`th largest of all numbers so far. With `k = 3` and starting numbers `[4, 5, 8, 2]`, the calls `add(3)`, `add(5)`, `add(10)`, `add(9)`, `add(4)` return `4`, `5`, `5`, `8`, `8`.

**Asks for.** The `k`th largest, after every update.

**Offers.** Numbers arriving one at a time.

**Why it fits.** The gate passes, sorting everything after each `add` and reading the `k`th from the top would work. But the data changes on every call, so sorting each time costs `n log n` per call. This is the third row of the cost table.

Only the `k` largest numbers ever matter, since anything smaller than all of them can never become the `k`th largest, the collection only grows. So a heap keeps exactly those `k`, with the smallest of them on top, which is the `k`th largest itself. A new number smaller than the top changes nothing. A bigger one replaces the top. Each call costs `log k`.

## 3. Find Median from Data Stream

**The statement.** [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/description/) asks for a class with two operations, `addNum(num)`, which adds a number, and `findMedian()`, which returns the median of all numbers added so far. The median is the middle value in sorted order, or the average of the two middle values when the count is even. After adding `1` and `2` the median is `1.5`, and after adding `3` it is `2`.

**Asks for.** The middle value after every update.

**Offers.** Numbers arriving one at a time.

**Why it fits.** The gate passes, sorting after every `addNum` and reading the middle works. The data changes on every call, so a heap is worth it, but a single heap only gives the very top, and the median sits in the middle.

The middle is the top of something, though. Split the numbers into a lower half and an upper half. The median is the largest number of the lower half, the smallest of the upper half, or the average of the two. So keep two heaps, the lower half with its largest on top and the upper half with its smallest on top, and keep their sizes equal or off by one. Each new number goes into one half, and if the sizes drift apart, one top moves across. Both tops are always in view, so the median costs nothing to read.

## 4. Merge k Sorted Lists

**The statement.** [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/description/) gives an array of `k` linked lists, each sorted in ascending order, and asks for them merged into one sorted list. For `[[1, 4, 5], [1, 3, 4], [2, 6]]`, the result is `[1, 1, 2, 3, 4, 4, 5, 6]`.

**Asks for.** The next smallest node, over and over, until every node is placed.

**Offers.** `k` sources that are each sorted already, so only the front of each can be next.

**Why it fits.** The gate passes, collecting every node and sorting them works, at `N log N` for `N` nodes in total. But it throws away the fact that each list is sorted already. At any moment, the next node of the answer has to be the front of one of the lists, since everything behind a front is at least as big. So only `k` nodes ever compete.

A heap of the `k` fronts, smallest on top, gives the next node. Take it, attach it to the answer, and put the next node from the same list into the heap in its place. The heap never holds more than `k` nodes, so each step costs `log k`, and the whole merge costs `N log k`. This is the data-changes row of the cost table, the set of fronts changes every time one is taken.

## 5. Reorganize String

**The statement.** [Reorganize String](https://leetcode.com/problems/reorganize-string/description/) gives a string and asks for its characters rearranged so that no two neighbors are the same character, returning any such arrangement, or `""` if none exists. `"aab"` becomes `"aba"`, and `"aaab"` has no answer, so it returns `""`.

**Asks for.** The best next character at every step of building the result.

**Offers.** Character counts that go down each time a character is used.

**Why it fits.** The character with the most copies left is the hardest to place, so the greedy move is to place it as early as possible, as long as it differs from the character just placed. That choice repeats at every position, and the counts change after each one. The gate passes, re-sorting the counts after every placement and picking from the top would work. Doing that at every step is the third row of the cost table, so a heap of characters by count, most copies on top, takes its place.

At each step, take the top, place it, and lower its count. The character just placed is held out of the heap for one step, so it cannot be chosen again right away, and it goes back in, if copies remain, after the next placement. If the heap ever runs out while characters are being held out, no arrangement exists. That happens exactly when one character has more copies than half the length, rounded up, which can also be checked before starting.

## What the five share

In every one, sorting would give the answer, which is the gate. In every one, the full sorted order is more than the problem needs, either because only the top `k` matter or because the top has to be read again after each change, which is why a heap beats sorting. And in every one, the heap holds only the candidates that can still be the answer, the `k` closest so far, the `k` largest so far, two halves, the `k` fronts, the characters with copies left. When the answer depends on where elements sit rather than how they rank, sorting fails, and so does a heap.
