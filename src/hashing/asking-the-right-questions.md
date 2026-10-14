# Hashing: Asking the Right Questions

## Seeing it in a statement

- If the problem asks whether a value has appeared before, a duplicate or a repeat, use a `Set`.
- If the problem asks how many times something appears, most frequent, same letters, matching counts, use a `Map` of counts.
- If the problem asks for two values that add up to a target, or a partner that completes the current value, store what has been seen and look up the partner.
- If the problem asks to group items that share something, anagrams, same pattern, same row or box, use a `Map` from the shared form to the group.
- If the input's order changes the answer, it is not hashing. Check Two Pointers or Sliding Window.

Five problems follow, each read from its statement to the pattern. No code here, the code lives in Implementation and Examples.

## 1. Contains Duplicate II

**The statement.** [Contains Duplicate II](https://leetcode.com/problems/contains-duplicate-ii/description/) gives an array `nums` and a number `k`, and asks whether two different indices `i` and `j` hold the same value with `i` and `j` at most `k` apart.

**What gives it away.** "The same value" is a Seen Before question, has this value shown up already. The distance limit adds a condition on top, but the core ask is still about a value repeating.

**Why it fits.** The plain approach looks back from every element, up to `k` positions, for an equal value, the same search repeated once per element. A map from each value to the last index it appeared at replaces that search. On reaching a value, look it up, and if its last index is within `k`, the answer is yes. If not, overwrite the stored index with the current one. Only the last index matters, since any earlier occurrence is even further away.

Position matters in this problem, but it is what gets stored under the key, not the key itself. The same problem can also be read as a window of size `k` holding a set of values, which is hashing and sliding window working together.

## 2. First Unique Character in a String

**The statement.** [First Unique Character in a String](https://leetcode.com/problems/first-unique-character-in-a-string/description/) gives a string and asks for the index of the first character that appears exactly once, or `-1` if there is none.

**What gives it away.** "Appears exactly once" is a Frequency question, how many times does this character show up in the whole string.

**Why it fits.** A character's count is not known until the whole string has been read, since a character that looks unique halfway through can repeat at the very end. So the counts come first, from the full string, with the character as the key. Then the string is walked again in its original order, and the first character whose count is `1` is the answer.

The word "first" brings order back, and that is the part worth noticing. Order decides which unique character to report, but it plays no part in the counts. Shuffling the string changes the answer's index and leaves every count the same, so the counting is pure hashing and the order is only a final filter.

## 3. Pairs of Songs With Total Durations Divisible by 60

**The statement.** [Pairs of Songs With Total Durations Divisible by 60](https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60/description/) gives a list of song durations and asks how many pairs of songs have a total duration divisible by `60`.

**What gives it away.** "Pairs" with a condition on their sum is a Pairing question, each song needs a partner that completes it.

**Why it fits.** The partner is not one fixed value, as it is in Two Sum. Whether a sum is divisible by `60` depends only on the two remainders after dividing by `60`. A song with remainder `20` needs a partner with remainder `40`, and a song with remainder `0` needs another with remainder `0`. So the key is the remainder, and what is stored under it is how many songs with that remainder have been seen. Each new song adds the stored count of its partner's remainder to the total.

Sorting the durations does not help, which rules out two pointers. A longer song says nothing about its remainder, so position in a sorted list carries no information about which songs pair up. Shuffling the list leaves the count unchanged.

## 4. Group Anagrams

**The statement.** [Group Anagrams](https://leetcode.com/problems/group-anagrams/description/) gives a list of strings and asks for them grouped so that anagrams of each other end up together.

**What gives it away.** "Grouped" is the Grouping question, which strings belong together.

**Why it fits.** Grouping needs a key that every member of a group shares and no outsider has. Two strings are anagrams exactly when they have the same letters in the same counts, so the sorted letters of a string work as the key, and so does its count of each letter. The check for any grouping key is that two items map to the same key if and only if they belong together. Here both directions hold, so every string files itself under its key and each key collects one group. Nothing about the order of the input list matters.

## 5. Longest Consecutive Sequence

**The statement.** [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/description/) gives an unsorted array and asks for the length of the longest run of consecutive values, such as `1, 2, 3, 4`, wherever those values sit in the array.

**What gives it away.** This one hides. "Longest" and "sequence" suggest a stretch of the array, which points at a window, but "consecutive" here is about values, not positions. The real question is whether `n + 1` exists anywhere in the input, which is Seen Before.

**Why it fits.** Put every value in a set. A run can only start at a value whose `n - 1` is missing, since otherwise the run would extend further down. From each such start, keep asking whether the next value is in the set, and the count of successful asks is the run's length. A window is ruled out because the input order means nothing, and the shuffle test confirms it, any shuffle of the array has the same answer.

## What the five share

Each statement asks one of four things about a value, has it been seen, how many times, what completes it, or what it belongs with. Each has a key that can be named, the value, the character, the remainder, the sorted letters, the number itself. And in each, the input's order is either irrelevant or used only after the hashing is done, as a stored index in the first problem and a final filter in the second. When order starts deciding the answer itself, the [Decision Tree](../decision-tree.md) points to [Two Pointers](../two-pointers/asking-the-right-questions.md) or [Sliding Window](../sliding-window/asking-the-right-questions.md).
