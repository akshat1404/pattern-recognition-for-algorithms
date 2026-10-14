# Two Pointers: Asking the Right Questions

## Seeing it in a statement

Every problem statement has two parts. What it asks for, the shape of the answer. What it offers, the structure in the input we can lean on. The pattern is where the two meet.

| Asks for | Offers | Use |
|---|---|---|
| A pair or triplet meeting a target | Sorted array | One pointer at each end, moving inward |
| Whether it reads the same both ways | A string with fixed ends | Compare from both ends inward |
| Remove, move, or filter elements | In place, no extra space | Slow pointer writes, fast pointer reads |
| Merge or match in order | Two sequences | One pointer per sequence |
| A cycle, the middle, the `n`th from the end | Linked list | Fast and slow pointers |

If moving a pointer means undoing something tracked over the whole range, it is not two pointers. Check Sliding Window.

Five problems follow, each read from its statement to the pattern. No code here, the code lives in Implementation and Examples.

## 1. 3Sum Closest

**The statement.** [3Sum Closest](https://leetcode.com/problems/3sum-closest/description/) gives an array and a target, and asks for the sum of three elements that is closest to the target.

**Asks for.** The sum of three elements closest to a target.

**Offers.** An array we are free to sort, since only the sum is returned, not indices. Sorted array plus a target sum is the two-ends shape.

**Why it fits.** Fix one element, then place one pointer just after it and one at the far end. If the three values sum to less than the target, moving the left pointer right is the only move that can bring the sum up toward the target, and moving the right pointer left could only push it further away. If the sum is more than the target, the reverse holds. Each move is the only one that could get closer, so no better triple is ever skipped. Hashing does not fit here, since "closest" has no exact partner to look up.

## 2. Valid Palindrome II

**The statement.** [Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/description/) gives a string and asks whether it can be a palindrome after deleting at most one character.

**Asks for.** Whether the string can be a palindrome after one deletion.

**Offers.** A string with fixed first and last characters. Palindrome means comparing from both ends inward.

**Why it fits.** Start a pointer at each end. While the two characters match, both move inward, and this is safe because any palindrome needs that outer pair to match anyway. At the first mismatch, one of the two characters has to be the one deleted, since no deletion further inside can fix the outer pair. That leaves two options, skip the left character or skip the right one, and each option is a plain palindrome check on what remains. The single mismatch narrows the whole problem to two checks.

## 3. Merge Sorted Array

**The statement.** [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/description/) gives two sorted arrays, where the first has empty space at its end equal to the length of the second, and asks for the second merged into the first in place, sorted.

**Asks for.** Two arrays merged in sorted order, in place.

**Offers.** Two sorted arrays and empty space at the end of the first. One pointer per array, filling from the back.

**Why it fits.** Filling from the front overwrites values of the first array that have not been read yet. Filling from the back does not. The largest value still unplaced is the larger of the two arrays' last unread values, since both are sorted, and it belongs in the last empty slot. That slot is either free space or a position whose value has already been moved, so nothing unread gets overwritten. A third pointer marks where the next value goes, and it always stays behind the values still waiting to be read.

## 4. Is Subsequence

**The statement.** [Is Subsequence](https://leetcode.com/problems/is-subsequence/description/) gives two strings, `s` and `t`, and asks whether the characters of `s` appear in `t` in the same order, not necessarily next to each other.

**Asks for.** Whether `s` appears inside `t` in the same order.

**Offers.** Two sequences read left to right. One pointer per sequence, both moving forward.

**Why it fits.** The pointer in `t` moves forward every step. The pointer in `s` moves forward only when the two characters match. Matching a character of `s` at the earliest place it appears in `t` is always safe, since it leaves as much of `t` as possible for the characters that come after. If the pointer in `s` reaches its end, the answer is yes. A window does not fit, because the matched characters of `t` do not have to be next to each other and nothing gets undone when a pointer moves.

## 5. Find the Duplicate Number

**The statement.** [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/description/) gives `n + 1` numbers, each between `1` and `n`, with exactly one value repeated. It asks for the repeated value without changing the array and using only a fixed amount of extra space.

**Asks for.** The repeated value, without changing the array or using extra space that grows with it.

**Offers.** Values that are all valid indices into the array. A set or a sort is ruled out, but following each value as a link turns the array into a linked list with a cycle.

**Why it fits.** Read each value as a pointer to the index it names, so index `i` leads to index `nums[i]`. Starting from index `0` and following these links, the walk can never leave the array, so it must eventually loop. No value is `0`, so no link leads back to index `0`, and the walk enters the loop from outside it. The index where it enters has two links leading into it, one from the path and one from inside the loop. Two links into one index means two positions hold the same value, so the index where the loop begins is the duplicate value itself. The problem has turned into a linked list with a cycle, and the fast and slow pointers find a cycle's starting point without any extra structure.

## What the five share

Every one has an order that position can lean on, a sorted array, the two ends of a string, two sequences read in order, or links that form a list. In every one, the pointer that moves is the one whose move can be argued safe in a single sentence, and no move ever needs to be undone. When something tracked across the whole range has to be corrected as a pointer moves, the problem belongs to [Sliding Window](../sliding-window/asking-the-right-questions.md). When the input has no usable order and the question is about values alone, it belongs to [Hashing](../hashing/asking-the-right-questions.md).
