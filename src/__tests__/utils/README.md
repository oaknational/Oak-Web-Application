# Module Helpers for Tests

This directory contains utility functions for working with ES Modules in test files where CommonJS globals like `__dirname` and `__filename` are not available.

## Usage

When working with ES Modules (files using `import`/`export` syntax), the Node.js globals `__dirname` and `__filename` are not available. This utility provides equivalent functionality.

### Getting `__dirname` and `__filename` in ES Modules

```typescript
import { getDirname, getFilename } from "@/__tests__/utils/moduleHelpers";
import path from "path";

// At the top of your file
const __dirname = getDirname(import.meta.url);
const __filename = getFilename(import.meta.url);

// Now you can use them like in CommonJS
const somePath = path.join(__dirname, "../relative/path");
```

### Example

```typescript
import { getDirname } from "@/__tests__/utils/moduleHelpers";
import path from "path";

describe("My Test", () => {
  it("should load data from a fixture file", () => {
    const __dirname = getDirname(import.meta.url);

    // Load test fixtures relative to the current file
    const fixtureFile = path.join(__dirname, "../fixtures/test-data.json");

    // Use the path in your test
    // ...
  });
});
```

## Why This Is Needed

In CommonJS modules, Node.js provides the `__dirname` and `__filename` global variables:

- `__dirname`: The directory name of the current module
- `__filename`: The file path of the current module

However, when using ES Modules (indicated by `import`/`export` syntax or `.mjs` file extensions), these globals are not available. Instead, ES Modules use `import.meta.url` which is a URL string.

This utility bridges that gap by providing helper functions that convert `import.meta.url` to the equivalent of these global variables.
