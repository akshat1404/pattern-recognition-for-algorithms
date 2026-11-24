// Successful Pairs of Spells and Potions
// https://leetcode.com/problems/successful-pairs-of-spells-and-potions/description/
//
// Problem: for each spell, count the potions whose product with the spell
// is at least success.
//
// Sort the potions. For one spell, "is spell * potion at least success?" is
// no for weak potions and yes from some point on. Binary search finds the
// first yes, and every potion from there to the end succeeds.

function successfulPairs(spells, potions, success) {
    potions.sort((a, b) => a - b);
    const m = potions.length;
    const pairs = [];

    for (const spell of spells) {
        let low = 0;
        let high = m - 1;
        let first = m; // no potion succeeds until one is found

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);

            if (spell * potions[mid] >= success) {
                first = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }

        pairs.push(m - first);
    }

    return pairs;
}

module.exports = { successfulPairs };
