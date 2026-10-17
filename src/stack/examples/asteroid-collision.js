// Asteroid Collision
// https://leetcode.com/problems/asteroid-collision/description/
//
// Problem: each integer is an asteroid, its absolute value the size and
// its sign the direction, positive moving right and negative moving left.
// When two meet, the smaller explodes, and equal sizes both explode.
// Return the asteroids left after all collisions.
//
// The stack holds the survivors so far. A right-moving asteroid cannot
// hit anything yet, so it is pushed. A left-moving one meets the most
// recent survivor first, the top, and keeps going while it wins.

function asteroidCollision(asteroids) {
    const stack = [];

    for (const a of asteroids) {
        if (a > 0) {
            stack.push(a);
            continue;
        }

        // Smaller right-moving asteroids on top explode.
        while (stack.length > 0 && stack[stack.length - 1] > 0 && stack[stack.length - 1] < -a) {
            stack.pop();
        }

        if (stack.length > 0 && stack[stack.length - 1] === -a) {
            // Same size, both explode.
            stack.pop();
        } else if (stack.length === 0 || stack[stack.length - 1] < 0) {
            // Nothing moving right is left to hit it.
            stack.push(a);
        }
        // Otherwise a bigger right-moving asteroid is on top, and a explodes.
    }

    return stack;
}

module.exports = { asteroidCollision };
