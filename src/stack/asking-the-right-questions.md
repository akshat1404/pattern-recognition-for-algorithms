# Stack: Asking the Right Questions

## Seeing it in a statement

Every problem statement has two parts. What it asks for, the shape of the answer. What it offers, the structure in the input we can lean on. The pattern is where the two meet. For a stack, what the input offers is always the same thing underneath. Some elements cannot be decided with only what has been read so far. Their answer depends on something that comes later, so they wait on the stack. When that something arrives, it decides the most recent waiting element first.

| Asks for | Offers | Use |
|---|---|---|
| Whether every opening item has a matching closing item, in the right order | Items that open and close, where the latest open item must close first | Stack of open items |
| A result built from parts nested inside other parts | An inner part that must finish before the outer part can continue | Stack of saved outer state |
| What remains after elements cancel or remove each other | A new element that only interacts with the most recent remaining one | Stack of remaining elements |
| For each element, the nearest element after it (or before it) that is greater or smaller | Elements that wait until something greater or smaller arrives | Stack of waiting elements, kept in order |
| For each element, how far it extends before a smaller (or greater) element stops it | A range that ends at the nearest smaller (or greater) element on each side | Stack of waiting elements, kept in order |

If the oldest waiting element is decided first, not the newest, it is a queue. If elements have to leave from both ends, as in Sliding Window Maximum, it is a deque, covered in [Sliding Window](../sliding-window/asking-the-right-questions.md).

Five problems follow, each read from its statement to the pattern. No code here, the code lives in Implementation and Examples.

## 1. Valid Parentheses

**The statement.** [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/description/) gives a string made only of the characters `(`, `)`, `[`, `]`, `{`, and `}`, and asks whether it is valid. A string is valid when every opening bracket is closed by a bracket of the same type, and brackets close in the correct order. `"([]{})"` is valid. `"([)]"` is not, since the `[` is still open when `)` tries to close the `(`.

**Asks for.** Whether the brackets are correctly nested.

**Offers.** Openers that wait for their closer, where the opener that must close next is always the latest one still open.

**Why it fits.** Read the string left to right. No opener can be decided yet, since its answer depends on a closer that comes later, so it waits. When a closer arrives, it can only match one opener, the most recent one still open, since anything opened after that would have to close first. In `"([)]"` the `)` arrives while `[` is the latest open bracket, so the match fails right there. The waiting openers are decided newest first, which is exactly what a stack gives. At the end, the string is valid only if nothing is left waiting.

## 2. Decode String

**The statement.** [Decode String](https://leetcode.com/problems/decode-string/description/) gives an encoded string and asks for it decoded. The rule is `k[text]`, which means `text` repeated `k` times, and these can be nested inside each other. `"3[a]2[bc]"` decodes to `"aaabcbc"`. `"3[a2[c]]"` decodes to `"accaccacc"`, since the inner `2[c]` becomes `cc` first, then `acc` is repeated three times.

**Asks for.** A nested structure expanded.

**Offers.** An inner part that must be finished before the part around it can continue.

**Why it fits.** When a `[` arrives, the text built so far and the repeat count in front of the bracket cannot be used yet, they wait until the matching `]`. Inside, another `[` can start, and that inner part has to finish first. So the outer parts pile up, each waiting on the one inside it. When a `]` arrives, it closes the innermost part, which was the latest one started, and its result is joined onto the part saved just before it. The newest waiting part is decided first, so a stack holds the saved outer state.

## 3. Asteroid Collision

**The statement.** [Asteroid Collision](https://leetcode.com/problems/asteroid-collision/description/) gives an array of integers representing asteroids in a row. The absolute value is the asteroid's size, and the sign is its direction, positive moving right and negative moving left. All move at the same speed. When two meet, the smaller one explodes, and if they are the same size, both explode. Two moving in the same direction never meet. It asks for the asteroids left after all collisions. `[5, 10, -5]` becomes `[5, 10]`, since `-5` meets `10` and explodes. `[10, 2, -5]` becomes `[10]`, since `-5` destroys `2` and is then destroyed by `10`.

**Asks for.** What survives after all collisions.

**Offers.** A left-moving asteroid that only ever meets the nearest right-moving asteroid in front of it, the most recent survivor.

**Why it fits.** Read left to right, keeping the survivors so far. A right-moving asteroid cannot collide with anything yet, so it waits. A left-moving asteroid travels back through the survivors and meets the most recent one first. If it wins, that survivor is gone and it meets the next most recent one. If it loses or ties, it stops. Collisions always happen with the newest survivor, which is the top of a stack. Two pointers do not fit, since one arrival can remove any number of earlier asteroids, and they are always removed newest first.

## 4. Daily Temperatures

**The statement.** [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/description/) gives an array of daily temperatures and asks, for each day, how many days later the next warmer day comes. If no warmer day comes, the answer for that day is `0`. For `[73, 74, 75, 71, 69, 72, 76, 73]`, the answer is `[1, 1, 4, 2, 1, 1, 0, 0]`.

**Asks for.** For each element, the next greater element to its right.

**Offers.** Days that wait for a warmer day, where a new warm day decides the colder waiting days starting from the most recent.

**Why it fits.** The plain approach looks forward from every day for a warmer one. Instead, read left to right and let days wait. In the example, `75` waits, then `71` waits, then `69` waits. When `72` arrives, it is warmer than `69`, the most recent waiting day, so `69` is decided, with an answer of `1`. Then it is warmer than `71`, which is decided with `2`. It is not warmer than `75`, so `75` keeps waiting, and `72` joins the waiting days.

The waiting days are always in falling order of temperature, from the oldest to the newest, because a warmer arrival decides every colder day before it waits. So the newest waiting day is always the coldest, and it is the first one any new day can decide. The stack stays in order without ever being sorted, which is why this form is called a monotonic stack.

## 5. Largest Rectangle in Histogram

**The statement.** [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/description/) gives an array of bar heights, each bar `1` wide and standing next to each other, and asks for the area of the largest rectangle that fits inside the bars. For `[2, 1, 5, 6, 2, 3]`, the answer is `10`, from the bars `5` and `6`, height `5` and width `2`.

**Asks for.** The widest range where a bar is the shortest, times that bar's height, at its best.

**Offers.** For each bar, a range that stretches until the nearest shorter bar on each side.

**Why it fits.** The largest rectangle has some bar as its shortest bar, using that bar's full height. Stretched as far as it can go, it ends just before the nearest shorter bar on the left and the nearest shorter bar on the right. So every bar needs its two nearest shorter neighbors, a next smaller question in both directions.

Read left to right and let bars wait for their right end. When a shorter bar arrives, it ends every taller waiting bar, the most recent first. The bars still waiting are in rising order of height, so the bar just below an ended bar in the stack is the nearest shorter bar on its left. One arrival gives the right end and the bar beneath gives the left end, and the rectangle for that bar is its height times the gap between the two. In the example, when `2` arrives at index `4`, it ends `6`, with left end `5` at index `2`, area `6`. Then it ends `5`, with left end `1` at index `1`, area `5` times `2`, which is `10`.

## What the five share

In every one, some elements cannot be decided with only what has been read so far, because their answer depends on something that comes later. An opener waits for its closer, an outer part waits for its inner part, a right-moving asteroid waits for a collision, a day waits for a warmer day, a bar waits for a shorter one. And in every one, a new arrival decides the waiting elements newest first, stopping at the first one it cannot decide. Once decided, an element is never needed again. That newest-first order is what a stack provides. When the oldest waiting element is the one to decide first, the problem calls for a queue instead.
