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

[Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words/description/) gives a list of words and a number `k`, and asks for the `k` most frequent words, ordered from most to least frequent, with words of equal frequency ordered alphabetically. For `["i", "love", "leetcode", "i", "love", "coding"]` with `k = 2`, the answer is `["i", "love"]`, both appear twice and `"i"` comes first alphabetically. For `["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"]` with `k = 4`, the answer is `["the", "is", "sunny", "day"]`.

**Asks for.** The top `k` by a two-part rank, count first and then alphabetical order.

**Offers.** Words that can be counted, and a ranking that only needs its top `k` places.

Counting is the Frequency bucket from Hashing, a map from each word to its count. What is left is the top `k` of those counts, the same shape as Kth Largest, with a richer comparison.

The heap keeps the `k` best words seen so far, with the worst of them on top, since the top is the one to throw out. Worst means the lower count, and for equal counts, the word that comes later alphabetically, since an earlier word ranks higher. So the compare function puts a lower count first, and for equal counts, the alphabetically larger word first. Getting that second rule backwards is the usual mistake here, and it only shows up on ties.

Popping the heap at the end gives the `k` best from worst to best, since the worst is always on top. Reversing that list gives the order the problem asks for.

```
counts  the 4, is 3, sunny 2, day 1
heap of size 4 keeps all four, worst on top
pops    day, sunny, is, the
reverse the, is, sunny, day
```

```javascript
{{#include ./examples/top-k-frequent-words.js}}
```
