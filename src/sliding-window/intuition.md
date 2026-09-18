# Intuition

## Where the window comes from

The brute force for a contiguous min or max question picks a start index and an end index and checks whatever sits between them, every possible pair of `(start, end)`. That range, whatever is currently inside it, is already what the problem is asking about, a subarray, a substring. "Window" is just the name for that range while we're deciding whether it's valid and whether it beats the best one found so far.

It isn't a new object being introduced, it's the same contiguous range the brute force was already checking, one pair at a time. `left` and `right` are just names for that range's two current ends, the same two numbers a `(start, end)` pair already was.

## The trade

What changes is what happens to the range between checks. The brute force throws it away and builds a fresh one for the next `(start, end)` pair, recomputing whatever needs computing, a sum, a count, a set of characters, from scratch every single time. Sliding window keeps the same range alive and adjusts it instead, one element leaves, one element enters, rather than rebuilding it from nothing. That's where "sliding" comes from, the range slides forward instead of getting recreated, and the aggregate being tracked updates by one element's worth of change instead of being recomputed over the whole range.

## From candidate to guarantee

Two things make a problem look like sliding window, and a third thing actually confirms it.

The first signal: the question asks for a minimum or maximum, of a length, a size, a sum, something being optimized. That alone is a weak signal, plenty of min/max questions aren't about a contiguous range at all.

The second signal: the range in question has to be contiguous, a subarray or substring, not any subset. Combined with the first signal, this narrows things further, but it's still not a guarantee. [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/description/) has neither signal in the min/max sense (it counts subarrays, not one optimal size) but is worth remembering here anyway, since it shares the third property's failure mode, more on that below.

The actual guarantee is a direction check. Does growing the window always move the tracked value the same way, and does removing the leftmost element always move it back the other way. If that holds, shrinking from the left is a safe fix whenever the window goes bad. If it doesn't, shrinking from the left might not fix anything, since the real problem could be sitting anywhere inside the window, not necessarily at the edge.

Check it concretely with a sum. Array `[3, -1, 4]`. Window `[3]`, sum `3`. Add the next element, window `[3, -1]`, sum `2`, the sum went down even though something was added. Growing the window didn't move the sum in one predictable direction, so there's no guarantee that trimming the left edge would fix an over-target sum, the actual problem value could be anywhere.

Now `[3, 1, 4]`, all positive. Window `[3]`, sum `3`. Add the next, window `[3, 1]`, sum `4`, bigger, guaranteed, since every number being added is positive. Remove the leftmost, the sum goes back down, also guaranteed. That back-and-forth always running in the same direction is the entire check, nothing more exotic than that.

[Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/description/) passes all three, min/max asked, contiguous range, and values constrained non-negative, so the direction check holds. Sliding window applies. [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/description/) allows negative numbers, the direction check fails, and despite looking similar on the surface, it needs prefix sums and a hash map instead, covered in the Hashing chapter's Pairing bucket.

## Two shapes, not one

Everything above describes a window that grows and shrinks, size unknown up front, found by the algorithm itself. That's the common case, but not the only one.

Some sliding window problems hand over the size directly. [Maximum Sum Subarray of Size K](https://www.geeksforgeeks.org/dsa/window-sliding-technique/) and [Permutation in String](https://leetcode.com/problems/permutation-in-string/description/) both slide a window of a fixed, given size across the array, one step at a time, asking something about the window's contents at each position, the max sum any window reaches, or whether any window's contents match a target exactly. No growing, no shrinking, no min/max size question at all, just the same incremental update idea, one element leaves, one enters, applied at a fixed width instead of a variable one.
