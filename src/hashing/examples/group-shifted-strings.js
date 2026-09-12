// Group Shifted Strings
// https://www.geeksforgeeks.org/dsa/group-shifted-string/1
//
// Problem: shifting a string moves every letter to the next one
// cyclically, "abc" shifts to "bcd", "xyz" shifts to "yza". Group
// the given strings so that strings reachable from each other by
// some number of shifts land in the same group. Strings of length 1
// are all considered part of the same group, whatever letter they
// hold.
//
// Shifting every letter by the same amount never changes the gap
// between consecutive letters, only where they sit in the alphabet.
// So the sequence of gaps between consecutive letters, wrapping
// around from z to a, is identical for every string in the same
// shift group, and different for strings that aren't shift-related.
// That sequence of gaps is the key.

function shiftKey(s) {
    const gaps = [];
    for (let i = 1; i < s.length; i++) {
        const gap = (s.charCodeAt(i) - s.charCodeAt(i - 1) + 26) % 26;
        gaps.push(gap);
    }
    // A length-1 string has no consecutive pair at all, so its gap
    // list is empty, and every length-1 string shares that same
    // empty key, which is exactly the rule the problem states.
    return gaps.join(",");
}

function groupStrings(strings) {
    const groups = new Map();

    for (const s of strings) {
        const key = shiftKey(s);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(s);
    }

    return [...groups.values()];
}

module.exports = { groupStrings };
