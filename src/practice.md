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

## 4. Successful Pairs of Spells and Potions

[Successful Pairs of Spells and Potions](https://leetcode.com/problems/successful-pairs-of-spells-and-potions/description/) gives two arrays of positive integers, `spells` of length `n` and `potions` of length `m`, and a number `success`. `spells[i]` is the strength of spell `i` and `potions[j]` the strength of potion `j`. A spell and a potion make a successful pair when the product of their strengths is at least `success`. Return an array of length `n` where entry `i` is the number of potions that make a successful pair with spell `i`. Both arrays can hold up to `100,000` values.

For `spells = [5, 1, 3]`, `potions = [1, 2, 3, 4, 5]`, and `success = 7`, the answer is `[4, 0, 3]`. Spell `5` succeeds with every potion except `1`, spell `1` with none, and spell `3` with `3`, `4`, and `5`. For `spells = [3, 1, 2]`, `potions = [8, 5, 8]`, and `success = 16`, the answer is `[2, 0, 2]`.

<details>
<summary>Reveal</summary>

**Pattern.** [Binary Search](./binary-search/asking-the-right-questions.md), on the sorted potions, once per spell.

**Asks for.** A count for each spell, how many values in the second array reach a threshold.

**Offers.** A condition, `spell × potion >= success`, that only depends on the potions' values, never on where they sit, so the potions can be sorted freely.

**Why it fits.** Stripped down, the problem is two arrays, and for each value `x` in the first, a count of the values `y` in the second with `x × y >= success`. For a fixed spell, a stronger potion only makes the product bigger. Once the potions are sorted, the check is no for the weak ones and yes from some point to the end, and it flips exactly once.

```
spell 3, success 7
potion   1  2  3  4  5
3 × p    3  6  9 12 15
>= 7?    no no yes yes yes
```

A yes at index `2` settles indices `3` and `4` without checking them, and a no at index `1` settles index `0`. Binary search finds the first yes, and the count is every potion from there to the end, `5 - 2 = 3`. Checking one potion is a single multiplication, far easier than counting all of them, so the guess pays off.

**Looks like.** Hashing, since only values matter and a potion's position never enters the question. But a hash map answers exact lookups, whether a value is there and how often, and this asks how many values are at least a threshold. A threshold needs the values in order, which a map does not keep. Checking every pair also works, but with up to `100,000` of each, that is `10` billion products.

Two Pointers works too. Sort the spells as well, keeping their original indices. A stronger spell needs a weaker potion, so as the spells go up, the first successful potion only moves left, and one pointer walking down the potions serves every spell.

```javascript
{{#include ./practice/successful-pairs-of-spells-and-potions.js}}
```

</details>

## 5. Furthest Building You Can Reach

[Furthest Building You Can Reach](https://leetcode.com/problems/furthest-building-you-can-reach/description/) gives an array `heights`, where `heights[i]` is the height of building `i`, along with a number of `bricks` and a number of `ladders`. You start on building `0` and move to the next building, one at a time. Moving down or staying level costs nothing. Moving up from building `i` to building `i + 1` needs either one ladder, whatever the climb, or exactly `heights[i + 1] - heights[i]` bricks. Bricks and ladders are used up once spent. Return the index of the furthest building you can reach.

For `heights = [4, 2, 7, 6, 9, 14, 12]`, `bricks = 5`, and `ladders = 1`, the answer is `4`. The climb from `2` to `7` uses `5` bricks, the drop to `6` is free, and the climb from `6` to `9` uses the ladder. The climb from `9` to `14` cannot be paid for. For `heights = [4, 12, 2, 7, 3, 18, 20, 3, 19]`, `bricks = 10`, and `ladders = 2`, the answer is `7`.

<details>
<summary>Reveal</summary>

**Pattern.** [Heap](./heap/asking-the-right-questions.md), a min-heap that keeps the largest climbs seen so far, one per ladder.

**Asks for.** The furthest building reached, which ends at the first climb that cannot be paid for.

**Offers.** Climbs that arrive one at a time, and a ladder that covers any climb, whatever its height, while bricks pay by height.

**Why it fits.** A ladder saves the most bricks on the biggest climb, so with `x` ladders, the ladders belong on the `x` largest climbs passed so far, and bricks pay for the rest. Sorting the climbs would say which those are, but the climbs keep arriving, and the walk has to decide at every step whether it can go on. That is the `x` largest of a growing list, a min-heap of size `x`. Each climb goes on a ladder. When there are more climbs on ladders than ladders, the smallest of them, the top of the heap, switches to bricks. The first time the bricks run out, the walk stops there.

```
heights = [4, 2, 7, 6, 9, 14, 12], bricks = 5, ladders = 1

step     climb   on ladders   switched to bricks   bricks left
2 → 7      5       [5]              none                5
6 → 9      3       [5]               3                  2
9 → 14     5       [5]               5                 -3, stop at building 4
```

The climb that switches is picked by its value, not by when it arrived, which is what separates this from a stack or a queue.

**Looks like.** A walk where each climb is decided on the spot, which suggests spending bricks first and ladders when bricks run out. That fails, since bricks spent early on a big climb cannot be taken back. Keeping every climb on a ladder until a cheaper one is known is what lets the heap correct earlier choices.

Binary Search also works. Whether building `k` can be reached flips from yes to no exactly once, and a guess is checked by sorting the climbs up to `k`, giving the ladders to the largest, and adding up the rest. Every check redoes that sorting from scratch, and the heap does the same work once, in a single walk.

```javascript
{{#include ./practice/furthest-building-you-can-reach.js}}
```

</details>

## 6. Boats to Save People

[Boats to Save People](https://leetcode.com/problems/boats-to-save-people/description/) gives an array `people`, where `people[i]` is the weight of person `i`, and a number `limit`. Every boat can carry at most two people at the same time, as long as their total weight is at most `limit`. No person weighs more than `limit`, so everyone fits in a boat alone. Return the fewest boats needed to carry every person.

For `people = [3, 2, 2, 1]` and `limit = 3`, the answer is `3`, with boats `(1, 2)`, `(2)`, and `(3)`. For `people = [3, 5, 3, 4]` and `limit = 5`, the answer is `4`, since no two people fit together. For `people = [1, 2]` and `limit = 3`, it is `1`.

<details>
<summary>Reveal</summary>

**Pattern.** [Two Pointers](./two-pointers/asking-the-right-questions.md), from both ends of the sorted weights.

**Asks for.** The fewest boats, which means as many boats as possible should carry two people.

**Offers.** At most two people per boat, a condition on their sum, `a + b <= limit`, and weights whose order in the array does not matter, so they can be sorted.

**Why it fits.** Look at the heaviest person left. If even the lightest person left cannot ride with them, nobody can, so the heaviest goes alone. If the lightest can ride with them, sending the two together never hurts. The lightest is the easiest partner for anyone, and using them on the hardest person to pair leaves the middle weights for each other. After every boat, the heaviest left and the lightest left sit at the two ends of what remains of the sorted array, so two pointers move inward and each step looks only at the two people under them.

```
people = [1, 2, 2, 3], limit = 3

low  high   pair     fits?   boat
1    3      1 + 3    no      (3)
1    2      1 + 2    yes     (1, 2)
2    2      same     one left (2)
```

That makes `3` boats.

**Looks like.** Hashing, since only weights matter and a pair has to meet a sum. But the condition is a sum of at most `limit`, a threshold, not an exact value that a map could look up. It can also look like a packing problem where any number of people share a boat, which would be far harder. The limit of two per boat is what makes every boat a pair from the two ends.

```javascript
{{#include ./practice/boats-to-save-people.js}}
```

</details>
