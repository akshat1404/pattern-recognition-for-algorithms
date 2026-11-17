// Top K Frequent Words
// https://leetcode.com/problems/top-k-frequent-words/description/
//
// Problem: return the k most frequent words, ordered by frequency from
// highest to lowest, with ties broken alphabetically.
//
// Count the words with a map, then keep the k best in a heap whose top is
// the worst of the kept ones: the lowest count, or for equal counts, the
// word that comes last alphabetically. Popping everything gives the k
// best from worst to best, so the result is reversed at the end.

const { Heap } = require('./heap');

function topKFrequent(words, k) {
    const counts = new Map();
    for (const word of words) {
        counts.set(word, (counts.get(word) || 0) + 1);
    }

    const heap = new Heap((a, b) => {
        if (a.count !== b.count) return a.count - b.count;
        if (a.word > b.word) return -1;
        if (a.word < b.word) return 1;
        return 0;
    });

    for (const [word, count] of counts) {
        heap.push({ word, count });
        if (heap.size() > k) heap.pop();
    }

    const result = [];
    while (heap.size() > 0) {
        result.push(heap.pop().word);
    }

    return result.reverse();
}

module.exports = { topKFrequent };
