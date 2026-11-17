# Implementation

JavaScript has no built-in heap, so this page starts by building one. A heap is a plain array read as a tree. The element at index `i` has its children at `2i + 1` and `2i + 2`, and its parent at `Math.floor((i - 1) / 2)`. The one rule, the heap property, is that every parent comes before its children in the heap's order. For a min-heap, every parent is at most its children, so the smallest element is always at index `0`.

```
array  [1, 3, 2, 7, 4, 5]

tree         1
           /   \
          3     2
         / \   /
        7   4 5
```

Only the top is guaranteed. `3` and `2` are both children of `1`, but nothing says which of them is smaller, and the array as a whole is not sorted. That missing order is what makes a heap cheaper to change than a sorted array.

## The heap class

Two operations keep the heap property. `push` adds the new element at the end and moves it up, swapping with its parent while it comes before the parent. `pop` takes the top, moves the last element into its place, and moves that element down, swapping with its smaller child while a child comes before it. Each move follows one path from top to bottom, so both cost `log n`.

```javascript
class Heap {
    // compare(a, b) < 0 means a should be closer to the top than b.
    constructor(compare = (a, b) => a - b) {
        this.items = [];
        this.compare = compare;
    }

    size() {
        return this.items.length;
    }

    peek() {
        return this.items[0];
    }

    push(val) {
        this.items.push(val);
        let i = this.items.length - 1;

        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (this.compare(this.items[i], this.items[parent]) >= 0) break;
            [this.items[i], this.items[parent]] = [this.items[parent], this.items[i]];
            i = parent;
        }
    }

    pop() {
        const top = this.items[0];
        const last = this.items.pop();

        if (this.items.length > 0) {
            this.items[0] = last;
            let i = 0;

            while (true) {
                const left = 2 * i + 1;
                const right = 2 * i + 2;
                let first = i;

                if (left < this.items.length && this.compare(this.items[left], this.items[first]) < 0) first = left;
                if (right < this.items.length && this.compare(this.items[right], this.items[first]) < 0) first = right;
                if (first === i) break;

                [this.items[i], this.items[first]] = [this.items[first], this.items[i]];
                i = first;
            }
        }

        return top;
    }
}
```

The compare function decides what "top" means. The default makes a min-heap. A max-heap is `new Heap((a, b) => b - a)`, and a heap of points by distance is `new Heap((p, q) => dist(p) - dist(q))`. The same class covers every problem in this chapter.

## Top `k` of a fixed collection

Keep a heap that never holds more than `k` elements, with the worst of the kept ones on top. For the `k` largest, that is a min-heap. Each new element goes in, and if the heap grows past `k`, the top, the smallest kept element, comes out.

```javascript
function kLargest(nums, k) {
    const heap = new Heap();

    for (const num of nums) {
        heap.push(num);
        if (heap.size() > k) heap.pop();
    }

    return heap.items;
}
```

When the loop ends, the heap holds the `k` largest, and `heap.peek()` is the `k`th largest. The order is reversed from what the name suggests, the `k` largest need a min-heap, and the `k` smallest need a max-heap, because the top is always the element to throw out next.

## Two heaps for the middle

To read the middle of a changing collection, split it into a lower half in a max-heap and an upper half in a min-heap. Keep their sizes equal, or let the lower half have one extra.

```javascript
class MedianFinder {
    constructor() {
        this.lower = new Heap((a, b) => b - a);
        this.upper = new Heap();
    }

    addNum(num) {
        this.lower.push(num);
        this.upper.push(this.lower.pop());

        if (this.upper.size() > this.lower.size()) {
            this.lower.push(this.upper.pop());
        }
    }

    findMedian() {
        if (this.lower.size() > this.upper.size()) return this.lower.peek();
        return (this.lower.peek() + this.upper.peek()) / 2;
    }
}
```

Every new number passes through the lower half and its largest moves up, which keeps every number in the lower half at most every number in the upper half. Then, if the upper half has grown bigger, its smallest moves back down. Three heap moves per number, all `log n`.

## Take, update, put back

Greedy problems and merges repeat one move: take the best candidate, use it, and put back whatever replaces it. For merging sorted sources, what goes back is the next element from the same source.

```javascript
function mergeSortedArrays(arrays) {
    const heap = new Heap((a, b) => a.val - b.val);

    arrays.forEach((arr, source) => {
        if (arr.length > 0) heap.push({ val: arr[0], source, index: 0 });
    });

    const result = [];
    while (heap.size() > 0) {
        const { val, source, index } = heap.pop();
        result.push(val);

        if (index + 1 < arrays[source].length) {
            heap.push({ val: arrays[source][index + 1], source, index: index + 1 });
        }
    }

    return result;
}
```

Each heap entry remembers where it came from, so the next element from the same source can be found after it is taken. The heap never holds more than one entry per source.

## Without a heap

Writing the class takes a few minutes. When there is no time for it, sorting can stand in, and how well depends on the row of the cost table.

For a fixed collection, sort once and take what is needed. It costs `n log n` instead of `n log k`, which is almost always acceptable.

For a changing collection, keep a sorted array and insert each new element in its place. Binary search finds the place in `log n`.

```javascript
function insertSorted(arr, val) {
    let low = 0;
    let high = arr.length;

    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] < val) low = mid + 1;
        else high = mid;
    }

    arr.splice(low, 0, val);
}
```

The `splice` shifts every element after the insertion point, which is `O(n)` per insert, against `log n` for a heap. The shift is a fast block move, so it often passes for inputs in the tens of thousands, but it is worth naming the tradeoff. In exchange, the whole array stays sorted, so the median, or any position, can be read directly.

For merging `k` sorted sources, merging them in pairs, then the results in pairs, and so on, costs `N log k` in total, the same as the heap, using only the two-list merge.

LeetCode's JavaScript environment also provides `MinPriorityQueue` and `MaxPriorityQueue`, from the `@datastructures-js/priority-queue` library, with no import needed. Their method names have changed between versions of that library, so check what the editor accepts before relying on them.

## The one thing that actually matters

A heap is sorting that only keeps the top in order. Every problem here needs two decisions. What goes in the heap, numbers, points, fronts of lists, characters with counts. And what "top" means, which is the compare function, often the reverse of what the problem's wording suggests, since the top is the element to throw out or use next. Once both are named, the code is a loop of `push` and `pop`.
