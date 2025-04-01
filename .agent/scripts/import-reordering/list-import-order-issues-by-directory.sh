#!/bin/bash

# Script to list directories with import/order ESLint violations, sorted by count
# Usage: ./list-import-order-issues-by-directory.sh

echo "Finding files with import/order issues..."

# Create a temporary file to store the output
TEMP_FILE=$(mktemp)

# Run ESLint with the import/order rule specifically
npx eslint "src/**/*.{ts,tsx}" -c ./eslint.config.ts --no-ignore --quiet --rule "import/order: error" >"$TEMP_FILE" 2>&1

# Extract file paths with import/order issues
grep -B 1 "import/order" "$TEMP_FILE" | grep "^/" | sort >"$TEMP_FILE.paths"

# Count total issues
TOTAL_ISSUES=$(wc -l <"$TEMP_FILE.paths")

echo "Found $TOTAL_ISSUES files with import/order issues"
echo "----------------------------------------------------"
echo "Issues by directory:"
echo "----------------------------------------------------"

# Extract directories and count occurrences
cat "$TEMP_FILE.paths" | while read -r file; do
  dirname "$file" | sed "s|$PWD/||"
done | sort | uniq -c | sort -nr | head -n 20

echo "----------------------------------------------------"
echo "Top 20 directories with issues shown above (of $TOTAL_ISSUES total files)"
echo "For a full list, run: './list-import-order-issues-by-directory.sh full'"

# Clean up
rm "$TEMP_FILE" "$TEMP_FILE.paths"
