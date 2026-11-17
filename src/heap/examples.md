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

## Repeated Extreme

[Last Stone Weight](https://leetcode.com/problems/last-stone-weight/description/) gives the weights of some stones. Each turn, the two heaviest stones are smashed together. If they weigh the same, both are destroyed. Otherwise the lighter one is destroyed and the heavier one loses the lighter one's weight. It asks for the weight of the last stone left, or `0` if none is left. For `[2, 7, 4, 1, 8, 1]` the answer is `1`.

**Asks for.** The two heaviest stones, again on every turn.

**Offers.** A collection that changes after every turn, two stones leave and sometimes one comes back lighter.

The gate passes, sorting the stones before every turn and taking the two largest would work. But the collection changes on every turn, so sorting each time costs `n log n` per turn. This is the data-changes row of the cost table. A max-heap gives the heaviest in `log n`, and a leftover stone goes back in at `log n` too.

```
heap (heaviest first)    smash    result
8 7 4 2 1 1              8, 7     1 goes back
4 2 1 1 1                4, 2     2 goes back
2 1 1 1                  2, 1     1 goes back
1 1 1                    1, 1     both destroyed
1                        one stone left, answer 1
```

```javascript
{{#include ./examples/last-stone-weight.js}}
```

## Sort Plus Heap

[Single-Threaded CPU](https://leetcode.com/problems/single-threaded-cpu/description/) gives a list of tasks, where `tasks[i] = [enqueueTime, processingTime]`. A CPU runs one task at a time, start to finish. When it is free, it chooses among the tasks that have already arrived the one with the shortest processing time, breaking ties by the smaller index. If no task has arrived, it waits for the next one. It asks for the order the tasks are run in. For `[[1, 2], [2, 4], [3, 2], [4, 1]]` the answer is `[0, 2, 3, 1]`.

**Asks for.** The next task to run, chosen again every time the CPU is free.

**Offers.** Tasks that become available over time, and a rule for picking among the available ones.

Two different orders are in play. Tasks become available in order of arrival time, which never changes, so sorting the task indices by arrival time once is enough. Among the available tasks, the next one to run is the shortest, and that set changes every time a task arrives or finishes. That is the data-changes row of the cost table, so the available tasks go in a heap, shortest first, with the index breaking ties.

The loop keeps a clock. Before each choice, every task that has arrived by the current time moves from the sorted list into the heap. The top of the heap runs, and the clock moves forward by its processing time. If the heap is empty and the next task has not arrived yet, the CPU is idle, so the clock jumps straight to that task's arrival time instead of ticking forward one step at a time.

```
time  arrive into heap     heap (shortest first)   run   time after
0     none, idle, jump     -                       -     1
1     task 0               0 (2)                   0     3
3     tasks 1, 2           2 (2), 1 (4)            2     5
5     task 3               3 (1), 1 (4)            3     6
6     none                 1 (4)                   1     10
order [0, 2, 3, 1]
```

```javascript
{{#include ./examples/single-threaded-cpu.js}}
```

[IPO](https://leetcode.com/problems/ipo/description/) starts with capital `w` and allows at most `k` projects. Project `i` needs at least `capital[i]` to start, and when finished, adds `profits[i]` to the capital. Starting a project does not spend capital, it only requires it. It asks for the most capital possible after at most `k` projects. For `k = 2`, `w = 0`, `profits = [1, 2, 3]`, and `capital = [0, 1, 1]`, the answer is `4`.

**Asks for.** The best project to take next, `k` times.

**Offers.** Projects that become affordable as capital grows, and capital that only ever grows.

Capital never goes down, so a project that is affordable stays affordable. That makes the greedy choice safe, among the projects that can be started now, take the most profitable. A smaller profit now can never unlock something a larger profit would not, since a larger profit leaves at least as much capital.

The structure is the same as Single-Threaded CPU. Sorting the projects by the capital they need gives the order in which they become affordable, and that order never changes, so it is sorted once. The affordable projects form a set that grows after every project, and the most profitable one is needed each time, so their profits go in a max-heap. Before each choice, every project whose requirement is now met moves into the heap. If the heap is empty, nothing can be started, and the answer is the capital so far.

```
step  capital  newly affordable          heap        take  capital after
1     0        project 0 (profit 1)      1           1     1
2     1        projects 1, 2 (2 and 3)   3 2         3     4
answer 4
```

```javascript
{{#include ./examples/ipo.js}}
```
