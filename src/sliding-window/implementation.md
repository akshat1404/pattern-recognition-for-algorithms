# Implementation

One loop underlies every sliding window problem. `right` always advances, one step per iteration, no exceptions. `left` advances under a condition, checked every step. The only thing that changes between problems is where that condition comes from.

## Fixed size

The condition is handed over directly by the problem, the window's length can't exceed `k`. Build the aggregate over the first `k` elements once, then slide, adding the incoming element and removing the departing one at the same time.

```javascript
function fixedWindow(nums, k) {
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
        windowSum += nums[i];
    }

    let best = windowSum;

    for (let right = k; right < nums.length; right++) {
        windowSum += nums[right] - nums[right - k];
        best = Math.max(best, windowSum);
    }

    return best;
}
```

`right - k` is always the element leaving the window the moment `right` enters it, the fixed width guarantees that pairing, no separate check needed to know what to remove.

## Variable size, maximizing under a limit

No condition is handed over here, it has to come from whatever makes the window invalid, too many distinct characters, a repeated character, some tracked value crossing a limit. Shrink `left` only while the window is currently invalid, stop the moment it becomes valid again, and only update the answer once it's valid.

```javascript
function maximizeWindow(nums, isValid) {
    let left = 0;
    let best = 0;

    for (let right = 0; right < nums.length; right++) {
        addToWindow(nums[right]);

        while (!isValid()) {
            removeFromWindow(nums[left]);
            left++;
        }

        best = Math.max(best, right - left + 1);
    }

    return best;
}
```

## Variable size, minimizing to meet a threshold

Same missing-condition problem, opposite direction. Shrink `left` while the window is still currently valid, recording the answer at every point along the way, since each shrink is a chance at something smaller. Stop shrinking the moment it becomes invalid.

```javascript
function minimizeWindow(nums, meetsThreshold) {
    let left = 0;
    let best = Infinity;

    for (let right = 0; right < nums.length; right++) {
        addToWindow(nums[right]);

        while (meetsThreshold()) {
            best = Math.min(best, right - left + 1);
            removeFromWindow(nums[left]);
            left++;
        }
    }

    return best === Infinity ? 0 : best;
}
```

The direction of the `while` condition is what separates this from maximizing, `!isValid()` shrinks to escape a bad state, `meetsThreshold()` shrinks to keep testing a good one. Mixing the two up is the most common way this pattern breaks, shrinking on the wrong condition either stops too early or never stops at all.

## The one question that actually matters

`right` always advances, that never changes. The aggregate updating incrementally is mechanical once it's clear what to track. The one piece of real thinking left, every single time, is answering "what moves `left` forward."

Fixed size answers it directly, the window's size exceeding `k`. Maximizing answers it as "the window just became invalid." Minimizing answers it as "the window is still valid, keep pushing to see how much smaller it gets." Three different sources for the exact same question, and once that question has an answer for a given problem, the rest of the code is close to boilerplate.
