// Sum of Subarray Minimums
// https://leetcode.com/problems/sum-of-subarray-minimums/description/
//
// Problem: add up the minimum of every contiguous subarray of arr, and
// return the sum modulo 10^9 + 7.
//
// Group subarrays by where they end. endSum[j] is the sum of minimums of
// all subarrays ending at j. Let p be the previous smaller element. The
// subarrays starting after p have minimum arr[j], and the ones starting
// at or before p have the same minimums as the subarrays ending at p.

function sumSubarrayMins(arr) {
    const MOD = 1_000_000_007;
    const endSum = new Array(arr.length).fill(0);
    const stack = [];
    let total = 0;

    for (let j = 0; j < arr.length; j++) {
        // A smaller arrival takes over every subarray that reaches past it.
        while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[j]) {
            stack.pop();
        }

        const p = stack.length > 0 ? stack[stack.length - 1] : -1;
        const before = p >= 0 ? endSum[p] : 0;

        endSum[j] = (before + arr[j] * (j - p)) % MOD;
        total = (total + endSum[j]) % MOD;

        stack.push(j);
    }

    return total;
}

module.exports = { sumSubarrayMins };
