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
