# Decision Tree

Every other page in this guide assumes a pattern has already been picked, and digs into when that specific pattern fits and how its code looks. This page is the step before that, reading a problem cold and narrowing down which pattern to even consider, before opening any single chapter.

It can only ever reflect the chapters that already exist. Right now that's Hashing, Two Pointers, Sliding Window, Binary Search, Stack, Linked List, Heap, and Queue. This page gets revisited and expanded every time a new pattern is added, sometimes a new pattern will split an earlier question further than it's split today.

## Question 1: does the problem only care about values, not position?

If the only thing that matters is whether a value exists, how many times it occurs, or what other value completes it, and order or position never enters the question, that points to [Hashing](./hashing/asking-the-right-questions.md).

Values only is not enough on its own. A hash map answers exact lookups, whether a value is there, how often it occurs. If the question is how many values reach a threshold, at least some amount or at most some amount, the values are needed in order, which a map does not keep. That is a range of values, not one value, and it moves on to the next questions, usually to Binary Search on the sorted values.

If position, order, or a contiguous run of elements matters, move to the next question.

## Question 2: is it about a contiguous run, with a min or max being asked over that run?

"Longest substring," "smallest subarray," "maximum sum of a window of size k," anything where the elements have to sit next to each other in the original array or string, not any subset.

The contiguous run is not always written in the statement. A problem can ask for a maximum or minimum and never mention a subarray, and still have a hidden window. Cards taken from the two ends of a row leave a contiguous block in the middle. Elements that can only be raised, with a goal of making several equal, become a stretch of the array once sorted. A condition on the count of one kind of element, like exactly `k` odd numbers, gives a window over the positions of those elements. If the statement asks for a max or min and has no contiguous run, ask what is left behind, whether sorting groups the elements that matter, and whether a list of positions holds the structure, before ruling this question out. The Sliding Window chapter covers these in Question 5.

If yes, check one more thing before committing: does growing the run always push whatever's being tracked in one predictable direction? A sum only ever needs non-negative values for this to hold, since growing the window would otherwise sometimes help and sometimes hurt, with no guarantee that shrinking from the left is ever the right move to fix a violation. A frequency or distinct-count constraint tends to hold this naturally, removing an element from the left can only reduce a count, never increase it unexpectedly.

If that monotonic direction holds, this is [Sliding Window](./sliding-window/asking-the-right-questions.md). If it doesn't hold, a contiguous-run question that looks like sliding window at a glance, like a subarray sum target with negative numbers allowed, isn't actually solvable that way, and points back toward Hashing instead, prefix sums paired with a frequency map.

If the problem isn't about a contiguous run at all, move to the next question.

## Question 3: does it involve two ends of ordered data, or relative position and speed through a sequence, with no aggregate needed over a whole range?

Two ends of a sorted array converging inward, a read/write pointer compacting an array in place, or two pointers moving through a linked list at different speeds. None of these ever need to know something about an entire range at once, only the values or positions the pointers currently sit on.

If yes, that's [Two Pointers](./two-pointers/asking-the-right-questions.md).

If the problem doesn't reduce to two positions moving with no aggregate needed, move to the next question.

## Question 4: does a guess anywhere in the search space let you discard the rest of it without checking each one?

This holds whenever the data is sorted, or whenever some condition on a candidate answer is monotonic, false up to a point and true from there on, or the reverse. Checking one guess and finding it too small or too big tells you every guess on the wrong side is settled too, no need to look at them individually. That's not limited to searching a sorted array for a value, it also covers guessing an answer, a capacity, a speed, a distance, and checking whether that guess is feasible.

A range of possible answers is not enough on its own. Guessing pays off only when checking a guess is easier than computing the answer. If the only way to check a guess is to compute the real answer first, the guess adds nothing, and the problem needs a direct algorithm instead.

A guess that passes this test still deserves one more look at what the check does. If every check sorts what it has seen and takes the largest or smallest few, as in Furthest Building You Can Reach, where each guess gives the ladders to the biggest climbs so far, the same top-`k` work is redone from scratch on every guess. A heap does that work once, in a single walk, and Question 7 covers it. Binary search still gives a correct answer there, only a slower one.

If yes, that's [Binary Search](./binary-search/asking-the-right-questions.md).

If no guess settles a whole side, move to the next question.

## Question 5: do elements wait to be handled, and which one in the waiting list is settled first?

Some problems hold elements back. An opening bracket waits for its closer. A day waits for a warmer day. A senator waits for their next turn. A request waits until it is too old to count. An orange that just rotted waits to spread to its neighbors. An element waits when it has been read but cannot be finished yet, so it goes into a waiting list until something later settles it. The pattern is decided by one thing. When a new element arrives, which one in the waiting list does it settle first?

Take `( [ ]`. After `(` and `[` are read, both sit in the waiting list, since neither has its closer. Then `]` arrives and settles `[`, the one added to the list most recently. Now take pings at times `1`, `100`, and `3001`, all in the waiting list. Then `ping(3002)` arrives and drops `1`, the one added to the list earliest.

**The most recent one in the waiting list.** An arriving element settles the latest waiting one first, and keeps going until it reaches one it cannot settle, a closer matching the latest open bracket, a warm day answering the coldest waiting day. The waiting list is a [Stack](./stack/asking-the-right-questions.md). The wording cues are nested or matched items, cancellations, and "next greater", "previous smaller", "how far until", or "how far back".

**The earliest one in the waiting list.** Elements act in turn and go to the back of the list for their next turn, items expire oldest first, or something spreads one step at a time, where whatever was reached earlier is closer and has to spread first. The waiting list is a [Queue](./queue/asking-the-right-questions.md). The wording cues are "in order", "takes turns", "round", "moves to the bottom", "in the last `t` milliseconds", "every minute", and "fewest steps".

**The earliest ones leave the front of the waiting list by age, and beaten ones leave its back.** The waiting list is a deque, a queue that can also remove from the back, as in Sliding Window Maximum and in prefix-sum problems where a sliding window has failed.

**The best one in the waiting list by value, whenever it was added.** The waiting list is a heap, covered by the sorting gate in Question 7.

If nothing waits, move to the next question.

## Question 6: is the answer the same nodes connected differently, or does it need constant-time reordering?

When the input is a linked list, the statement usually says so, and the question is which technique it needs. If the answer is the same nodes in a new arrangement, reversed, regrouped, merged, rotated, with some removed, that is [Linked List](./linked-list/asking-the-right-questions.md) rewiring, changing where `.next` points. If the problem only needs a position inside the list, the middle, a cycle, a node a fixed distance from the end, and never redirects a pointer, it goes back to Question 3, fast and slow pointers.

The harder case is a list that is never mentioned. If a problem needs an element to move from anywhere to one end in constant time, as in a cache that tracks which key was used longest ago, or a current position that moves back and forth with everything ahead cut off on a new step, as in browser history, the structure underneath is a linked list, often paired with a hash map that points into it.

If the problem is not about rearranging nodes or reordering in constant time, move to the next question.

## Question 7: would sorting give the answer, but only the top part is needed, or the data keeps changing?

Start with the gate. A heap only knows order, so if sorting the data, again after every change if it changes, would not give the answer, a heap will not either. Problems where the answer depends on position, the nearest greater element, the maximum of every window, fail here, and belong to the Stack and Sliding Window questions above.

If sorting would give the answer, the choice is about cost. When nothing changes and the full order is needed, sort once. When only the top `k` are needed, the `k` largest, smallest, closest, or most frequent, or when the data keeps changing and its smallest or largest is needed after every change, a stream with a running median, a greedy process that takes the best choice and puts back what is left, several sorted sources merged by their fronts, that is [Heap](./heap/asking-the-right-questions.md). The wording cues are "`k`th largest", "top `k`", "after each addition", "always pick the smallest or largest next", and "merge `k` sorted".

## Still open

Everything past here, a decision that depends on subproblems rather than a single pass, doesn't have a question here yet. That's what the chapters after Heap will need to fill in.
