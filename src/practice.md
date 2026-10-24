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

</details>

## 2. Car Fleet

[Car Fleet](https://leetcode.com/problems/car-fleet/description/) gives `n` cars on a one-lane road, all driving toward a destination at mile `target`. `position[i]` is car `i`'s starting mile and `speed[i]` its speed in miles per hour, and no two cars start at the same mile. A car can never pass the car ahead of it. When a faster car catches up to a slower one, it slows down and the two drive together from then on at the slower speed, as a fleet. A car that catches up exactly at the destination still joins that fleet. A single car on its own also counts as a fleet. Return the number of fleets that arrive at the destination.

For `target = 12`, `position = [10, 8, 0, 5, 3]`, and `speed = [2, 4, 1, 1, 3]`, the answer is `3`. The cars at `10` and `8` meet at mile `12` and arrive together. The car at `0` arrives alone. The cars at `5` and `3` meet at mile `6` and arrive together.
