// Minimum Number of Days to Make m Bouquets
// https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/description/
//
// Problem: bloomDay[i] is the day flower i blooms. A bouquet needs k
// adjacent bloomed flowers, and each flower goes in at most one bouquet.
// Return the smallest day by which m bouquets can be made, or -1.
//
// The answer is a day, so guess one and check it. A day that works keeps
// working on every later day, since flowers never un-bloom. The range is
// from the earliest bloom to the latest, and if m bouquets need more
// flowers than exist, no day works at all.

function minDays(bloomDay, m, k) {
    if (m * k > bloomDay.length) return -1;

    let low = Math.min(...bloomDay);
    let high = Math.max(...bloomDay);
    let answer = high;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        if (bouquetsBy(bloomDay, k, mid) >= m) {
            answer = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    return answer;
}

// Count runs of bloomed flowers, taking a bouquet every time a run reaches k.
function bouquetsBy(bloomDay, k, day) {
    let bouquets = 0;
    let run = 0;

    for (const d of bloomDay) {
        if (d <= day) {
            run++;
            if (run === k) {
                bouquets++;
                run = 0;
            }
        } else {
            run = 0;
        }
    }

    return bouquets;
}

module.exports = { minDays };
