# Implementation

JavaScript has no separate stack type. A plain array is the stack, with `push` adding to the top, `pop` removing from the top, and the last element being the top.

```javascript
const stack = [];
stack.push(x);
const top = stack[stack.length - 1];
stack.pop();
```

Both `push` and `pop` work at the end of the array, so neither moves any other element. The pattern lives in two decisions, what goes on the stack, and when an arriving element decides the one on top.

One loop underlies every stack problem. Read the elements left to right. For each one, first let it decide whatever it can on top of the stack, popping each element it decides, newest first. Then, if it cannot be decided yet itself, push it to wait.

## Matching

Openers wait for their closer. A closer can only match the opener on top, the most recent one still open.

```javascript
function isValid(s) {
    const opener = { ')': '(', ']': '[', '}': '{' };
    const stack = [];

    for (const ch of s) {
        if (!(ch in opener)) {
            stack.push(ch);
        } else if (stack.pop() !== opener[ch]) {
            return false;
        }
    }

    return stack.length === 0;
}
```

A closer that meets an empty stack, or the wrong opener on top, fails right there. An opener still waiting at the end never got its closer, so the stack has to be empty for the string to be valid. Cancellation problems use the same shape. An arriving element meets the element on top, and either one or both are removed, until it stops or the stack runs out.

## Saving the outer state

When parts nest inside each other, what waits is not a single element but the work done so far on the outer part. Opening a new part pushes that work, and closing the part pops it and joins the inner result onto it.

```javascript
function decodeString(s) {
    const stack = [];
    let current = '';
    let count = 0;

    for (const ch of s) {
        if (ch >= '0' && ch <= '9') {
            count = count * 10 + Number(ch);
        } else if (ch === '[') {
            stack.push([current, count]);
            current = '';
            count = 0;
        } else if (ch === ']') {
            const [outer, repeat] = stack.pop();
            current = outer + current.repeat(repeat);
        } else {
            current += ch;
        }
    }

    return current;
}
```

`current` is always the innermost part being built. The stack holds every outer part waiting on it, the most recently opened one on top, which is the one a `]` closes.

## Monotonic stack

Each element waits for the next element that is greater, or smaller, than it. The stack holds indices, not values, since the answer is usually a position or a distance, and the index gives both the position and, through the array, the value.

```javascript
function nextGreater(nums) {
    const answer = new Array(nums.length).fill(-1);
    const stack = [];

    for (let i = 0; i < nums.length; i++) {
        while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
            const waiting = stack.pop();
            answer[waiting] = i;
        }
        stack.push(i);
    }

    return answer;
}
```

`answer[waiting]` is the index of the next greater element. For a distance, as in Daily Temperatures, store `i - waiting` instead. Elements still on the stack at the end never found a greater element, so their answer stays at the default.

The `while` is where the stack stays in order. Every element smaller than the arrival gets decided and popped before the arrival is pushed, so the waiting values only fall from bottom to top. That is why the top is the first one any arrival can decide, and why the loop can stop at the first element it cannot decide.

Four variations come from the same loop.

| Looking for | Pop while | Stack from bottom to top |
|---|---|---|
| Next greater | `nums[i] > nums[top]` | Falling values |
| Next smaller | `nums[i] < nums[top]` | Rising values |
| Previous greater | `nums[i] >= nums[top]`, then the top left over is the answer for `i` | Falling values |
| Previous smaller | `nums[i] <= nums[top]`, then the top left over is the answer for `i` | Rising values |

For the previous ones, the answer for `i` is whatever sits on top after the popping, before `i` is pushed. When values repeat, whether the comparison is strict decides whether an equal value counts as greater or smaller, so it is worth checking against the statement.

## The one thing that actually matters

The loop is the same every time, decide what the arrival can decide, newest first, then push the arrival if it has to wait. What changes between problems is what waits on the stack, a bracket, a saved outer part, or an index, and what it means for an arrival to decide the element on top, a matching closer, a closing bracket, or a greater or smaller value. Once those two are named, the code follows.
