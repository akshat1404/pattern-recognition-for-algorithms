// Find Players With Zero or One Losses
// https://leetcode.com/problems/find-players-with-zero-or-one-losses/description/
//
// Problem: given a list of [winner, loser] match results, return two
// sorted lists, players who never lost a match, and players who lost
// exactly one match.
//
// The key here isn't computed from a string, it's a plain count, how
// many losses a player has. Group every player by that count, and
// the two lists the problem wants are just two specific groups out
// of however many exist, the group for count 0 and the group for
// count 1.

function findWinners(matches) {
    const lossCount = new Map();

    for (const [winner, loser] of matches) {
        // A winner needs to exist in the map with 0 losses if we
        // haven't seen them yet, but a winner who already has a
        // loss on record from an earlier match must keep that count.
        if (!lossCount.has(winner)) {
            lossCount.set(winner, 0);
        }
        lossCount.set(loser, (lossCount.get(loser) || 0) + 1);
    }

    const groupsByLossCount = new Map();
    for (const [player, losses] of lossCount) {
        if (!groupsByLossCount.has(losses)) groupsByLossCount.set(losses, []);
        groupsByLossCount.get(losses).push(player);
    }

    const zeroLosses = (groupsByLossCount.get(0) || []).sort((a, b) => a - b);
    const oneLoss = (groupsByLossCount.get(1) || []).sort((a, b) => a - b);

    return [zeroLosses, oneLoss];
}

module.exports = { findWinners };
