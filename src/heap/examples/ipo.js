// IPO
// https://leetcode.com/problems/ipo/description/
//
// Problem: start with capital w and finish at most k projects. Project i
// needs capital[i] to start and adds profits[i] to the capital when done.
// Capital is never spent, only required. Return the most capital possible.
//
// Sort projects by the capital they need, so the projects that become
// affordable can be added in order as capital grows. Among the affordable
// ones, always take the most profitable, which a max-heap holds.

const { Heap } = require('./heap');

function findMaximizedCapital(k, w, profits, capital) {
    const byCapital = profits.map((_, i) => i).sort((a, b) => capital[a] - capital[b]);
    const affordable = new Heap((a, b) => b - a);
    let next = 0;

    for (let done = 0; done < k; done++) {
        while (next < byCapital.length && capital[byCapital[next]] <= w) {
            affordable.push(profits[byCapital[next]]);
            next++;
        }

        if (affordable.size() === 0) break;
        w += affordable.pop();
    }

    return w;
}

module.exports = { findMaximizedCapital };
