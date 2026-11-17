// Last Stone Weight
// https://leetcode.com/problems/last-stone-weight/description/
//
// Problem: each turn, smash the two heaviest stones together. Equal
// weights destroy both; otherwise the lighter is destroyed and the heavier
// loses the lighter's weight. Return the weight of the last stone left,
// or 0 if none is left.
//
// Every turn needs the two heaviest of a collection that changes after
// the turn, so the stones go in a max-heap.

const { Heap } = require('./heap');

function lastStoneWeight(stones) {
    const heap = new Heap((a, b) => b - a);
    for (const stone of stones) heap.push(stone);

    while (heap.size() > 1) {
        const first = heap.pop();
        const second = heap.pop();
        if (first !== second) heap.push(first - second);
    }

    return heap.size() === 1 ? heap.peek() : 0;
}

module.exports = { lastStoneWeight };
