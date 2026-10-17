# Stack: Examples

Worked problems, reasoning and code together, one shape at a time.

## Matching and Nesting

[Minimum Remove to Make Valid Parentheses](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/description/) gives a string `s` of `(`, `)`, and lowercase letters, and asks for as few parentheses as possible to be removed so that the rest is valid. Valid means every `(` has a later `)` closing it, and every `)` closes an earlier `(`. Any valid result can be returned. `"lee(t(c)o)de)"` becomes `"lee(t(c)o)de"`, `"a)b(c)d"` becomes `"ab(c)d"`, and `"))(("` becomes `""`.

**Asks for.** A cleaned string, not a yes or no.

**Offers.** Openers that wait for a closer, where the latest open one is the one a closer matches, the same as in Valid Parentheses.

The first idea is to run Valid Parentheses and look at what is left on the stack. That finds part of the answer. Valid Parentheses can stop at the first problem it meets, but here every bad bracket has to be found, and they come in two kinds that show up at different times.

A `)` that arrives while the stack is empty has nothing to close. It is bad the moment it arrives, and since it never goes on the stack, the leftover stack will never show it. It has to be marked for removal right then. In `"a)b(c)d"`, the `)` at index `1` is the one to remove, and the stack ends empty.

A `(` that is still on the stack when the string ends never got its closer. It is bad too, but that is only known at the end.

To remove a leftover `(`, we need its position, not just the fact that one is left. So the stack holds indices instead of characters. At the end, every index still on the stack joins the marked ones, and the string is rebuilt without any marked index.

| Kind | When it is found | Where it comes from |
|---|---|---|
| `)` with nothing open | When it arrives | Marked on the spot |
| `(` never closed | At the end | Indices left on the stack |

Take `"lee(t(c)o)de)"`.

```
i    char  action                  stack
3    (     push 3                  3
5    (     push 5                  3 5
7    )     pop 5                   3
9    )     pop 3                   empty
12   )     nothing open, mark 12   empty
end        nothing left to mark
remove {12}, the result is "lee(t(c)o)de"
```

In `"))(("`, indices `0` and `1` are marked as they arrive, and `2` and `3` are left on the stack, so all four go and the result is `""`.

This removes as few as possible. Every bracket removed had no partner at all, and every matched pair is kept, so no removed bracket could have been saved.

```javascript
{{#include ./examples/minimum-remove-to-make-valid-parentheses.js}}
```

[Asteroid Collision](https://leetcode.com/problems/asteroid-collision/description/) gives an array of integers, one per asteroid in a row. The absolute value is the asteroid's size, and the sign is its direction, positive moving right and negative moving left. All move at the same speed. When two meet, the smaller one explodes, and if they are the same size, both explode. Two moving in the same direction never meet. It asks for the asteroids left after all collisions. `[5, 10, -5]` becomes `[5, 10]`, `[8, -8]` becomes `[]`, `[10, 2, -5]` becomes `[10]`, and `[-2, -1, 1, 2]` stays as it is, since nothing meets.

**Asks for.** What survives.

**Offers.** An arriving asteroid that only ever meets the most recent survivor first.

For a right-moving asteroid to be in the final answer, it has to be bigger than every left-moving asteroid that reaches it. A right-moving asteroid cannot be decided when it is read, since its fate depends on left-moving asteroids that come later. So it waits on the stack. The stack holds the survivors so far, and right-moving asteroids are always pushed.

The work happens when a left-moving asteroid arrives. It travels back through the survivors and meets the top first, the most recent one. As long as the top is right-moving, there are three outcomes, and the comparison is between sizes, the top against the arrival's absolute value.

| Top compared with the arrival | Result | Next |
|---|---|---|
| Smaller | The top explodes and is popped | Check the new top |
| Same size | Both explode, the top is popped | Stop, the arrival is not pushed |
| Bigger | The arrival explodes | Stop, the arrival is not pushed |

Only the first case keeps going. If the arrival destroys every right-moving asteroid on top and reaches an empty stack, or a top that is also moving left, nothing can reach it any more, and it is pushed. That is why left-moving asteroids at the start, as in `[-2, -1, 1, 2]`, survive. Nothing right-moving comes before them.

Take `[10, 2, -5]`.

```
read  action                              stack
10    moving right, push                  10
2     moving right, push                  10 2
-5    top 2 is smaller, pop it            10
      top 10 is bigger, -5 explodes       10
result [10]
```

In one line, right-moving asteroids are always pushed, and a left-moving one pops smaller right-moving asteroids off the top, then either dies on one at least its size, or is pushed once nothing moving right is left on top.

```javascript
{{#include ./examples/asteroid-collision.js}}
```

[Simplify Path](https://leetcode.com/problems/simplify-path/description/) gives an absolute Unix path, starting with `/`, and asks for its simplified form. A `.` means the current directory and does nothing. A `..` means go up one directory, and at the root it stays at the root. Several slashes in a row count as one. Any other name is a directory, including `...`. The result starts with `/`, has single slashes between names, no trailing slash, and no `.` or `..`. `"/home//foo/"` becomes `"/home/foo"`, `"/../"` becomes `"/"`, and `"/.../a/../b/c/../d/./"` becomes `"/.../b/d"`.

**Asks for.** A cleaned path.

**Offers.** A `..` that removes the most recent directory still in the path, a cancellation like the asteroids.

The stack holds directory names. Each name is pushed as it is read, and a `..` pops the most recent one, the directory it leaves. At the end, the names still on the stack are the path, joined with `/` and with a `/` in front.

Splitting the path on `/` gives the pieces, but it also gives empty ones. `"/home//foo/".split("/")` is `["", "home", "", "foo", ""]`, an empty piece for the leading slash, one for the double slash, and one for the trailing slash. They are skipped the same way as `.`. A `..` at the root finds the stack empty, and since there is nothing above the root, it does nothing.

| Piece | Action |
|---|---|
| `""` or `.` | Skip |
| `..` | Pop, if the stack is not empty |
| Any other name, including `...` | Push |

Take `"/home/user/Documents/../../Pictures/../"`.

```
piece      action   stack
""         skip
home       push     home
user       push     home user
Documents  push     home user Documents
..         pop      home user
..         pop      home
Pictures   push     home Pictures
..         pop      home
""         skip     home
result "/home"
```

An empty stack at the end gives `"/" + ""`, which is `"/"`, so the root needs no special case.

```javascript
{{#include ./examples/simplify-path.js}}
```

## Monotonic Stack

A monotonic stack is a stack whose values, from bottom to top, always run in one direction, all falling or all rising. Nothing sorts it. Before a new value is pushed, every value on top that would break the order is popped, so the order holds when it lands. And it does not hold every element, only the ones that can still be someone's answer. The popped ones are gone for good.

[Online Stock Span](https://leetcode.com/problems/online-stock-span/description/) gives prices one day at a time through a call `next(price)`. Each call returns that day's span, the number of consecutive days, counting back from today and including today, whose price was at or below today's price. For prices `[100, 80, 60, 70, 60, 75, 85]`, the spans are `[1, 1, 1, 2, 1, 4, 6]`. The `75` covers itself, `60`, `70`, and `60`, and stops at `80`.

**Asks for.** For each day, how far back it reaches before a bigger price stops it, the previous greater element.

**Offers.** Prices that arrive one at a time, with nothing known about the days to come.

Compare each new price with the last element of the stack, and pop until that element is greater than the new price. Whatever is left on top is the previous greater day, where the span stops. Popping is safe. When `75` arrives, the days `60`, `70`, and `60` are covered, and any later day that reaches back past `75` reaches past them too. No later day will ever stop at them, so they never need to be looked at again.

The stack holds indices, the day numbers, and the span comes from them. Today's span runs from the day after the previous greater day up to today, so it is `today - top`. If the stack is empty, no earlier day was greater, and the span reaches all the way back to day `0`, which is `today + 1`. Since prices arrive through calls instead of as an array, the prices seen so far are kept in an array of their own, so the stack's indices can be looked up.

```
day  price  pops            top left  span        stack (prices)
0    100                    none      0 + 1 = 1   100
1    80                     0         1 - 0 = 1   100 80
2    60                     1         2 - 1 = 1   100 80 60
3    70     day 2 (60)      1         3 - 1 = 2   100 80 70
4    60                     3         4 - 3 = 1   100 80 70 60
5    75     days 4, 3       1         5 - 1 = 4   100 80 75
6    85     days 5, 1       0         6 - 0 = 6   100 85
```

Every row of the stack is falling from bottom to top, and no sort ever ran.

```javascript
{{#include ./examples/online-stock-span.js}}
```

[Remove K Digits](https://leetcode.com/problems/remove-k-digits/description/) gives a string `num` of digits and a number `k`, and asks for exactly `k` digits to be removed so that the remaining number is as small as possible, with the remaining digits kept in their original order. The result is returned as a string with no leading zeros, or `"0"` if nothing is left. `"1432219"` with `k = 3` becomes `"1219"`, `"10200"` with `k = 1` becomes `"200"`, and `"10"` with `k = 2` becomes `"0"`.

**Asks for.** The smallest number after removing `k` digits.

**Offers.** Digits in a fixed order, where a digit further left matters more than every digit after it.

Nothing in the statement says "next greater" or "previous smaller", so the stack is not in the wording. It comes from the goal. The final number has `n - k` digits, so there are `n - k` positions to fill, and each one should hold the smallest digit it can. Filling them from the left matters most, since a smaller digit in an earlier position beats anything after it, `1999` is smaller than `2000`.

One way to fill the positions is to pick, for each one, the smallest digit within reach. A position can only reach so far ahead, since enough digits have to be left to fill the positions after it. In `"1432219"` with `k = 3` there are four positions, and the first can choose from `1 4 3 2`, so it takes `1`. That works, but it scans the same digits again for every position.

The stack reaches the same result in one pass. It builds the answer as it reads, and corrects it when a better digit arrives. If the new digit is smaller than the digit on top, and removals are left, the top was a worse choice for its position. It is popped, one removal is used, and the new top is checked the same way. Otherwise the new digit is pushed. Each pop gives an earlier position a smaller digit.

```
digit  action                      k left  stack
1      push                        3       1
4      push                        3       1 4
3      4 is bigger, pop it         2       1
       push 3                      2       1 3
2      3 is bigger, pop it         1       1
       push 2                      1       1 2
2      equal, push                 1       1 2 2
1      2 is bigger, pop it         0       1 2
       no removals left, push      0       1 2 1
9      push                        0       1 2 1 9
result "1219"
```

The stack never ends up too short. Each pop uses one removal, and pops stop when `k` reaches `0`, so at most `k` digits go and at least `n - k` remain. The reach limit from the first idea is built into the counter.

It can end up too long. If removals are left over at the end, as in `"12345"` with `k = 2`, where no digit is ever smaller than the one before it, the stack holds more than `n - k` digits. The extra ones come off the end. If removals were left over, no pop was ever stopped for lack of removals, so the stack never goes down from bottom to top, and its largest digits are at the end. `"12345"` keeps its first three, `"123"`.

The last step is leading zeros. `"10200"` with `k = 1` pops the `1` when the `0` arrives and leaves `"0200"`, which is stripped to `"200"`. If nothing is left after stripping, the answer is `"0"`.

```javascript
{{#include ./examples/remove-k-digits.js}}
```
