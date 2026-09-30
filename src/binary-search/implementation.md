# Implementation

One loop underlies every shape here. `low` and `high` mark the current range, `mid` gets checked once per iteration, and a single comparison decides which half survives. The loop ends when there's nothing left to check.

## Classic search

Looking for an exact value in a sorted array.

```javascript
function binarySearch(nums, target) {
    let low = 0;
    let high = nums.length - 1;

    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);

        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return -1;
}
```

`mid` is fully resolved the moment it's checked, equal, too small, or too big, so it never needs to be looked at again. That's why both `low = mid + 1` and `high = mid - 1` move past `mid` itself.

## First or last occurrence

When duplicates exist and the goal is the leftmost or rightmost match, a match found isn't the end of the search. It gets recorded, and the search keeps narrowing toward the edge in case a better one is still hiding on that side.

```javascript
function leftmostOccurrence(nums, target) {
    let low = 0;
    let high = nums.length - 1;
    let result = -1;

    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);

        if (nums[mid] === target) {
            result = mid;
            high = mid - 1;
        } else if (nums[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return result;
}
```

The only change from classic search is that an equal match narrows `high` instead of returning immediately, since an earlier occurrence, if one exists, can only be further left.

## Search on answer

There's no array to index into here. `low` and `high` bound a range of candidate answers instead, and a feasibility check replaces the equality check.

```javascript
function minimumFeasible(low, high, isFeasible) {
    while (low < high) {
        const mid = low + Math.floor((high - low) / 2);

        if (isFeasible(mid)) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }

    return low;
}
```

`mid` might be the answer itself here, so a feasible `mid` sets `high = mid`, keeping it in play, rather than excluding it the way `high = mid - 1` did in classic search. The loop runs while `low < high` and stops the moment they meet, and that shared value is the smallest candidate that passed the check.

## The one thing that actually matters

Every version of this loop makes the same move, check one candidate, discard a whole half. What changes between problems is what "resolved" means for `mid`, an exact equality, a direction to narrow toward an edge, or a feasibility check, and whether what's being searched is a real array or a range of candidate answers with no array behind it at all. Once that check is written correctly, the loop around it barely changes.
