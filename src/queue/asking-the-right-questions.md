# Queue: Asking the Right Questions

## Seeing it in a statement

Every problem statement has two parts. What it asks for, the shape of the answer. What it offers, the structure in the input we can lean on. A queue is harder to spot than most patterns, because statements almost never say "queue", and the order a queue enforces, oldest first, is easy to mistake for no order at all. The Stack chapter rested on one sentence, the newest waiting element is decided first. The queue version is the mirror of it, **the oldest waiting element is handled first, and new elements wait at the back**.

That order shows up in a statement in three ways, and each has its own cues.

**Turns.** Elements act in the order they arrived, and an element that is not finished goes to the back to wait for its next turn. The cues are "in order", "takes turns", "round", "goes to the end of the line", "moves the top card to the bottom".

**Expiry.** Only recent items count, and items stop counting in the order they arrived, the oldest first. The cues are "in the last `t` milliseconds", "the most recent `k`", "within a time window".

**Spreading.** Something spreads one step at a time from one or more starting points, and the question is how many steps it takes. Everything reached in step `d` has to be handled before anything reached in step `d + 1`, and a queue gives exactly that, since the things reached in step `d + 1` are added behind all of step `d`. The cues are "every minute", "each step, to all neighbors", "minimum number of minutes", "fewest moves".

| Asks for | Offers | Use |
|---|---|---|
| Elements handled in the order they arrived, some coming back for another turn | Turns or rounds, where an element waits for its turn | Queue of waiting elements, front acts, back receives |
| A count or result over only the recent items | Items that expire in the order they arrived | Queue, dropping from the front while the front has expired |
| The fewest steps or rounds for something to spread or reach a target | A grid or graph where each step reaches the neighbors | Queue that handles one step at a time, breadth-first |
| The best value over a range where both ends move | Elements that leave from the front by age and from the back by being beaten | Deque, a queue that can also remove from the back |

If the newest waiting element is handled first, it is a [Stack](../stack/asking-the-right-questions.md). If the best element is handled first, regardless of when it arrived, it is a [Heap](../heap/asking-the-right-questions.md). A queue is the one where arrival time alone decides.

Five problems follow, each read from its statement to the pattern. No code here, the code lives in Implementation and Examples.

## 1. Number of Recent Calls

**The statement.** [Number of Recent Calls](https://leetcode.com/problems/number-of-recent-calls/description/) asks for a counter with one operation, `ping(t)`, which records a request at time `t` in milliseconds and returns how many requests happened in the last `3000` milliseconds, from `t - 3000` to `t`, counting this one. Each call's `t` is larger than the one before. The calls `ping(1)`, `ping(100)`, `ping(3001)`, `ping(3002)` return `1`, `2`, `3`, `3`.

**Asks for.** A count over only the recent requests.

**Offers.** Requests that arrive in time order and stop counting in that same order.

**Why it fits.** Times only go up, so the request that drops out of the window first is always the oldest one still counted. At `ping(3002)`, the window is `2` to `3002`, and the request at `1` falls out, the first one that arrived. Every new request joins at the back, and expired requests leave from the front, so the requests in the window are a queue. The answer is its length after the front has been trimmed. A heap would also find the oldest, but the order of arrival is already the order of expiry, so nothing has to be compared.

## 2. Dota2 Senate

**The statement.** [Dota2 Senate](https://leetcode.com/problems/dota2-senate/description/) gives a string of `'R'` and `'D'`, one letter per senator, from two parties, Radiant and Dire. Voting happens in rounds, and in each round the senators act in the string's order. When a senator acts, they either ban one other senator, who then loses all rights in this and every later round, or, if every senator still voting is from their own party, they announce victory. Banned senators are skipped. Every senator plays as well as possible for their party. It asks which party wins. `"RD"` returns `"Radiant"`, and `"RDD"` returns `"Dire"`.

**Asks for.** The party left after senators take turns removing each other.

**Offers.** Turns in a fixed order, round after round, where a senator who acts comes back for the next round.

**Why it fits.** The best move for a senator is to ban the next opposing senator who would act, since that is the opponent about to do damage soonest. That makes the whole round a comparison of who comes up next on each side. Keep the senators of each party in their own queue, by position. The two fronts are the next senator from each party, and whichever has the smaller position acts first and bans the other front. The banned senator leaves for good. The one who acted is not done, they act again next round, after everyone still waiting this round, so they go to the back of their party's queue with a position past the end of the string. When one queue is empty, the other party wins.

The cue is "rounds" together with "in order". Senators come back again and again, always behind everyone who has not acted yet, which is a queue's back.

## 3. Rotting Oranges

**The statement.** [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/description/) gives a grid where each cell is `0` for empty, `1` for a fresh orange, or `2` for a rotten one. Every minute, each fresh orange next to a rotten one, up, down, left, or right, becomes rotten. It asks for the fewest minutes until no fresh orange is left, or `-1` if some can never rot. For the grid below the answer is `4`.

```
2 1 1
1 1 0
0 1 1
```

**Asks for.** The number of minutes for something to spread everywhere it can reach.

**Offers.** A grid where each minute reaches the neighbors of everything already reached, starting from every rotten orange at once.

**Why it fits.** Minute `1` rots the neighbors of the oranges rotten at the start. Minute `2` rots the neighbors of those, and so on. Every orange rotted in minute `d` has to spread before any orange rotted in minute `d + 1` does, otherwise the count of minutes comes out wrong. A queue keeps that order on its own. Start it with every rotten orange, all of minute `0`. Taking an orange from the front and putting its fresh neighbors at the back means every orange of minute `d + 1` sits behind all of minute `d`. Handling the queue one minute's worth at a time counts the minutes. If fresh oranges remain when the queue is empty, they were never reachable, and the answer is `-1`.

This is breadth-first search, BFS, and the cue for it is "every minute" or "each step" together with "neighbors" and "fewest". Starting the queue with all the rotten oranges together, instead of one at a time, is called multi-source BFS. It is what makes the minutes come out right when several sources spread at once, since each fresh orange is reached first by the nearest rotten one.

## 4. Reveal Cards In Increasing Order

**The statement.** [Reveal Cards In Increasing Order](https://leetcode.com/problems/reveal-cards-in-increasing-order/description/) gives a deck of cards with distinct numbers. The deck is revealed by repeating two steps until it is empty: take the top card and reveal it, then, if cards remain, move the next top card to the bottom. It asks for the deck arranged so that the cards are revealed in increasing order. For `[17, 13, 11, 2, 3, 5, 7]` the answer is `[2, 13, 3, 11, 5, 17, 7]`.

**Asks for.** A starting order that a fixed process turns into increasing order.

**Offers.** A process that takes from the top and moves cards to the bottom, which is a queue's front and back.

**Why it fits.** The process does not depend on the numbers on the cards, only on their positions. So run the process on the positions themselves, `0` to `n - 1`, in a queue. Taking the front gives the position revealed first, then the front moves to the back, and taking the front again gives the position revealed second, and so on. That gives the order in which positions are revealed. The smallest card goes in the position revealed first, the next smallest in the position revealed second, and so on. "Move the top card to the bottom" is the cue, it is a queue's rotation, taking from the front and adding to the back.

## 5. Shortest Subarray with Sum at Least K

**The statement.** [Shortest Subarray with Sum at Least K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/description/) gives an array that may contain negative numbers and a number `k`, and asks for the length of the shortest non-empty contiguous subarray with a sum of at least `k`, or `-1` if there is none. For `[2, -1, 2]` with `k = 3` the answer is `3`, and for `[1, 2]` with `k = 4` it is `-1`.

**Asks for.** The shortest contiguous stretch that reaches a threshold.

**Offers.** Negative numbers, which break the sliding window's direction check, and prefix sums whose candidates leave from both ends.

**Why it fits.** Without negative numbers, this would be Minimum Size Subarray Sum, a sliding window. With them, adding an element can lower the sum, so trimming the left edge is no longer guaranteed to help, the direction check from Sliding Window fails. Prefix sums take over. A stretch from `i` to `j - 1` sums to `P[j] - P[i]`, so for each end `j`, the question is the latest start `i` with `P[i] <= P[j] - k`.

The candidates for `i` leave from both ends. From the front, once a start `i` has reached the threshold with some `j`, any later `j` would only give a longer stretch, so `i` is done and leaves. From the back, if a new prefix `P[j]` is at most the prefix of the last candidate, that candidate can never be the best start, since `j` is both later and no bigger, so it leaves. A structure that drops old items from the front and beaten items from the back is a deque. The cue for a deque is a range over prefix sums or positions where both ends move, usually after a sliding window has been ruled out.

## What the five share

In every one, the order things are handled in is decided by when they arrived, not by their values. Requests expire oldest first, senators act in turn order and come back behind everyone else, oranges spread minute by minute, positions are revealed in the order the deck rotates, prefix sums leave the front by age. The statement rarely says "queue". It says "in order", "takes turns", "round", "moves to the bottom", "every minute", "in the last `t` milliseconds". When the order is the newest first, the problem belongs to a stack, and when it is the best first, to a heap.

## Standard queue patterns

Most queue problems are one of a handful of named shapes. Each has its own cue in the statement.

| Pattern | Cue in the statement | Classic problems | Where |
|---|---|---|---|
| Round-robin simulation | "takes turns", "goes to the back", "every `k`th one leaves" | Time Needed to Buy Tickets, Dota2 Senate, Find the Winner of the Circular Game | Examples |
| Time window, expiry | "in the last `t` milliseconds", "the most recent `k`" | Number of Recent Calls, Design Hit Counter, Logger Rate Limiter | Examples |
| Single-source BFS | "fewest steps from one place to another", on a grid or graph where every step costs the same | Shortest Path in Binary Matrix, Nearest Exit from Entrance in Maze | Examples |
| Multi-source BFS | "nearest of many", "spreads from all of them at once", "every minute" | Rotting Oranges, 01 Matrix, As Far from Land as Possible | Examples |
| BFS on states | "fewest moves" or "fewest changes", where each position is a state, such as a combination or a word, not a cell | Open the Lock, Word Ladder, Minimum Genetic Mutation | Examples |
| Level-order traversal | "level by level", "at each depth", in a tree | Binary Tree Level Order Traversal, Binary Tree Right Side View | Trees, not written yet |
| Topological sort | "prerequisites", "order the tasks so each comes after what it depends on" | Course Schedule, Course Schedule II | Graphs, not written yet |
| 0-1 BFS | Fewest total cost, where every move costs `0` or `1` | Minimum Cost to Make at Least One Valid Path in a Grid | A deque version of BFS |
| Monotonic deque | The best value over a range whose both ends move | Sliding Window Maximum, Jump Game VI, Shortest Subarray with Sum at Least K | Sliding Window, Examples |
| Design | "implement a queue using", "circular buffer" | Implement Queue using Stacks, Design Circular Queue | Implementation basics |

The BFS rows share one loop and differ only in what a step is and where the queue starts. A step can be a move to a neighboring cell, a turn of one lock wheel, or a change of one letter in a word, and the queue can start with one source or all of them. Recognizing BFS on states is the hardest of these, since the statement has no grid in it. The cue is "fewest" moves between two configurations, with each move changing the configuration a little.
