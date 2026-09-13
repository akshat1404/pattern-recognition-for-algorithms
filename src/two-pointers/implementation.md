# Implementation

Once a problem is recognized as one of the three shapes from the intuition chapter, the code follows a fixed shape. These are the three skeletons, worth knowing from memory rather than re-derived each time.

## Converging

```javascript
function converging(sortedNums, target) {
    let left = 0;
    let right = sortedNums.length - 1;

    while (left < right) {
        const sum = sortedNums[left] + sortedNums[right];

        if (sum === target) return [left, right];
        if (sum < target) left++;
        else right--;
    }

    return [];
}
```

`left < right` is what stops the loop the moment the two pointers would cross or meet, past that point there's no unchecked pair left between them. Exactly one of the two pointers moves on any given step, never both, since moving one is the entire safety argument, moving both at once would throw away the guarantee that comes from checking the comparison first.

## Fast and Slow (compaction)

```javascript
function fastSlow(nums, shouldKeep) {
    let slow = 0;

    for (let fast = 0; fast < nums.length; fast++) {
        if (shouldKeep(nums[fast], nums, slow)) {
            nums[slow] = nums[fast];
            slow++;
        }
    }

    return slow; // new length of the kept region
}
```

`fast` always advances, one pass over every element, no exceptions. `slow` only advances when the current element is worth keeping, so it always sits at the next open slot to write into. `shouldKeep` is whatever the problem defines as worth keeping, not equal to the previous kept value for Remove Duplicates, not zero for Move Zeroes.

## Linked List

```javascript
function hasCycle(head) {
    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }

    return false;
}
```

`fast` moves two nodes for every one `slow` moves, closing the gap between them by one node every step if a cycle exists, which is what guarantees they eventually land on the same node rather than just passing each other. The `fast && fast.next` check has to happen before advancing `fast` two steps, without it, `fast.next.next` would throw the moment `fast` runs off the end of a list with no cycle.
