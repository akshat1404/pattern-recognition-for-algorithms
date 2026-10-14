# Sliding Window: Asking the Right Questions

A statement rarely says "window". What it says is something about a stretch of the input, and five questions asked in order read that. The first two check whether the problem is about a stretch and what kind of answer it wants, the third is the check that confirms it, the fourth names what to do when the stretch goes wrong, and the fifth handles the statements where no stretch is written at all.

## Question 1: is the thing being asked about a contiguous stretch of the input?

The window is not a new object. It is the range the obvious solution was already looking at, a start index, an end index, and whatever sits between them. A subarray or a substring is a contiguous stretch. A subsequence, or any subset of the elements, is not.

[Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/) asks about a substring, so the stretch is written in the statement. If the statement picks elements from anywhere in the input with no requirement that they sit next to each other, there is no stretch and this question ends the search. Some statements name no stretch and still have one, which is Question 5.

## Question 2: does the statement give the size, or ask for the best size?

A stretch problem comes in one of three forms, and the wording separates them.

**The size is given.** Words like "of size `k`", "every window of length", or "a substring as long as `s1`". [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/description/), [Permutation in String](https://leetcode.com/problems/permutation-in-string/description/), and [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/description/) all hand over the size. The answer can be a number, a yes or no, or a list, and no best size is asked for.

**The best size under a limit.** Words like "longest", "largest", "at most `k`", or "without repeating". The stretch has to stay valid, and the question is how long it can get. [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/) and [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/description/) are this form.

**The best size to reach a threshold.** Words like "shortest", "smallest", "at least", or "contains all of". The stretch has to become valid, and the question is how short it can be while valid. [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/description/) and [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/description/) are this form.

A min or max ask on its own is a weak signal, since plenty of those problems have no stretch in them. It counts only together with Question 1.

## Question 3: when the stretch grows, and when it loses its leftmost element, does the tracked value move in a predictable direction?

This is the check that confirms the pattern. Whatever the problem tracks, a sum, a count, a set of characters, adding an element on the right has to push it one way, and removing one on the left has to push it back. If that holds, shrinking from the left is a safe way to fix a stretch that went bad. If it does not, the real problem could sit anywhere inside the stretch, and trimming the edge may fix nothing.

Check it with a sum. On `[3, -1, 4]`, the stretch `[3]` has sum `3`, and adding the next element gives `[3, -1]` with sum `2`. The sum went down after something was added, so there is no guarantee about what trimming the left would do. On `[3, 1, 4]` every element is positive, so adding raises the sum and removing lowers it, every time. That same direction, always, is the entire check.

[Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/description/) passes, since its values are non-negative. [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/description/) allows negative numbers and fails, which sends it to prefix sums and a map, covered in [Hashing](../hashing/asking-the-right-questions.md). Counts and distinct-character constraints pass naturally, since removing an element can only lower a count.

## Question 4: what moves the left edge, and does moving it undo anything?

The right edge advances once per step, always. The one real decision in the whole pattern is what moves the left edge, and it has a different source in each form from Question 2. When the size is given, the left edge moves when the stretch grows past that size. When maximizing, it moves while the stretch is invalid. When minimizing, it moves while the stretch is still valid, so every step along the way is a chance at something shorter. If that condition cannot be stated in a sentence, the problem is not ready to be a window.

The same question separates this pattern from [Two Pointers](../two-pointers/asking-the-right-questions.md). In two pointers, moving a pointer leaves nothing behind to correct. In a window, moving the left edge undoes part of what is tracked, a character leaves a set or a number leaves a sum. Something to undo means sliding window, nothing to undo means two pointers. What gets tracked often comes from [Hashing](../hashing/asking-the-right-questions.md), a set for distinct characters or a count map for letter frequencies, while the window decides how that structure is updated.

## Question 5: if the statement names no stretch, is one hidden?

Some problems ask for a maximum or a minimum and never mention a subarray or a substring, and a window still solves them. Three sub-questions find it.

**What is left behind after the choice is made.** If elements are taken from the two ends, the untouched part is one unbroken block. [Maximum Points You Can Obtain from Cards](https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/description/) takes cards from both ends of a row, and the cards left in the middle are a window of size `n - k`. The wording cue is "from either end" or "from the edges".

**Whether sorting puts the elements that matter next to each other.** If elements can only move in one direction and the goal is to make several equal or close, sorting turns the group that matters into a stretch. [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element/description/) raises elements by one up to a budget, and after sorting, the cheapest group to raise to any target is the stretch just below it.

**Whether a shorter list holds the real structure.** If the condition is about the count of one special kind of element, the positions of those elements form a list where the window is simple. [Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays/description/) needs exactly `k` odd numbers, and a window of `k` consecutive positions over the list of odd positions counts the answer.

A related case is a window that tracks only the part of the input a choice changes. [Grumpy Bookstore Owner](https://leetcode.com/problems/grumpy-bookstore-owner/description/) has a fixed baseline of customers who are satisfied regardless, and the window slides over only the extra customers a technique would win back.

If none of these produces a window, another pattern is likely the fit. A greedy choice at each step, such as taking the bigger end in the cards problem, is worth testing against a small counterexample before trusting it.

## Putting it together

Sliding window fits when the question is about a contiguous stretch, the size is given or the best size is asked for, growing and shrinking the stretch move the tracked value in a predictable direction, a condition for moving the left edge can be stated, and a hidden stretch has been looked for when the statement names none. The loop that follows is the same every time, and Implementation shows its three forms.
