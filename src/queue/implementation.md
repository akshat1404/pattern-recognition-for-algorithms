# Implementation

JavaScript has no separate queue type. An array can act as one, with `push` adding to the back. Taking from the front is the catch. `shift()` removes the first element, but it moves every other element down one place, which costs time proportional to the length of the array. Inside a loop that runs once per element, that adds up.

The fix is a `head` index that marks the front. Taking from the front reads `queue[head]` and moves `head` forward, and nothing else moves.

```javascript
const queue = [];
let head = 0;

queue.push(x);                 // add to the back
const front = queue[head++];   // take from the front
const size = queue.length - head;
```

The elements before `head` stay in the array but no longer count. For the problems in this chapter that is fine, since each element joins the queue a limited number of times.

## Turns

Elements act in order, and an element that is not finished goes to the back. Taking from the front and pushing to the back is a rotation.

```javascript
function takeTurns(items, isDone) {
    const queue = items.slice();
    let head = 0;

    while (queue.length - head > 0) {
        const item = queue[head++];
        // act on item
        if (!isDone(item)) queue.push(item);
    }
}
```

Because an element that comes back joins behind everyone still waiting, every waiting element gets a turn before anyone gets a second one. That is the order the statement describes when it says "goes to the back of the line" or "moves the top card to the bottom".

## Expiry

Only recent items count, and items arrive in time order, so they expire in that same order. New items join the back, and expired items leave the front.

```javascript
const times = [];
let head = 0;

function record(t, windowSize) {
    times.push(t);
    while (times[head] < t - windowSize) head++;
    return times.length - head;   // items still inside the window
}
```

Whether the edge of the window counts, `<` or `<=`, comes from the statement. Number of Recent Calls keeps a request from exactly `3000` milliseconds ago, so it drops only those strictly older.

## Breadth-first search

Something spreads one step at a time, and the question is how many steps it takes. Everything reached in step `d` has to spread before anything reached in step `d + 1`. A queue gives that order on its own, since the cells reached by a cell in step `d` join the back, behind every cell of step `d` still waiting. This is breadth-first search, BFS for short.

On a grid, each cell holds its step count, and a cell is marked the moment it is reached, so it never joins the queue twice.

```javascript
function bfs(rows, cols, starts, canEnter) {
    const steps = Array.from({ length: rows }, () => new Array(cols).fill(-1));
    const queue = [];
    let head = 0;

    for (const [row, col] of starts) {
        steps[row][col] = 0;
        queue.push([row, col]);
    }

    const moves = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    while (head < queue.length) {
        const [row, col] = queue[head++];

        for (const [rowStep, colStep] of moves) {
            const nextRow = row + rowStep;
            const nextCol = col + colStep;
            if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
            if (steps[nextRow][nextCol] !== -1 || !canEnter(nextRow, nextCol)) continue;

            steps[nextRow][nextCol] = steps[row][col] + 1;
            queue.push([nextRow, nextCol]);
        }
    }

    return steps;
}
```

The only difference between the two forms of BFS is what the queue starts with.

**Single-source BFS** starts the queue with one cell. Each cell's step count is its distance from that one start. Shortest Path in Binary Matrix is this form, from the top-left corner.

**Multi-source BFS** starts the queue with every source at once, all at step `0`, before any spreading happens. Each cell's step count is then its distance to the nearest source, since all sources spread at the same speed and the first one to reach a cell is the closest. Rotting Oranges starts with every rotten orange, and 01 Matrix starts with every `0`. Starting the sources one at a time instead would label a cell by whichever source happened to go first, not by the nearest one.

| Problem | Starts with | Spreads into | Records |
|---|---|---|---|
| Shortest Path in Binary Matrix | The top-left cell | Clear cells, 8 directions | Steps until the bottom-right is reached |
| Rotting Oranges | Every rotten orange | Fresh oranges | The last step, and `-1` if some are never reached |
| 01 Matrix | Every `0` | Every cell | Each cell's own step count |

## Deque

A deque, short for double-ended queue, can add and remove at both ends. JavaScript arrays already do both at the back, with `push` and `pop`, so a `head` index for the front is enough to make one.

The common use keeps candidates for the best value over a range whose both ends move. Old candidates leave the front when they fall out of the range, and candidates that can never be the best leave the back when something better arrives. For the maximum of every window of size `k`:

```javascript
function windowMaxima(nums, k) {
    const deque = [];   // indices, values falling from front to back
    let head = 0;
    const result = [];

    for (let i = 0; i < nums.length; i++) {
        if (head < deque.length && deque[head] <= i - k) head++;

        while (deque.length > head && nums[deque[deque.length - 1]] <= nums[i]) {
            deque.pop();
        }
        deque.push(i);

        if (i >= k - 1) result.push(nums[deque[head]]);
    }

    return result;
}
```

The front is always the best candidate still in range, so reading the answer costs nothing. Every index is added once and removed at most once, from one end or the other, so the whole pass costs `n`. This is the structure behind Sliding Window Maximum in the Sliding Window chapter.

## The one thing that actually matters

Every queue problem comes down to one question, which waiting element goes next. If it is always the one that has waited longest, the code is a loop that takes from the front and adds to the back, and what changes between problems is what gets added. A person who still needs tickets, a request that just arrived, the neighbors of a cell that just spread. Starting BFS with one source or all of them, and whether old elements also leave by being beaten from the back, are the only other decisions.
