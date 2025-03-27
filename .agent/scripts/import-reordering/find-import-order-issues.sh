#!/bin/bash

# Script to find files with import/order ESLint violations
# Usage: ./find-import-order-issues.sh [directory_pattern]

PATTERN=${1:-"src/**/*.{ts,tsx}"}
echo "Finding files with import/order issues in: $PATTERN"

# Create a temporary file to store the output
TEMP_FILE=$(mktemp)

# Run ESLint with the import/order rule specifically
npx eslint "$PATTERN" -c ./eslint.config.ts --no-ignore --quiet --rule "import/order: error" >"$TEMP_FILE" 2>&1

# Count total issues
TOTAL_ISSUES=$(grep -c "import/order" "$TEMP_FILE")

echo "Found $TOTAL_ISSUES files with import/order issues:"
echo "----------------------------------------------------"

# Extract file paths with import/order issues
grep -B 1 "import/order" "$TEMP_FILE" | grep "^/" | sort | uniq

# Clean up
rm "$TEMP_FILE"

echo "----------------------------------------------------"
echo "Total files with import/order issues: $TOTAL_ISSUES"
