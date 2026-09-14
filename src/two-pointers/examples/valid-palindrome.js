// Valid Palindrome
// https://leetcode.com/problems/valid-palindrome/description/
//
// Problem: given a string, considering only letters and digits and
// ignoring case, determine whether it reads the same forwards and
// backwards.
//
// No numeric order here at all, just positional order, a fixed
// first character and last character. Converging inward compares
// character by character. A mismatch proves the answer is false
// immediately, no need to check anything else. A match settles that
// pair for good, both sides move inward without ever revisiting it.

function isAlphanumeric(ch) {
    return /[a-z0-9]/i.test(ch);
}

function isPalindrome(s) {
    let left = 0;
    let right = s.length - 1;

    while (left < right) {
        // Skip anything that isn't a letter or digit before comparing.
        while (left < right && !isAlphanumeric(s[left])) left++;
        while (left < right && !isAlphanumeric(s[right])) right--;

        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }

        left++;
        right--;
    }

    return true;
}

module.exports = { isPalindrome };
