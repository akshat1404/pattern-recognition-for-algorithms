// Open the Lock
// https://leetcode.com/problems/open-the-lock/description/
//
// Problem: a lock has 4 wheels, each showing a digit 0 to 9 that wraps
// around. It starts at "0000". One turn moves one wheel one slot up or
// down. Combinations in deadends jam the lock and cannot be passed
// through. Return the fewest turns to reach target, or -1.
//
// Each combination is a state, and each state has 8 neighbors, one turn
// away. BFS from "0000" reaches every state in order of turns, so the
// first time target is reached, it is reached in the fewest turns.

function openLock(deadends, target) {
    const seen = new Set(deadends);
    if (seen.has('0000')) return -1;

    const turns = new Map([['0000', 0]]);
    seen.add('0000');
    const queue = ['0000'];
    let head = 0;

    while (head < queue.length) {
        const state = queue[head++];
        if (state === target) return turns.get(state);

        for (let wheel = 0; wheel < 4; wheel++) {
            const digit = Number(state[wheel]);

            for (const move of [1, 9]) {
                // +9 mod 10 is the same as one slot down.
                const next = state.slice(0, wheel) + ((digit + move) % 10) + state.slice(wheel + 1);
                if (seen.has(next)) continue;

                seen.add(next);
                turns.set(next, turns.get(state) + 1);
                queue.push(next);
            }
        }
    }

    return -1;
}

module.exports = { openLock };
