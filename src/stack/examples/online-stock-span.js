// Online Stock Span
// https://leetcode.com/problems/online-stock-span/description/
//
// Problem: prices arrive one day at a time through next(price). Each call
// returns the span, the number of consecutive days back from today,
// today included, whose price was at or below today's price.
//
// The span ends at the previous day with a greater price. The stack holds
// the indices of days still waiting to be that day for someone, in
// falling price order. Days at or below today's price are popped, since
// any later day that reaches past today reaches past them too.

class StockSpanner {
    constructor() {
        this.prices = [];
        this.stack = [];
    }

    next(price) {
        const today = this.prices.length;
        this.prices.push(price);

        while (this.stack.length > 0 && this.prices[this.stack[this.stack.length - 1]] <= price) {
            this.stack.pop();
        }

        const span = this.stack.length > 0
            ? today - this.stack[this.stack.length - 1]
            : today + 1;

        this.stack.push(today);
        return span;
    }
}

module.exports = { StockSpanner };
