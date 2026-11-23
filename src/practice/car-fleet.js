// Car Fleet
// https://leetcode.com/problems/car-fleet/description/
//
// Problem: cars drive toward target on one lane and cannot pass. A car that
// catches a slower one ahead, at or before target, drives with it as one
// fleet. Return the number of fleets that arrive.
//
// Each car's time alone is (target - position) / speed. Walk the cars from
// the back of the road to the front. A car waits until a slower car ahead
// shows up, and a new car settles the most recent waiting cars first, so
// the waiting cars form a stack. Whatever is left waiting are the fleets.

function carFleet(target, position, speed) {
    const cars = position.map((start, i) => [start, (target - start) / speed[i]]);
    cars.sort((a, b) => a[0] - b[0]);

    const stack = [];

    for (const [, time] of cars) {
        // Cars behind that would arrive no later catch this car and join it.
        while (stack.length > 0 && stack[stack.length - 1] <= time) {
            stack.pop();
        }
        stack.push(time);
    }

    return stack.length;
}

// The same answer walking from the front of the road to the back. Every car
// ahead is already decided, so only the time of the fleet directly ahead is
// needed, and nothing waits.
function carFleetFromFront(target, position, speed) {
    const cars = position.map((start, i) => [start, (target - start) / speed[i]]);
    cars.sort((a, b) => b[0] - a[0]);

    let fleets = 0;
    let fleetTime = 0;

    for (const [, time] of cars) {
        if (time > fleetTime) {
            fleets++;
            fleetTime = time;
        }
    }

    return fleets;
}

module.exports = { carFleet, carFleetFromFront };
