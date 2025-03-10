#!/bin/bash

# Script to rename .js files to .cjs for CommonJS module compatibility
# when "type": "module" is set in package.json

# Exit on error
set -e

# Exclude directories that are build outputs or should not be modified
find . -type f -name "*.js" |
  grep -v "node_modules" |
  grep -v ".next" |
  grep -v "storybook-static" |
  grep -v "coverage" |
  while read file; do
    # Get the new filename by replacing .js with .cjs
    new_file="${file%.js}.cjs"
    echo "Renaming $file to $new_file"
    mv "$file" "$new_file"
  done

echo "All .js files have been renamed to .cjs"
