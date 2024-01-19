#!/bin/bash

# Find all files ending with .test.ts and iterate over them
find . -type f -name "*.test.tsx" | while read file; do
    # Check if the file already contains the import statement
    if ! grep -q 'import { describe, expect, it } from "vitest";' "$file"; then
        # Add the import statement at the beginning of the file
        echo -e "import { describe, expect, it } from \"vitest\";\n$(cat "$file")" > "$file"
    fi
done