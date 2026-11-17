// Single-Threaded CPU
// https://leetcode.com/problems/single-threaded-cpu/description/
//
// Problem: tasks[i] = [enqueueTime, processingTime]. A CPU runs one task
// at a time to completion. When it is free, it picks, among the tasks that
// have arrived, the one with the shortest processing time, breaking ties
// by smallest index. If nothing has arrived, it waits for the next task.
// Return the order the tasks are run in.
//
// Sorting by arrival time says when tasks become available. A heap of the
// available tasks, shortest first, says which to run next.

const { Heap } = require('./heap');

function getOrder(tasks) {
    const byArrival = tasks.map((_, i) => i).sort((a, b) => tasks[a][0] - tasks[b][0]);
    const available = new Heap((a, b) => tasks[a][1] - tasks[b][1] || a - b);

    const order = [];
    let time = 0;
    let next = 0;

    while (order.length < tasks.length) {
        // Nothing to run: jump ahead to the next arrival.
        if (available.size() === 0 && time < tasks[byArrival[next]][0]) {
            time = tasks[byArrival[next]][0];
        }

        while (next < byArrival.length && tasks[byArrival[next]][0] <= time) {
            available.push(byArrival[next]);
            next++;
        }

        const task = available.pop();
        order.push(task);
        time += tasks[task][1];
    }

    return order;
}

module.exports = { getOrder };
