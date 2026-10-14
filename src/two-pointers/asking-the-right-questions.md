# Two Pointers: Asking the Right Questions

## Seeing it in a statement

Reverse engineering a two pointers problem starts from the order in the input. The wording cues are "sorted", "in place", "without extra space", "palindrome", "in the same order", or a linked list with a question about a cycle, a middle, or a node counted from the end. Each of these says that where a value sits tells us something about it.

Next, write the plain solution. In a two pointers problem it either compares every position with every other position, or builds an extra array or map to remember what has been passed. The question to ask is whether the order makes that work unnecessary, whether the positions of two pointers can stand in for the pairs or the extra memory.

The link to the pattern is made by one argument. At each step one pointer has to move, and we need to say which one and why moving it can never skip a better answer. In a sorted array with a sum too big, the right pointer holds the largest value left, so it is the one to move. If that argument can be stated in a sentence, the problem is two pointers. If it cannot, a greedy pointer move is likely to fail on some input, and another pattern fits.

The last check rules out [Sliding Window](../sliding-window/asking-the-right-questions.md). If moving a pointer means something tracked across the whole range has to be undone, a character removed from a set or a value subtracted from a sum, the problem is a window. If each step only looks at the values under the pointers, it stays two pointers.

Five problems follow, each read from its statement to the pattern with this chain. For every one, what the statement says, the words that give the pattern away, and the logic that confirms it. No code here, the code lives in Implementation and Examples.

## 1. 3Sum Closest

**The statement.** [3Sum Closest](https://leetcode.com/problems/3sum-closest/description/) gives an array and a target, and asks for the sum of three elements that is closest to the target.

**What gives it away.** A sum of a few elements compared against a target. The answer is a sum, not a set of indices, so sorting the array is allowed, and once sorted, the problem has the two-ends shape.

**Why it fits.** Fix one element, then place one pointer just after it and one at the far end. If the three values sum to less than the target, moving the left pointer right is the only move that can bring the sum up toward the target, and moving the right pointer left could only push it further away. If the sum is more than the target, the reverse holds. Each move is the only one that could get closer, so no better triple is ever skipped. Hashing does not fit here, since "closest" has no exact partner to look up.

## 2. Valid Palindrome II

**The statement.** [Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/description/) gives a string and asks whether it can be a palindrome after deleting at most one character.

**What gives it away.** "Palindrome" means comparing the first character with the last, the second with the second to last, and so on. There is no numeric order, but the positions are fixed, which is enough.

**Why it fits.** Start a pointer at each end. While the two characters match, both move inward, and this is safe because any palindrome needs that outer pair to match anyway. At the first mismatch, one of the two characters has to be the one deleted, since no deletion further inside can fix the outer pair. That leaves two options, skip the left character or skip the right one, and each option is a plain palindrome check on what remains. The single mismatch narrows the whole problem to two checks.

## 3. Merge Sorted Array

**The statement.** [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/description/) gives two sorted arrays, where the first has empty space at its end equal to the length of the second, and asks for the second merged into the first in place, sorted.

**What gives it away.** "Sorted" twice, and "in place". Two sorted inputs that have to be combined in order are read with one pointer each.

**Why it fits.** Filling from the front overwrites values of the first array that have not been read yet. Filling from the back does not. The largest value still unplaced is the larger of the two arrays' last unread values, since both are sorted, and it belongs in the last empty slot. That slot is either free space or a position whose value has already been moved, so nothing unread gets overwritten. A third pointer marks where the next value goes, and it always stays behind the values still waiting to be read.

## 4. Is Subsequence

**The statement.** [Is Subsequence](https://leetcode.com/problems/is-subsequence/description/) gives two strings, `s` and `t`, and asks whether the characters of `s` appear in `t` in the same order, not necessarily next to each other.

**What gives it away.** "In the same order" over two sequences. Both pointers move in the same direction, one in each string.

**Why it fits.** The pointer in `t` moves forward every step. The pointer in `s` moves forward only when the two characters match. Matching a character of `s` at the earliest place it appears in `t` is always safe, since it leaves as much of `t` as possible for the characters that come after. If the pointer in `s` reaches its end, the answer is yes. A window does not fit, because the matched characters of `t` do not have to be next to each other and nothing gets undone when a pointer moves.

## 5. Find the Duplicate Number

**The statement.** [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/description/) gives `n + 1` numbers, each between `1` and `n`, with exactly one value repeated. It asks for the repeated value without changing the array and using only a fixed amount of extra space.

**What gives it away.** The constraints shut out the usual answers. A set would find the duplicate, but it is extra space that grows with the input, and sorting changes the array. What is left is the shape of the values themselves, every value is a valid index into the array.

**Why it fits.** Read each value as a pointer to the index it names, so index `i` leads to index `nums[i]`. Starting from index `0` and following these links, the walk can never leave the array, so it must eventually loop. No value is `0`, so no link leads back to index `0`, and the walk enters the loop from outside it. The index where it enters has two links leading into it, one from the path and one from inside the loop. Two links into one index means two positions hold the same value, so the index where the loop begins is the duplicate value itself. The problem has turned into a linked list with a cycle, and the fast and slow pointers find a cycle's starting point without any extra structure.

## What the five share

Every one has an order that position can lean on, a sorted array, the two ends of a string, two sequences read in order, or links that form a list. In every one, the pointer that moves is the one whose move can be argued safe in a single sentence, and no move ever needs to be undone. When something tracked across the whole range has to be corrected as a pointer moves, the problem belongs to [Sliding Window](../sliding-window/asking-the-right-questions.md). When the input has no usable order and the question is about values alone, it belongs to [Hashing](../hashing/asking-the-right-questions.md).
