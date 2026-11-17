// LRU Cache
// https://leetcode.com/problems/lru-cache/description/
//
// Problem: a cache with a fixed capacity. get(key) returns the value or
// -1, and put(key, value) stores it. Both count as a use. When a new key
// would go over capacity, the key used longest ago is removed. Both
// operations must run in constant time on average.
//
// A Map finds a key's node. A doubly linked list keeps the nodes in order
// of use, most recent at the front, and can move any node to the front or
// drop the one at the back in constant time.

class DNode {
    constructor(key, val) {
        this.key = key;
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.nodes = new Map();

        // Placeholders at both ends, so every real node has two neighbors.
        this.front = new DNode(null, null);
        this.back = new DNode(null, null);
        this.front.next = this.back;
        this.back.prev = this.front;
    }

    get(key) {
        if (!this.nodes.has(key)) return -1;

        const node = this.nodes.get(key);
        this.remove(node);
        this.addToFront(node);
        return node.val;
    }

    put(key, val) {
        if (this.nodes.has(key)) {
            const node = this.nodes.get(key);
            node.val = val;
            this.remove(node);
            this.addToFront(node);
            return;
        }

        const node = new DNode(key, val);
        this.nodes.set(key, node);
        this.addToFront(node);

        if (this.nodes.size > this.capacity) {
            const oldest = this.back.prev;
            this.remove(oldest);
            this.nodes.delete(oldest.key);
        }
    }

    remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    addToFront(node) {
        node.next = this.front.next;
        node.prev = this.front;
        this.front.next.prev = node;
        this.front.next = node;
    }
}

module.exports = { LRUCache };
