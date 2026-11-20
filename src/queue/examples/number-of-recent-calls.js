// Number of Recent Calls
// https://leetcode.com/problems/number-of-recent-calls/description/
//
// Problem: ping(t) records a request at time t, in milliseconds, and
// returns how many requests happened from t - 3000 to t, this one
// included. Each call's t is larger than the one before.
//
// Times only go up, so requests stop counting in the order they arrived.
// New requests join the back, expired ones leave the front, and the
// answer is how many are left in between.

class RecentCounter {
    constructor() {
        this.times = [];
        this.head = 0;
    }

    ping(t) {
        this.times.push(t);

        while (this.times[this.head] < t - 3000) {
            this.head++;
        }

        return this.times.length - this.head;
    }
}

module.exports = { RecentCounter };
