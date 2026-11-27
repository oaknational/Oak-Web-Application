# Security review checklist

Detailed questions for each area of a security review. Skip the ones that don't apply to the change, and spend the most time where untrusted input meets something powerful.

## Authentication and authorisation

- Is every new route, endpoint, server action and API handler protected as it should be? Check the server-side code, not only whether a button is hidden in the interface.
- Does each action check that this person may act on this particular record, not just that they're signed in? Look for record identifiers taken from the request and used without an ownership or permission check.
- Is access denied by default, so a new route is protected unless it's deliberately public?
- Are role and permission checks done in one shared place rather than repeated, and possibly missed, in each handler?
- Are tokens and sessions verified properly: signature, expiry, audience and issuer, with algorithms fixed rather than taken from the token?
- Do sign-in, password reset and invitation flows avoid revealing whether an account exists, and are they rate limited?
- After a privilege change, such as a role being removed, does access stop promptly?

## Input handling

- Is every input validated at the boundary against a schema, with types, lengths, formats and allowed values, and rejected when invalid?
- Are database queries parameterised, or built with a query builder or ORM that does it, rather than by joining strings?
- Is untrusted input kept out of shell commands? Prefer running a program with an argument list and no shell, and never pass input to a command interpreter.
- Are file paths built from input confined to an expected folder, after resolving `..` and symlinks?
- Are outbound requests to URLs from input restricted to expected hosts, so the server can't be made to call internal services?
- Is untrusted text rendered as text, not HTML? Look for raw HTML rendering, such as React's `dangerouslySetInnerHTML`, and Markdown or rich text rendered without sanitising.
- Do redirects go only to allowed destinations, rather than to any URL in a query string?
- Is untrusted data kept away from `eval`, `new Function`, dynamic `import` of a path from input, and template engines that execute code?
- When objects from input are merged into other objects, are keys such as `__proto__` and `constructor` blocked?
- Is mass assignment prevented? Copy only the fields the caller may set from a request into a record, so a request can't set a role, an owner or a price.
- Could a crafted input make a regular expression run for a very long time? Watch for nested repetition in patterns applied to input.
- Are uploaded files checked for type and size, stored outside the web root or in object storage, and served with safe headers?
- Are limits set on request size, pagination and anything a caller can make expensive?

## Secrets

- Are there credentials, tokens, private keys, connection strings or passwords in the change, including tests, fixtures, examples and comments?
- Do secrets come from environment variables or a secret store, and are they absent from configuration files committed to the repository?
- Could a secret reach the browser? Check environment variables exposed to client bundles, such as those with a public prefix, and server data passed to client components.
- Are secrets kept out of logs, error messages, exceptions returned to callers, analytics and URLs?
- Does each credential have the narrowest scope and shortest lifetime that works?

## Personal data

- Does the change collect any new personal data? Is it needed, and is there a reason recorded for keeping it?
- Is personal data kept out of logs, analytics events, error reports, URLs and query strings? Log identifiers instead, and only where needed.
- Are pupil and child data handled with extra care, collecting as little as possible?
- Do API responses return only the fields the caller needs, rather than whole records?
- Are error messages free of other people's data and of internal details such as stack traces and queries?
- Is personal data deleted or anonymised when it's no longer needed?

## Dependencies

- Is each new dependency needed, or would existing code or a dependency already in use do?
- Is it actively maintained, widely used and from the publisher you expect? Check the exact name for look-alike packages.
- Does it run install scripts? If so, is that needed, and is it allowed deliberately?
- Is the version locked in the lockfile, and does an upgrade's changelog mention security fixes or breaking changes?
- Is its licence compatible with the repository's?
- Does it pull in a large tree of other dependencies for a small job?

## Web and API behaviour

- Do cookies holding sessions use `HttpOnly`, `Secure` and an appropriate `SameSite` setting?
- Are state-changing requests protected against cross-site request forgery where cookies authenticate them?
- Is cross-origin access limited to the origins that need it, without reflecting any origin with credentials?
- Are security headers, such as a content security policy, set or kept intact?
- Are expensive or sensitive endpoints rate limited?
- Does every incoming webhook check the sender's signature over the raw request body, with a constant-time comparison, and reject old or replayed deliveries?
- Do error responses avoid revealing whether a record exists to someone who isn't allowed to see it?

## CI and automation

- Do workflows that run on pull requests avoid running untrusted code with secrets or a write token? Be especially careful with triggers that run with the base branch's secrets on pull request content.
- Are untrusted values, such as pull request titles, branch names and issue text, passed to shell steps through environment variables, rather than written into the script itself?
- Does each job have the narrowest permissions it needs, with read-only as the default?
- Are third-party actions pinned to a commit hash?
- Do checkouts avoid saving credentials when later steps don't need them?
- Are installs run with lifecycle scripts disabled where the workflow doesn't need them?

## AI and language models

- Is text from users, documents, web pages or tools kept apart from the instructions a model is given, and treated as untrusted, so it can't change what the model does? This is prompt injection.
- Is a model's output treated as untrusted input: checked before use, encoded before it's rendered, and never run as code, a query or a shell command?
- Can a model call only the tools, and reach only the data, that the person using it may use? Does a person confirm any action that changes or sends something?
- Are prompts and model inputs and outputs kept out of logs and analytics when they could hold personal data or secrets?
