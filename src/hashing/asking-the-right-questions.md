# Hashing: Asking the Right Questions

A problem statement almost never says "use a hash map". What it contains are wording cues and a shape, and five questions asked of the statement are enough to read both. The first two decide whether hashing is even on the table, the third names which kind of hashing problem it is, the fourth turns the recognition into something usable, and the fifth rules out the neighbors.

## Question 1: would shuffling the input change the answer?

A hash map remembers values by key and, unless we store it on purpose, forgets where each value sat. So the first check is whether position matters to the answer at all. [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/description/) gives the same answer on any shuffle of the array, and so does [Two Sum](https://leetcode.com/problems/two-sum/description/), where the values that pair up never depend on the order they arrive in.

Some statements suggest order and do not need it. [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/description/) says "sequence", but the array stays unsorted and what the problem asks is whether `n`, `n + 1`, and `n + 2` exist anywhere in the input. That is still a question about values. A statement like [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/) fails the shuffle test, since shuffling changes which substrings exist, and a map alone cannot answer it.

## Question 2: does the obvious approach repeat the same lookup for every element?

Write the first solution that comes to mind, the one with no cleverness. In hashing problems it nearly always has the same shape, for each element, go through the other elements to check something. Contains Duplicate checks each element against the ones before it. Two Sum checks each element against all the others for the one that completes it.

That inner search, repeated once per element, is the part a hash map takes over. The map answers "is there something with this label" directly, so the inner loop disappears. If the obvious approach has no repeated search in it, for example one pass that only compares neighbors, there is nothing for a map to replace.

## Question 3: which of four things is each element asking about the others?

Every hashing problem asks one of four things about a value, and each has its own wording cues.

**Have I seen this before.** Words like "duplicate", "appears again", "already", or "within `k` positions". [Contains Duplicate II](https://leetcode.com/problems/contains-duplicate-ii/description/) is this with a distance attached. [Happy Number](https://leetcode.com/problems/happy-number/description/) never says duplicate, but a number that comes back means the process is cycling, and recognizing a repeat is the whole job.

**How many times has it shown up.** Words like "how many", "most common", "same letters", or "make the counts match". [Valid Anagram](https://leetcode.com/problems/valid-anagram/description/), [Ransom Note](https://leetcode.com/problems/ransom-note/description/), and [Determine if Two Strings Are Close](https://leetcode.com/problems/determine-if-two-strings-are-close/description/) all compare counts of letters, and [Majority Element](https://leetcode.com/problems/majority-element/description/) is a count that has to beat a threshold.

**What completes this one.** Words like "two numbers that add up to", "a pair whose difference is", or "a subarray that sums to". Each element has a partner it needs, and the question is whether that partner was already passed. [Two Sum](https://leetcode.com/problems/two-sum/description/) and [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/description/) both ask it.

**Which ones belong together.** Words like "group", "same pattern", "same row, column, or box", or "equivalent". [Group Anagrams](https://leetcode.com/problems/group-anagrams/description/), [Group Shifted Strings](https://www.geeksforgeeks.org/dsa/group-shifted-string/), and [Valid Sudoku](https://leetcode.com/problems/valid-sudoku/description/) all sort elements into buckets that something in the statement defines.

## Question 4: what would the key be?

Once the kind is clear, the working question is what label each element gets filed under so that related elements land in the same place. In a Seen Before problem the label is the value itself. In a Frequency problem the label is the value and what is stored under it is a count.

In a Pairing problem the label is the partner. For Two Sum, an element `x` files itself under `x` and looks for `target - x`. For Subarray Sum Equals K, a running prefix sum `p` looks for `p - k`, since a subarray that sums to `k` is two prefix sums that differ by `k`. In a Grouping problem the label is whatever form all related elements share. Anagrams share their sorted letters, shifted strings share the gaps between consecutive letters, and a Sudoku cell has three labels at once, its row, its column, and its box.

If no label can be named, the recognition is probably wrong or the problem needs a reframing first. Longest Consecutive Sequence looks unlabeled until the question becomes "does `n - 1` exist", at which point the label is the number itself.

## Question 5: does the order of the input give the answer for free?

This question separates hashing from its two closest neighbors. If the input is sorted, position tells us things a map would otherwise have to remember. [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/) asks exactly what Two Sum asks, but on a sorted array the rightmost value is the largest one remaining, so two pointers from both ends replace the map. A sorted input is the signal to check [Two Pointers](../two-pointers/asking-the-right-questions.md).

The other neighbor is a contiguous range. [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/description/) asks for a subarray with a sum condition, and Subarray Sum Equals K does too. The difference is the values. With non-negative numbers, growing the range can only raise the sum and shrinking can only lower it, so a window works, covered in [Sliding Window](../sliding-window/asking-the-right-questions.md). With negative numbers allowed, the sum can move either way as the range grows, a window gives no guarantee, and the prefix-sum label from Question 4 is the way through.

## Putting it together

Hashing fits when shuffling the input leaves the answer unchanged, the obvious approach repeats a search per element, the repeated search is one of the four kinds, a label can be named for each element, and the input's order gives nothing away. When the first four hold and the fifth fails, the [Decision Tree](../decision-tree.md) page says which neighbor to open next.
