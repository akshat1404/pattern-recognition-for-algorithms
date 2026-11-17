# Heap: Examples

Worked problems, reasoning and code together, one heap shape at a time. Every example uses the heap class from Implementation, kept in one shared file.

```javascript
{{#include ./examples/heap.js}}
```

## Top k

[Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/description/) gives an unsorted array and a number `k`, and asks for the `k`th largest element, counting duplicates. For `[3, 2, 1, 5, 6, 4]` with `k = 2` the answer is `5`, and for `[3, 2, 3, 1, 2, 4, 5, 5, 6]` with `k = 4` it is `4`.

**Asks for.** One element by rank, the `k`th from the top.

**Offers.** A fixed array, where only the `k` largest values matter.

The gate passes, sorting the array from largest to smallest and reading position `k` gives the answer. Nothing changes afterwards, so the choice is about cost, and sorting ranks all `n` elements when only `k` of them matter. A heap of size `k` does the job in `n log k`.

The heap holds the `k` largest values seen so far, and it is a min-heap, which looks backwards at first. Its top is the smallest of the kept values, the one that has to leave when a bigger value arrives. Each value is pushed, and whenever the heap grows past `k`, the top is popped. When the walk ends, the heap holds exactly the `k` largest, and the smallest of them, the top, is the `k`th largest.

```
num  heap after push and trim   top
3    3                          3
2    2 3                        2
1    1 2 3, pop 1 -> 2 3        2
5    2 3 5, pop 2 -> 3 5        3
6    3 5 6, pop 3 -> 5 6        5
4    4 5 6, pop 4 -> 5 6        5
answer 5
```

```javascript
{{#include ./examples/kth-largest-element-in-an-array.js}}
```
