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
0 0 0        0 0 0
0 1 0   ->   0 1 0
1 1 1        1 2 1
```

**Asks for.** The fewest steps from each cell to the nearest `0`.

**Offers.** A grid where each step reaches the four neighbors, and many cells that count as a start.

The first idea is to search outward from each `1` until a `0` is found. That repeats a search for every cell, and most of those searches cover the same ground. Turning the question around removes the repetition. Instead of every `1` looking for its nearest `0`, every `0` spreads outward at the same time, one step per round. The first round reaches every cell at distance `1`, the second every cell at distance `2`, and the first time a cell is reached, that round is its distance.

This is Rotting Oranges with zeros in place of rotten oranges. A queue keeps the rounds in order without counting them. Start it with every `0`, all at distance `0`. Taking a cell from the front and adding its unreached neighbors to the back, with distance one more, puts every cell of distance `d + 1` behind all cells of distance `d`. A cell is marked the moment its distance is set, so it never joins the queue twice.

```
round  cells reached                   distance
start  every 0 (five cells)            0
1      (1,1), (2,0), (2,2)             1
2      (2,1)                           2
```

`(2,1)` has no `0` next to it. Its neighbors, `(1,1)`, `(2,0)`, and `(2,2)`, are all `1`s reached in round `1`, so it is reached in round `2`. Each cell joins the queue once, so the whole grid costs one pass.

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
