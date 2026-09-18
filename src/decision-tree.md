# Decision Tree

Every other page in this guide assumes a pattern has already been picked, and digs into when that specific pattern fits and how its code looks. This page is the step before that, reading a problem cold and narrowing down which pattern to even consider, before opening any single chapter.

It can only ever reflect the chapters that already exist. Right now that's Hashing and Two Pointers, with Sliding Window's boundary worked out even though its own chapter isn't finished yet. This page gets revisited and expanded every time a new pattern is added, sometimes a new pattern will split an earlier question further than it's split today.

## Question 1: does the problem only care about values, not position?

If the only thing that matters is whether a value exists, how many times it occurs, or what other value completes it, and order or position never enters the question, that points to [Hashing](./hashing/intro.md).

If position, order, or a contiguous run of elements matters, move to the next question.

## Question 2: is it about a contiguous run, with a min or max being asked over that run?

"Longest substring," "smallest subarray," "maximum sum of a window of size k," anything where the elements have to sit next to each other in the original array or string, not any subset.

If yes, check one more thing before committing: does growing the run always push whatever's being tracked in one predictable direction? A sum only ever needs non-negative values for this to hold, since growing the window would otherwise sometimes help and sometimes hurt, with no guarantee that shrinking from the left is ever the right move to fix a violation. A frequency or distinct-count constraint tends to hold this naturally, removing an element from the left can only reduce a count, never increase it unexpectedly.

If that monotonic direction holds, this is [Sliding Window](./sliding-window/intro.md) (chapter still being written). If it doesn't hold, a contiguous-run question that looks like sliding window at a glance, like a subarray sum target with negative numbers allowed, isn't actually solvable that way, and points back toward Hashing instead, prefix sums paired with a frequency map.

If the problem isn't about a contiguous run at all, move to the next question.

## Question 3: does it involve two ends of ordered data, or relative position and speed through a sequence, with no aggregate needed over a whole range?

Two ends of a sorted array converging inward, a read/write pointer compacting an array in place, or two pointers moving through a linked list at different speeds. None of these ever need to know something about an entire range at once, only the values or positions the pointers currently sit on.

If yes, that's [Two Pointers](./two-pointers/intro.md).

## Still open

Everything past here, an aggregate over a range that isn't monotonic, a search space that isn't a simple sequence, a decision that depends on subproblems rather than a single pass, doesn't have a question here yet. That's what the next chapters after Sliding Window will need to fill in.
