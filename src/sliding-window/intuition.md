# Intuition

## From candidate to guarantee

Two things make a problem look like sliding window, and a third thing actually confirms it.

The first signal: the question asks for a minimum or maximum, of a length, a size, a sum, something being optimized. That alone is a weak signal, plenty of min/max questions aren't about a contiguous range at all.

The second signal: the range in question has to be contiguous, a subarray or substring, not any subset. Sometimes it is written in the statement, and sometimes it is hidden and only appears after a reframing, covered in The Hidden Window at the end of this chapter. Combined with the first signal, this narrows things further, but it's still not a guarantee. [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/description/) has neither signal in the min/max sense (it counts subarrays, not one optimal size) but is worth remembering here anyway, since it shares the third property's failure mode, more on that below.

The actual guarantee is a direction check. Does growing the window always move the tracked value the same way, and does removing the leftmost element always move it back the other way. If that holds, shrinking from the left is a safe fix whenever the window goes bad. If it doesn't, shrinking from the left might not fix anything, since the real problem could be sitting anywhere inside the window, not necessarily at the edge.

Check it concretely with a sum. Array `[3, -1, 4]`. Window `[3]`, sum `3`. Add the next element, window `[3, -1]`, sum `2`, the sum went down even though something was added. Growing the window didn't move the sum in one predictable direction, so there's no guarantee that trimming the left edge would fix an over-target sum, the actual problem value could be anywhere.

Now `[3, 1, 4]`, all positive. Window `[3]`, sum `3`. Add the next, window `[3, 1]`, sum `4`, bigger, guaranteed, since every number being added is positive. Remove the leftmost, the sum goes back down, also guaranteed. That back-and-forth always running in the same direction is the entire check, nothing more exotic than that.

[Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/description/) passes all three, min/max asked, contiguous range, and values constrained non-negative, so the direction check holds. Sliding window applies. [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/description/) allows negative numbers, the direction check fails, and despite looking similar on the surface, it needs prefix sums and a hash map instead, covered in the Hashing chapter's Pairing bucket.

## Where the window comes from

The brute force for a contiguous min or max question picks a start index and an end index and checks whatever sits between them, every possible pair of `(start, end)`. That range, whatever is currently inside it, is already what the problem is asking about, a subarray, a substring. "Window" is just the name for that range while we're deciding whether it's valid and whether it beats the best one found so far.

It isn't a new object being introduced, it's the same contiguous range the brute force was already checking, one pair at a time. `left` and `right` are just names for that range's two current ends, the same two numbers a `(start, end)` pair already was.

## The trade

What changes is what happens to the range between checks. The brute force throws it away and builds a fresh one for the next `(start, end)` pair, recomputing whatever needs computing, a sum, a count, a set of characters, from scratch every single time. Sliding window keeps the same range alive and adjusts it instead, one element leaves, one element enters, rather than rebuilding it from nothing. That's where "sliding" comes from, the range slides forward instead of getting recreated, and the aggregate being tracked updates by one element's worth of change instead of being recomputed over the whole range.

## Two shapes, not one

Everything above describes a window that grows and shrinks, size unknown up front, found by the algorithm itself. That's the common case, but not the only one.

Some sliding window problems hand over the size directly. [Maximum Sum Subarray of Size K](https://www.geeksforgeeks.org/dsa/window-sliding-technique/) and [Permutation in String](https://leetcode.com/problems/permutation-in-string/description/) both slide a window of a fixed, given size across the array, one step at a time, asking something about the window's contents at each position, the max sum any window reaches, or whether any window's contents match a target exactly. No growing, no shrinking, no min/max size question at all, just the same incremental update idea, one element leaves, one enters, applied at a fixed width instead of a variable one.

## The hidden window

In every problem above, the contiguous range was written in the statement, a substring, a subarray. Some problems never mention one. The window is still there, and it only appears after a reframing. It hides in three ways so far.

**In what is left behind.** [Maximum Points You Can Obtain from Cards](https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/description/) takes cards from the two ends of a row, and the cards taken are never a contiguous range. The cards left behind are. Taking `k` cards from the two ends always leaves one unbroken block of `n - k` cards in the middle, and every position of that block is reachable, so points taken are the total minus the sum of a fixed-size window. The wording cue is "from either end" or "from the edges", which points at the middle, not at the ends.

**In the sorted order.** [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element/description/) lets elements be raised by one, up to a budget, and asks how many can end up equal. Nothing in the statement is contiguous. But elements can only go up, so a group ends at its largest value, and the cheapest elements to raise to it are the ones just below it. After sorting, those are a stretch ending at the target. The wording cue is elements that can only move in one direction, with a goal of making several of them equal or close, since sorting puts the ones that matter next to each other.

**Over a derived list.** [Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays/description/) does mention subarrays, but the window that solves it isn't over the array. What decides a subarray is which `k` consecutive odd numbers it holds, so a window of size `k` slides over the list of odd positions instead. The wording cue is a condition about the count of one special kind of element, with everything else in the array only adding freedom around it.

Finding the hidden window is the hard part. Once it is found, everything else is the same as before, one loop, `right` advancing, and the one question of what moves `left`. In the Cards problem the answer is that the size is fixed at `n - k`. In Frequency of the Most Frequent Element it is a cost staying within a budget.
