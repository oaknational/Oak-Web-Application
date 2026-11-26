# Testing instructions

Testing instructions let a reviewer or QA check the change for themselves. Write them so that someone who hasn't seen the work can follow them without help and know whether what they see is right. Give the steps and what to expect, and nothing else.

## What to include

1. **Where to test.** The repository's preview link, or a named environment. Don't link the deployment for a single commit, which goes out of date when the branch changes. If it's local, point to the set-up commands in `AGENTS.md` rather than repeating them.
2. **What you need first.** One short instruction for each prerequisite, such as an account type, a feature flag or test data, linking to the flag where you can. Name any configuration setting rather than writing out its value.
3. **Steps.** Numbered, one action per step, using the names people see on screen. Don't explain why a step is there.
4. **Expected results.** After each step that matters, what the reviewer should see. Be specific: "The lesson list shows three lessons", not "it works".
5. **Scenarios.** Cover only the behaviour this change affects. When there's more than one, give each a heading that names the behaviour, and start each from a fresh state. Leave out generic edge cases and troubleshooting.

## Good instructions

```markdown
Sign in to the preview deployment as a teacher.

### Saving without a title

1. Go to **My lessons** and select **Create lesson**.
2. Leave the title empty and select **Save**.
   - The error "Enter a lesson title" appears under the title field, and focus moves to it.

### Saving with a title

1. Go to **My lessons** and select **Create lesson**.
2. Enter "Fractions" as the title and select **Save**.
   - You return to **My lessons**, and "Fractions" is at the top of the list.
```

## Weak instructions

> Check the create lesson page works.

This doesn't say where to go, what to do or what "works" means, so every reviewer tests something different.

## User-facing changes

For changes people see, always include testing instructions, written so QA can follow them:

- Write explicit steps in plain English, naming the pages, buttons and labels people see, not the components or code behind them.
- Use technical terms only where there's no plain alternative, and say what they mean.
- Don't send QA to a command line or developer tools unless there's no other way to check the change.

### Before you hand over

Check these yourself:

- The change works with a keyboard as well as a mouse, including focus order and visible focus.
- It works at the screen sizes people use, such as a phone and a desktop.
- If a skill for accessibility review is available, such as `oak-accessibility-review`, follow it.

## Changes with no visible effect

For a refactor, a dependency upgrade or a back-end change, describe the check in the tool a tester would use, such as the staging site, a database viewer or the repository's Actions page. Put commands in a separate **Automated** group, and only when nothing else can check the change. If nothing can be checked by hand, say how a reviewer can tell the behaviour hasn't changed, such as which tests cover it.
