// Grumpy Bookstore Owner
// https://leetcode.com/problems/grumpy-bookstore-owner/description/
//
// Problem: customers[i] people enter during minute i. If grumpy[i]
// is 1, the owner is grumpy that minute and those customers leave
// unsatisfied. The owner can use a technique once, staying calm for
// `minutes` consecutive minutes. Return the maximum number of
// satisfied customers.
//
// Some customers are satisfied no matter what, the ones arriving
// while the owner is calm. That is a fixed baseline. The technique
// only changes customers arriving during grumpy minutes inside its
// window, so the gain of a window is the customers in grumpy minutes
// inside it. The window tracks only that gain, not the total.
// Fixed size, `minutes`, maximize the gain. The answer is the
// baseline plus the best gain.

function maxSatisfied(customers, grumpy, minutes) {
    let baseline = 0;
    for (let i = 0; i < customers.length; i++) {
        if (grumpy[i] === 0) baseline += customers[i];
    }

    let gain = 0;
    for (let i = 0; i < minutes; i++) {
        if (grumpy[i] === 1) gain += customers[i];
    }
    let bestGain = gain;

    for (let right = minutes; right < customers.length; right++) {
        // The entering minute only adds to the gain if it is grumpy.
        if (grumpy[right] === 1) gain += customers[right];
        // The leaving minute only comes out if it was counted.
        if (grumpy[right - minutes] === 1) gain -= customers[right - minutes];
        bestGain = Math.max(bestGain, gain);
    }

    return baseline + bestGain;
}

module.exports = { maxSatisfied };
