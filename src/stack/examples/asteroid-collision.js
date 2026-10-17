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
        let alive = true;

        while (alive && a < 0 && stack.length > 0 && stack[stack.length - 1] > 0) {
            const top = stack[stack.length - 1];

            if (top < -a) {
                stack.pop();
            } else if (top === -a) {
                stack.pop();
                alive = false;
            } else {
                alive = false;
            }
        }

        if (alive) stack.push(a);
    }

    return stack;
}

module.exports = { asteroidCollision };
