// Design Browser History
// https://leetcode.com/problems/design-browser-history/description/
//
// Problem: a browser starts on a homepage. visit(url) opens a new page
// and clears all forward history. back(steps) and forward(steps) move up
// to that many pages, stopping at either end, and return the current url.
//
// The pages form a doubly linked list with a pointer to the current page.
// Moving is stepping along prev or next. Visiting attaches a new page
// right after the current one, which drops everything that was ahead.

class Page {
    constructor(url) {
        this.url = url;
        this.prev = null;
        this.next = null;
    }
}

class BrowserHistory {
    constructor(homepage) {
        this.current = new Page(homepage);
    }

    visit(url) {
        const page = new Page(url);
        page.prev = this.current;
        this.current.next = page;
        this.current = page;
    }

    back(steps) {
        while (steps > 0 && this.current.prev !== null) {
            this.current = this.current.prev;
            steps--;
        }
        return this.current.url;
    }

    forward(steps) {
        while (steps > 0 && this.current.next !== null) {
            this.current = this.current.next;
            steps--;
        }
        return this.current.url;
    }
}

module.exports = { BrowserHistory };
