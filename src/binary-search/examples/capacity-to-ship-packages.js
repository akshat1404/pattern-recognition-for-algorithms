// Capacity To Ship Packages Within D Days
// https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/description/
//
// Problem: weights[i] is the weight of the ith package. Each day the ship
// loads packages in order, never skipping one, without going over its
// capacity. Return the smallest capacity that ships everything within
// `days` days.
//
// Every way of splitting the packages into days has a heaviest day, and
// the answer is the split whose heaviest day is lightest. Trying every
// split is hopeless, so guess a capacity instead and check whether it
// works. A capacity that works keeps working when bigger, so the answers
// flip once, and the smallest one that works is found by binary search.

function shipWithinDays(weights, days) {
    let low = Math.max(...weights);
    let high = weights.reduce((sum, w) => sum + w, 0);
    let answer = high;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        if (daysNeeded(weights, mid) <= days) {
            answer = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    return answer;
}

// Fill each day as full as possible, then start the next one.
function daysNeeded(weights, capacity) {
    let count = 1;
    let load = 0;

    for (const w of weights) {
        if (load + w > capacity) {
            count++;
            load = 0;
        }
        load += w;
    }

    return count;
}

module.exports = { shipWithinDays };
