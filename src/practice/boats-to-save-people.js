// Boats to Save People
// https://leetcode.com/problems/boats-to-save-people/description/
//
// Problem: each boat carries at most two people with a total weight of at
// most limit. Return the fewest boats that carry everyone.
//
// Sort the weights. The heaviest person left always takes the next boat.
// If the lightest person left fits with them, the lightest goes too.

function numRescueBoats(people, limit) {
    people.sort((a, b) => a - b);

    let low = 0;
    let high = people.length - 1;
    let boats = 0;

    while (low <= high) {
        // The lightest rides with the heaviest when they fit together.
        if (people[low] + people[high] <= limit) low++;

        high--;
        boats++;
    }

    return boats;
}

module.exports = { numRescueBoats };
