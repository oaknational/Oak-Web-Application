# Import Reordering

This script is used to reorder the imports in a file.

## Testing

Run `tsx .agent/scripts/import-reordering/generate-testfile.scripttest.tsx` to generate a test file with the original, incorrectly ordered, imports.

The desired output is in `testfile.sorted.scripttest.tsx`.

Run `tsx .agent/scripts/fix-imports.ts --file testfile.scripttest.tsx` and check the results against `testfile.sorted.scripttest.tsx`.
