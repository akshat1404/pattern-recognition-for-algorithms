# Practice: Name the Pattern

Each problem below is stated without any hint of the pattern that solves it. Read the statement, decide what it asks for and what it offers, and name the pattern before opening the reveal.

## 1. Brick Wall

[Brick Wall](https://leetcode.com/problems/brick-wall/description/) gives a wall made of rows of bricks. Every row has the same total width, and `wall[i]` lists the widths of the bricks in row `i`, from left to right. Draw one vertical line from the top of the wall to the bottom. Where the line passes through a brick, it crosses that brick, and where it runs along the edge between two bricks, it crosses nothing in that row. The line cannot be drawn along the wall's left or right edge. Return the fewest bricks the line can cross.

For this wall the answer is `2`.

```
wall = [[1, 2, 2, 1],
        [3, 1, 2],
        [1, 3, 2],
        [2, 4],
        [3, 1, 2],
        [1, 3, 1, 1]]
```

<details>
<summary>Reveal</summary>

**Pattern.** [Hashing](./hashing/asking-the-right-questions.md), a frequency count.

**Asks for.** The fewest bricks crossed, which is the number of rows minus the most rows the line can pass through at an edge.

**Offers.** Edge positions that can be written down as numbers. In each row, the edges sit at the running sums of the brick widths.

**Why it fits.** Write each row's edges as prefix sums, leaving out the last one, since that is the wall's right edge and the line cannot go there.

```
row 0: 1, 3, 5
row 1: 3, 4
row 2: 1, 4
row 3: 2
row 4: 3, 4
row 5: 1, 4, 5
```

Every width is at least `1`, so each row's sums only go up, and a position appears at most once per row. Counting how often each position appears across the whole wall therefore counts how many rows have an edge there. Position `4` appears in four rows, the most of any, so a line there crosses only the other `6 - 4 = 2` rows. The key is the edge position, the value is how many rows have an edge at it.

**Looks like.** A scan across the wall's width, checking every possible line position. The widths can be huge, so the positions to check are only the ones where some edge actually sits, and a map holds exactly those.

```javascript
{{#include ./practice/brick-wall.js}}
```

</details>

## 2. Car Fleet

[Car Fleet](https://leetcode.com/problems/car-fleet/description/) gives `n` cars on a one-lane road, all driving toward a destination at mile `target`. `position[i]` is car `i`'s starting mile and `speed[i]` its speed in miles per hour, and no two cars start at the same mile. A car can never pass the car ahead of it. When a faster car catches up to a slower one, it slows down and the two drive together from then on at the slower speed, as a fleet. A car that catches up exactly at the destination still joins that fleet. A single car on its own also counts as a fleet. Return the number of fleets that arrive at the destination.

For `target = 12`, `position = [10, 8, 0, 5, 3]`, and `speed = [2, 4, 1, 1, 3]`, the answer is `3`. The cars at `10` and `8` meet at mile `12` and arrive together. The car at `0` arrives alone. The cars at `5` and `3` meet at mile `6` and arrive together.

<details>
<summary>Reveal</summary>

**Pattern.** [Stack](./stack/asking-the-right-questions.md), a monotonic stack over the cars in road order.

**Asks for.** A count of groups, the fleets, decided by which cars catch which.

**Offers.** An order that never changes, since no car can pass another, and one number per car that decides who catches whom, the time it would take to reach the target alone, `(target - position) / speed`.

**Why it fits.** Speed alone does not decide whether a car catches the one ahead. The road ends at the target, and a car that arrives stops counting, so the catch has to happen by then. A car joins the car ahead exactly when its time alone is no more than that car's time. Sorted by position, the times are these.

```
position   0   3   5   8  10
time      12   3   7   1   1
```

Walk from mile `0` toward the target. A car cannot be decided when it is read, since it joins a fleet only if some car ahead of it turns out to be slower, and the cars ahead have not been read yet. So it waits. When a slower car shows up, it settles the cars waiting behind it, the most recent one first, and keeps settling while the waiting car's time is no more than its own. Car `3`, with time `3`, waits behind car `0`. Car `5`, with time `7`, arrives and settles car `3`, which catches it, then stops at car `0`, whose time of `12` is larger. The newest waiting car is always settled first, which is a stack, and the cars left on it at the end, `12`, `7`, `1`, are the three fleets.

**Looks like.** Binary Search, because the answer is a count between `1` and `n` and the positions can be sorted. But checking a guess of `3` fleets means working out which cars merge, which is the count itself, so the guess adds nothing. Sorting is part of the answer, guessing is not.

Walking the other way, from the car nearest the target back to mile `0`, every car ahead is already decided when a car is read. Only the time of the fleet directly ahead matters, so one number replaces the stack. Both versions are below.

```javascript
{{#include ./practice/car-fleet.js}}
```

</details>

## 3. Max Consecutive Ones III

[Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/description/) gives an array `nums` of `0`s and `1`s and a number `k`. You may change at most `k` of the `0`s into `1`s. Return the length of the longest run of consecutive `1`s you can end up with.

For `nums = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0]` and `k = 2`, the answer is `6`. Changing the `0`s at indices `5` and `10` gives `[1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1]`, which ends in six `1`s in a row. For `nums = [0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1]` and `k = 3`, the answer is `10`.

<details>
<summary>Reveal</summary>

**Pattern.** [Sliding Window](./sliding-window/asking-the-right-questions.md), a window with a limit on what it holds.

**Asks for.** The longest contiguous run, a maximum over a stretch of the array.

**Offers.** A rule for which stretches are allowed. A stretch can be turned into all `1`s exactly when it holds at most `k` zeros, since every zero inside it has to be changed.

**Why it fits.** The question stops being about changing anything. It becomes the longest window with at most `k` zeros in it. The count of zeros moves in one direction with the window. Growing it on the right can only keep the count or raise it, and dropping an element from the left can only keep it or lower it. So when the window holds too many zeros, moving the left edge forward is always the fix, and it moves forward until the window is allowed again. Every allowed window is a candidate, and the longest one is the answer.

In the first example with `k = 2`, the window grows over `1, 1, 1, 0, 0` and stays allowed. The third zero at index `5` makes three, so the left edge moves past index `3`, the first zero. The longest allowed window turns out to be indices `5` to `10`, six elements with two zeros.

**Looks like.** A problem about choosing which zeros to change, which suggests trying combinations. Reading it as a limit on the window removes the choice, since any window with at most `k` zeros can be filled.

```javascript
{{#include ./practice/max-consecutive-ones-iii.js}}
```

</details>
