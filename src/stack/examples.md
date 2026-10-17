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
