// The heap class from Implementation, shared by every example in this chapter.

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

module.exports = { Heap };
