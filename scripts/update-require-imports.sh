#!/bin/bash

# Script to update require statements to include .cjs extension
# for files that have been renamed from .js to .cjs

# Exit on error
set -e

# Directories to process
DIRS=("scripts" ".github" "netlify" "src")

for dir in "${DIRS[@]}"; do
  echo "Processing $dir directory..."

  # Find all .cjs files in the directory
  find "./$dir" -type f -name "*.cjs" | while read file; do
    echo "Checking file: $file"

    # Use grep to find require statements and perl to replace them
    grep -l "require(" "$file" | xargs -I{} perl -i -pe 's/require\((["\x27])(\..*?)(["\x27])\)/require\($1$2.cjs$3\)/g' {}
  done
done

echo "All require statements have been updated to include .cjs extension"
