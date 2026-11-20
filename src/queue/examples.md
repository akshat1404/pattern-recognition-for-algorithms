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
