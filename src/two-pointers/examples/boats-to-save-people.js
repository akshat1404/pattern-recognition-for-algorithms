// Boats to Save People
// https://leetcode.com/problems/boats-to-save-people/description/
//
// Problem: given each person's weight and a weight limit per boat,
// where a boat carries at most two people, return the minimum
// number of boats needed to carry everyone. Every person fits alone
// under the limit on their own.
//
// Sort first, then converge. The heaviest person remaining always
// needs a boat, the only question is whether the lightest person
// remaining can share it with them. If the lightest can't fit with
// the heaviest, nobody heavier could have either, so the heaviest
// goes alone. If the lightest can fit, pairing them is always at
// least as good as pairing the lightest with anyone else, since
// everyone else has an easier time fitting with someone regardless.

function numRescueBoats(people, limit) {
    const sorted = [...people].sort((a, b) => a - b);
    let left = 0;
    let right = sorted.length - 1;
    let boats = 0;

    while (left <= right) {
        if (sorted[left] + sorted[right] <= limit) {
            // Lightest remaining person fits with the heaviest.
            left++;
        }
        // Heaviest remaining person always takes a boat, either
        // alone or paired with the lightest, one boat either way.
        right--;
        boats++;
    }

    return boats;
}

module.exports = { numRescueBoats };
