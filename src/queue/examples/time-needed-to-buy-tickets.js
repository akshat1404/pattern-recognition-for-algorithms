// Time Needed to Buy Tickets
// https://leetcode.com/problems/time-needed-to-buy-tickets/description/
//
// Problem: person i wants tickets[i] tickets. Each second, the person at
// the front buys one ticket, then goes to the back if they need more, or
// leaves if done. Return the seconds until person k is done.
//
// Simulate the line. The queue holds people by index, and `head` marks
// the front, so taking from the front does not shift the array.

function timeRequiredToBuy(tickets, k) {
    const left = tickets.slice();
    const queue = tickets.map((_, i) => i);
    let head = 0;
    let time = 0;

    while (true) {
        const person = queue[head];
        head++;

        left[person]--;
        time++;

        if (left[person] === 0) {
            if (person === k) return time;
        } else {
            queue.push(person);
        }
    }
}

// Without a queue: before person k finishes, everyone at or before k buys
// up to tickets[k], and everyone after k buys up to tickets[k] - 1.
function timeRequiredToBuyByCounting(tickets, k) {
    let time = 0;

    for (let i = 0; i < tickets.length; i++) {
        const limit = i <= k ? tickets[k] : tickets[k] - 1;
        time += Math.min(tickets[i], limit);
    }

    return time;
}

module.exports = { timeRequiredToBuy, timeRequiredToBuyByCounting };
