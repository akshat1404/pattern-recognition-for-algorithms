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
