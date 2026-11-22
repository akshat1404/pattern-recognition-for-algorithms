# Queue: Examples

Worked problems, reasoning and code together, one queue shape at a time.

## Turns

[Time Needed to Buy Tickets](https://leetcode.com/problems/time-needed-to-buy-tickets/description/) puts `n` people in a line, where person `i` wants to buy `tickets[i]` tickets. Each second, the person at the front buys one ticket. If they still need more, they go to the back of the line, and if they are done, they leave. It asks for the number of seconds until person `k`, counting from `0`, has bought all their tickets. For `tickets = [2, 3, 2]` and `k = 2` the answer is `6`, and for `tickets = [5, 1, 1, 1]` and `k = 0` it is `8`.

**Asks for.** The time at which one person finishes.

**Offers.** Turns in arrival order, where an unfinished person goes to the back.

The queue question settles it. Among the people waiting, the next to buy is always the one at the front, who has waited longest, and a person who buys goes behind everyone still waiting. That is a queue, and the statement describes the simulation outright. Each second, take the front person, lower their count by one, and add a second. If that was person `k` and they are done, the time is the answer. Otherwise, if they still need tickets, they go to the back.

The queue holds each person's index, with the count of tickets left kept separately.

```
sec  front      after           queue
1    0 (2)      0 needs 1       1(3) 2(2) 0(1)
2    1 (3)      1 needs 2       2(2) 0(1) 1(2)
3    2 (2)      2 needs 1       0(1) 1(2) 2(1)
4    0 (1)      0 is done       1(2) 2(1)
5    1 (2)      1 needs 1       2(1) 1(1)
6    2 (1)      2 is done, answer 6
```

JavaScript arrays have `shift()`, which takes the first element, but it moves every other element down one place, so it costs time proportional to the length. The code keeps a `head` index instead, pointing at the front, and taking from the front is just moving `head` forward. The limits here are small, at most `100` people wanting at most `100` tickets each, so the simulation runs at most `10,000` steps either way.

There is also an answer with no queue at all. Before person `k` finishes, each person ahead of `k`, and `k` themselves, buys up to `tickets[k]` tickets, since they get a turn in every round that `k` does. Each person behind `k` buys up to `tickets[k] - 1`, since `k` finishes in the final round before those people get their turn in it. So the answer is the sum of `min(tickets[i], tickets[k])` for everyone up to `k`, and `min(tickets[i], tickets[k] - 1)` for everyone after. For `[2, 3, 2]` with `k = 2`, that is `2 + 2 + 2 = 6`. The queue is the direct reading of the statement, and the counting is what it turns into once the rounds are understood.

```javascript
{{#include ./examples/time-needed-to-buy-tickets.js}}
```

[Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game/description/) seats `n` friends in a circle, numbered `1` to `n` clockwise. Starting at friend `1`, count `k` friends clockwise, including the one counting starts on, wrapping around the circle. The last friend counted leaves, and counting starts again from the friend just clockwise of the one who left. The last friend remaining wins. It asks for the winner's number. For `n = 5` and `k = 2` the answer is `3`, friends leave in the order `2`, `4`, `1`, `5`. For `n = 6` and `k = 5` it is `1`.

**Asks for.** The last one standing after repeated removals.

**Offers.** A circle that is counted around again and again.

A circle has no front, but counting around it can be read as a line. Put the friends in a queue, starting with friend `1` at the front. Counting past a friend means that friend is not leaving this time and will come around again, after everyone else, which is the back of the queue. So counting `k` friends is `k - 1` moves from the front to the back, and then the friend at the front is the `k`th one counted, and leaves.

After someone leaves, the friend now at the front is the one just clockwise of them, which is exactly where the next count starts. No extra step is needed. The loop stops when one friend is left.

```
queue          move to back   leaves   queue after
1 2 3 4 5      1              2        3 4 5 1
3 4 5 1        3              4        5 1 3
5 1 3          5              1        3 5
3 5            3              5        3
winner 3
```

The same game can be played on an array, marking each friend who leaves, for example with `'_'`, and skipping marked slots while counting. That works, but marked slots never go away. Near the end, most of the array is marked, and every count walks past them, so the cost grows well beyond the queue's. The queue never visits a friend who has left, because they are gone.

There is also an answer with no structure at all, the Josephus recurrence. Number the friends from `0`. With one friend, the winner is position `0`. Adding a friend shifts the winner's position by `k`, wrapping around the new circle size, so `winner = (winner + k) % m` for each size `m` from `2` to `n`, with `1` added at the end for numbering from `1`. For `n = 5` and `k = 2`, the position goes `0`, `0`, `2`, `0`, `2`, and the winner is friend `3`. It runs in `n` steps, against `n × k` for the queue, and the queue is how to see the game before the formula is known.

```javascript
{{#include ./examples/find-the-winner-of-the-circular-game.js}}
```

## Expiry

[Number of Recent Calls](https://leetcode.com/problems/number-of-recent-calls/description/) asks for a counter with one operation, `ping(t)`, which records a request at time `t` in milliseconds and returns how many requests happened in the last `3000` milliseconds, from `t - 3000` to `t`, this one included. Each call's `t` is larger than the one before. The calls `ping(1)`, `ping(100)`, `ping(3001)`, `ping(3002)` return `1`, `2`, `3`, `3`.

**Asks for.** A count over only the recent requests.

**Offers.** Requests that arrive in time order, and so stop counting in that same order.

The queue question settles it. Among the requests still counted, the next to stop counting is always the oldest, since times only go up and the window's left edge `t - 3000` only moves forward. So each new request joins the back, and before counting, requests leave from the front for as long as the front is older than `t - 3000`. What is left is exactly the requests in the window, and the answer is how many there are.

```
ping   window          leave from front   queue after          answer
1      -2999 to 1      none               1                    1
100    -2900 to 100    none               1 100                2
3001   1 to 3001       none               1 100 3001           3
3002   2 to 3002       1                  100 3001 3002        3
```

At `3001` the window starts at `1`, so the request at `1` still counts. At `3002` it starts at `2`, and that request is the first to leave. As in the other examples, a `head` index marks the front, so dropping an expired request is moving `head` forward, and the count is the distance from `head` to the end.

```javascript
{{#include ./examples/number-of-recent-calls.js}}
```

## Spreading

[01 Matrix](https://leetcode.com/problems/01-matrix/description/) gives a grid of `0`s and `1`s and asks for a grid of the same size where each cell holds its distance to the nearest `0`, moving up, down, left, or right one cell at a time. For the grid on the left, the answer is the grid on the right.

```
0 1 1 1        0 1 2 2
1 1 1 1   ->   1 2 2 1
1 1 1 0        2 2 1 0
```

The top-right cell is three steps from the top-left `0` but only two from the bottom-right `0`, so its answer is `2`.

**Asks for.** The fewest steps from each cell to the nearest `0`.

**Offers.** A grid where each step reaches the four neighbors, and many cells that count as a start.

The first idea is to search outward from each `1` until a `0` is found. That works, but every cell runs its own search, and most of those searches cover the same ground. Turning the question around removes the repetition. Instead of every `1` looking for its nearest `0`, every `0` spreads outward at the same time, one step per round. In each round, every unlabeled cell next to a cell labeled in the round before gets that label plus one.

```
round 0, the zeros    round 1, next to a 0    round 2, next to a 1
0 ? ? ?               0 1 ? ?                 0 1 2 2
? ? ? ?               1 ? ? 1                 1 2 2 1
? ? ? 0               ? ? 1 0                 2 2 1 0
```

The first label a cell gets is its answer, and it never changes. Both zeros spread at the same speed, so a cell is reached first by the spread from whichever `0` is closest. The top-right cell is reached from the bottom-right `0` in round `2`, while the top-left `0` would need round `3`, and by then the cell is already labeled.

The queue keeps the rounds in order without counting them. It starts with every `0`, all at distance `0`, before any spreading happens. Then a cell is taken from the front, and each of its unlabeled neighbors gets its distance plus one and joins the back. New cells always join behind the ones already waiting, so every cell of round `d` sits ahead of every cell of round `d + 1`.

```
queue at the start     (0,0) (2,3)                            the 0s
after those two        (1,0) (0,1) (1,3) (2,2)                the 1s
after the 1s           (2,0) (1,1) (0,2) (0,3) (1,2) (2,1)    the 2s
```

A cell is labeled the moment it joins the queue, so it never joins twice, and the whole grid costs one pass.

Starting the queue with every source at once is multi-source BFS, covered in Implementation, and this is the same algorithm as Rotting Oranges from the questions page. Only the details differ.

| | Rotting Oranges | 01 Matrix |
|---|---|---|
| Sources | Every rotten orange | Every `0` |
| Spreads into | Fresh oranges, empty cells block it | Every cell, nothing blocks it |
| Answer | The last round, one number | Each cell's own round, a whole grid |
| Unreachable cells | Possible, answer `-1` | Impossible, every cell is reached |

```javascript
{{#include ./examples/01-matrix.js}}
```

[Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/description/) gives an `n × n` grid of `0`s and `1`s and asks for the length of the shortest clear path from the top-left cell to the bottom-right cell. A clear path only uses `0` cells and moves to any of the eight neighbors, including diagonals. Its length is the number of cells on it, start and end included. If there is no clear path, the answer is `-1`. `[[0, 1], [1, 0]]` gives `2`, by one diagonal step, and the grid below gives `4`.

```
0 0 0
1 1 0
1 1 0
```

**Asks for.** The fewest cells on a path from one corner to the other.

**Offers.** A grid where each step reaches up to eight neighbors, and a single start.

This is spreading from one start instead of many. Each round reaches the cells one step further from the top-left, so the round in which the bottom-right cell is first reached is the length of a shortest path. The queue keeps the rounds in order, exactly as in 01 Matrix. The start has length `1`, since the length counts cells, and every cell added to the queue has the length of the cell it came from plus one.

```
round  cells reached     length
start  (0,0)             1
1      (0,1)             2
2      (0,2), (1,2)      3
3      (2,2)             4
```

`(1,2)` is reached from `(0,1)` by a diagonal step, which is why it arrives in the same round as `(0,2)`. Then `(2,2)`, the bottom-right, is reached from `(1,2)` with length `4`.

One detail matters for speed. A cell is marked as reached when it joins the queue, not when it leaves. Several cells in the same round can share a neighbor, and if marking waited until the neighbor left the queue, it could be added once by each of them. Marking on joining keeps every cell in the queue at most once. If either corner is a `1`, there is no clear path at all, and the answer is `-1` before any search.

```javascript
{{#include ./examples/shortest-path-in-binary-matrix.js}}
```

[Open the Lock](https://leetcode.com/problems/open-the-lock/description/) gives a lock with four wheels, each showing a digit from `0` to `9` that wraps around, so `9` turns up to `0` and `0` turns down to `9`. The lock starts at `"0000"`, and one turn moves one wheel one slot up or down. Some combinations, listed in `deadends`, jam the lock, so the lock can never show them. It asks for the fewest turns to reach `target`, or `-1` if it cannot be reached. With `deadends = ["8888"]` and `target = "0009"` the answer is `1`, a single turn of the last wheel down. With `deadends = ["0201", "0101", "0102", "1212", "2002"]` and `target = "0202"` it is `6`.

**Asks for.** The fewest moves from one combination to another.

**Offers.** Combinations where each move changes one digit by one, which makes each combination a state with eight neighbors.

There is no grid in the statement, which is what makes this hard to recognize. But the shape is the same as Shortest Path in Binary Matrix. Each combination is a cell, two combinations one turn apart are neighbors, and the deadends are blocked cells. Every combination has eight neighbors, two turns for each of four wheels. "Fewest moves between two configurations, each move changing the configuration a little" is the cue for BFS on states.

BFS from `"0000"` reaches combinations in order of how many turns they take. Round `1` reaches the eight combinations one turn away, round `2` everything two turns away, and so on, so the first time `target` is reached, it is reached in the fewest turns. A set holds every combination already reached, and the deadends go into it at the start, so they are treated as already visited and never entered. If `"0000"` is itself a deadend, the lock cannot move at all.

```
round  combinations reached                                         count
0      0000                                                         1
1      1000 9000 0100 0900 0010 0090 0001 0009                      8
```

With `target = "0009"`, the target appears in round `1`, so the answer is `1`. In the second example, the direct route to `"0202"` takes four turns, but every four-turn route passes through a deadend, `0201`, `0101`, or `0102`, depending on the order of the turns. BFS does not need to know that. It keeps spreading around the blocked combinations and first reaches `"0202"` in round `6`. There are only `10,000` combinations, so even a full search is small.

```javascript
{{#include ./examples/open-the-lock.js}}
```

## Deque

[Jump Game VI](https://leetcode.com/problems/jump-game-vi/description/) gives an array `nums` and a number `k`. Starting at index `0`, each jump goes forward from index `i` to any index from `i + 1` to `i + k`. The score is the sum of `nums` at every index landed on, the first and last included. It asks for the highest score possible on reaching the last index. For `[1, -1, -2, 4, -7, 3]` with `k = 2` the answer is `7`, landing on `1`, `-1`, `4`, and `3`. For `[10, -5, -2, 4, 0, 3]` with `k = 3` it is `17`, landing on `10`, `4`, and `3`.

**Asks for.** The best score at the end, built from the best scores of the indices before it.

**Offers.** A choice at each index among only the previous `k` indices, a range whose both ends move forward together.

Let `best[i]` be the highest score that reaches index `i`. Any path to `i` arrives from one of the `k` indices before it, so `best[i]` is `nums[i]` plus the largest `best` among those `k`. Working that out by checking all `k` each time costs `n × k`, too slow when both are large.

The `k` indices before `i` form a window that slides forward one step at a time, and what each step needs is its maximum. That is Sliding Window Maximum over the `best` values, and the same deque keeps it. The deque holds indices whose `best` values fall from front to back. At each `i`, the front leaves if it has fallen out of reach, more than `k` behind. Then the front is the largest `best` in reach, and `best[i]` is `nums[i]` plus it. Before `i` joins the back, every index at the back with a `best` no larger than `best[i]` leaves, since `i` is later, so it stays in reach longer, and at least as good, so those indices can never be the best choice again.

Old indices leaving the front by age and beaten indices leaving the back is what makes this a deque, not a queue.

```
i  nums  front leaves?  best[i]       back leaves   deque after (best)
0  1                    1                           0 (1)
1  -1    no             -1 + 1 = 0    none          0 (1), 1 (0)
2  -2    no             -2 + 1 = -1   none          0 (1), 1 (0), 2 (-1)
3  4     0 is too far   4 + 0 = 4     2, 1          3 (4)
4  -7    no             -7 + 4 = -3   none          3 (4), 4 (-3)
5  3     no             3 + 4 = 7     4, 3          5 (7)
answer best[5] = 7
```

Every index joins the deque once and leaves it at most once, so the whole pass costs `n`.

```javascript
{{#include ./examples/jump-game-vi.js}}
```
