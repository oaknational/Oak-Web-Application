# Writing the description

The description tells a reviewer, briefly, why the change exists and what it does.

## What and why

Write two sentences, about 50 words in all: first the problem or the old behaviour, then what the change does. Add a third only for a separate, smaller fix in the same pull request. Keep each sentence short, because long sentences defeat a sentence limit.

When the pull request makes two or more separate changes, write one line that sums them up, then one short bullet per change. Never list changes file by file.

Leave out:

- how the code works, such as its internal mechanics, function and type names, or design values like sizes and colours;
- the story of the work, such as dates, how the ticket changed, what you tried first and how you checked it;
- the reasons behind decisions, and the alternatives you rejected;
- reassurance. The one exception is a single sentence saying what the change doesn't affect, when it could look broader than it is.

If a reviewer must do something before merging, such as merge another pull request first, say so in one line starting with `>`, at the top.

Too little: "Updates the search component."

Too much: "This refactors the `sortResults` helper to take a comparator and adds an `exactTitleFirst` comparator that lowercases both strings. I first tried sorting in the API, but that broke pagination. All 214 tests pass locally."

Right: "Teachers searching for a lesson by its exact title often saw it on the second page, because results were sorted by date. This sorts exact title matches first. Closes #1234."
