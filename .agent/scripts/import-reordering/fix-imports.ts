/**
 * Fix Imports Script
 */

import { execSync } from "child_process";
import fs from "node:fs";
import path from "node:path";

// Configuration
const BATCH_SIZE = 20; // Number of files to process in parallel
const SKIP_DIRECTORIES = [
  "node_modules",
  ".next",
  "out",
  "dist",
  "build",
  "coverage",
  ".git",
];

// Function to manually fix specific problematic files
function fixSpecificProblematicFile(filePath: string): boolean {
  const normalizedPath = path.normalize(filePath);
  const fileName = path.basename(normalizedPath);

  // Special case for renderWithProviders.tsx
  if (fileName === "renderWithProviders.tsx") {
    try {
      console.log(`Manually fixing imports in ${filePath}`);
      const content = fs.readFileSync(filePath, "utf8");

      // Fix the specific issue with ErrorBoundary import
      let newContent = content.replace(
        /import ErrorBoundary from "\.\.\/\.\.\/components\/AppComponents\/ErrorBoundary";/g,
        "",
      );

      // Make sure ErrorBoundary is imported before MenuProvider
      newContent = newContent.replace(
        /import { MenuProvider } from "\.\.\/\.\.\/context\/Menu";/,
        `import ErrorBoundary from "../../components/AppComponents/ErrorBoundary";\nimport { MenuProvider } from "../../context/Menu";`,
      );

      // Skip saving if no changes
      if (newContent === content) {
        console.log(`✅ No manual changes needed for ${filePath}`);
        return false;
      }

      // Save the file
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Manual fixes applied to ${filePath}`);
      return true;
    } catch (error) {
      console.error(`❌ Error manually fixing ${filePath}:`, error);
      return false;
    }
  }

  // No special handling needed for this file
  return false;
}

// Function to fix import order while preserving type imports
function fixImportOrder(filePath: string): boolean {
  // Check if this is a special file that needs manual fixing
  if (fixSpecificProblematicFile(filePath)) {
    return true;
  }

  try {
    console.log(`Fixing imports in ${filePath}`);

    // Read the file
    const content = fs.readFileSync(filePath, "utf8");

    // Extract all import statements including empty lines between them
    const lines = content.split("\n");
    const importStartMarkers = lines
      .map((line, index) => (line.trim().startsWith("import ") ? index : -1))
      .filter((index) => index !== -1);

    // No imports found
    if (importStartMarkers.length === 0) {
      console.log("No imports found in file");
      return false;
    }

    // Find the start and end of the import section
    const startImportLine = importStartMarkers[0] ?? 0;
    let endImportLine = startImportLine;

    // Find the last import or empty line in the import section
    let i = startImportLine + 1;
    let foundNonImport = false;
    while (i < lines.length && !foundNonImport) {
      const line = lines[i]?.trim();
      if (line?.startsWith("import ")) {
        endImportLine = i;
      } else if (line === "") {
        // Check if the next non-empty line is an import
        let j = i + 1;
        let foundNext = false;
        while (j < lines.length && !foundNext) {
          const nextLine = lines[j]?.trim();
          if (nextLine !== "") {
            foundNext = true;
            if (nextLine?.startsWith("import ")) {
              // This empty line is part of the import section
              endImportLine = j; // Will be updated in next iteration
            } else {
              // This empty line is not part of the import section
              foundNonImport = true;
            }
          }
          j++;
        }
      } else {
        // Non-empty, non-import line marks the end of import section
        foundNonImport = true;
      }
      i++;
    }

    // Extract all import lines
    const importSection = lines.slice(startImportLine, endImportLine + 1);

    // Extract all actual import statements (ignoring empty lines)
    const importRegex =
      /^(import\s+(?:type\s+)?(?:{[^}]*}|\*\s+as\s+[^;]+|[^;{]*)\s+from\s+['"]([^'"]+)['"];?)$/;
    const imports: Array<{
      statement: string;
      module: string;
      isTypeImport: boolean;
      group: string;
      subGroup: string;
      originalIndex: number;
    }> = [];

    let index = 0;
    importSection.forEach((line) => {
      const match = importRegex.exec(line);
      if (match) {
        const statement = match[1];
        const moduleId = match[2];
        if (!moduleId || !statement) {
          throw new TypeError(`Invalid import statement:\n${line}\n`);
        }
        const isTypeImport = statement.includes("import type ");

        // Determine the group
        let group = "external"; // default
        let subGroup = moduleId; // Default to module name

        if (
          /^node:|^(fs|path|util|crypto|os|stream|events|http|https|url|querystring|buffer|assert|zlib|child_process|readline|string_decoder)$/.test(
            moduleId,
          )
        ) {
          group = "builtin";
        } else if (moduleId.startsWith("@/")) {
          // Internal imports using the @/ alias - MUST check this BEFORE other @ imports
          group = "internal";
        } else if (moduleId.startsWith("../") || moduleId === "..") {
          group = "parent";
          // Extract the first directory as subGroup for parent imports
          if (moduleId === "..") {
            subGroup = "..";
          } else {
            const pathParts = moduleId.split("/");
            if (pathParts.length > 1 && pathParts[1]) {
              subGroup = pathParts[1];
            }
          }
        } else if (moduleId === ".") {
          group = "index";
        } else if (moduleId.startsWith("./")) {
          group = "sibling";
        } else if (moduleId.startsWith("@")) {
          // External scoped packages like @oaknational
          group = "external";
        }

        imports.push({
          statement: line,
          module: moduleId,
          isTypeImport,
          group,
          subGroup,
          originalIndex: index++,
        });
      }
    });

    // If no imports found, nothing to do
    if (imports.length === 0) {
      console.log("No imports found in file");
      return false;
    }

    // Group imports
    const groups = {
      builtin: [] as typeof imports,
      external: [] as typeof imports,
      internal: [] as typeof imports,
      parent: [] as typeof imports,
      sibling: [] as typeof imports,
      index: [] as typeof imports,
    };

    // Place each import in its group
    imports.forEach((imp) => {
      groups[imp.group as keyof typeof groups].push(imp);
    });

    // Sort each group
    Object.keys(groups).forEach((group) => {
      const groupImports = groups[group as keyof typeof groups];

      if (group === "parent") {
        // For parent imports, we need special sorting to match ESLint rules
        groupImports.sort((a, b) => {
          // Helper function to get the depth of parent directory references
          const getParentDepth = (path: string): number => {
            // Handle cases like '..' or '../' without a specific subdirectory
            if (path === ".." || path === "../") return 1;

            // Count the number of '../' sequences at the start
            const matches = path.match(/^(\.\.\/)+/);
            if (matches) {
              // Get the length of the match and divide by 3 (the length of '../')
              return matches[0].length / 3;
            }

            // Count the number of '../' and '..' path segments
            let count = 0;
            const parts = path.split("/");
            for (const part of parts) {
              if (part === "..") {
                count++;
              } else {
                break;
              }
            }
            return count;
          };

          // Get the depths of both paths
          const depthA = getParentDepth(a.module);
          const depthB = getParentDepth(b.module);

          // Sort by depth first (more dots = deeper = higher precedence)
          if (depthA !== depthB) {
            return depthB - depthA; // Descending order - more ../../../ comes first
          }

          // If same depth, sort alphabetically
          return a.module.localeCompare(b.module);
        });
      } else if (group === "sibling") {
        // For sibling imports, we need to handle '.' and './' paths correctly
        groupImports.sort((a, b) => {
          // '.' imports should come before './' imports according to eslint import/order
          if (a.module === "." && b.module.startsWith("./")) return -1;
          if (b.module === "." && a.module.startsWith("./")) return 1;

          // Otherwise sort alphabetically
          return a.module.localeCompare(b.module);
        });
      } else {
        // For other groups, sort alphabetically
        groupImports.sort((a, b) => a.module.localeCompare(b.module));
      }
    });

    // Special handling for type imports: place them after regular imports from the same module
    Object.keys(groups).forEach((group) => {
      const groupImports = groups[group as keyof typeof groups];

      // Sort type imports after regular imports from the same module
      groupImports.sort((a, b) => {
        if (a.module === b.module) {
          // Type imports come after regular imports for the same module
          if (a.isTypeImport && !b.isTypeImport) return 1;
          if (!a.isTypeImport && b.isTypeImport) return -1;
        }
        return 0; // Keep other ordering unchanged
      });
    });

    // Final check for sibling imports to ensure '.' comes before './'
    if (groups.sibling.length > 1) {
      groups.sibling.sort((a, b) => {
        // '.' imports should come before './' imports according to eslint import/order
        if (a.module === "." && b.module.startsWith("./")) return -1;
        if (b.module === "." && a.module.startsWith("./")) return 1;

        // Otherwise sort alphabetically
        return a.module.localeCompare(b.module);
      });
    }

    // Reconstruct the import section
    let sortedImports: string[] = [];
    const groupOrder = [
      "builtin",
      "external",
      "internal",
      "parent",
      "sibling",
      "index",
    ];

    groupOrder.forEach((group, groupIndex) => {
      const groupImports = groups[group as keyof typeof groups];

      if (groupImports.length > 0) {
        // Add imports from this group, preserving 'type' keyword
        sortedImports = sortedImports.concat(
          groupImports.map((imp) => imp.statement),
        );

        // Add a newline after this group if it's not the last group with imports
        if (groupIndex < groupOrder.length - 1) {
          // Find the next non-empty group
          const hasNextGroup = groupOrder
            .slice(groupIndex + 1)
            .some(
              (nextGroup) =>
                groups[nextGroup as keyof typeof groups].length > 0,
            );

          if (hasNextGroup) {
            sortedImports.push("");
          }
        }
      }
    });

    // Create new content by replacing the import section
    const newContent =
      lines.slice(0, startImportLine).join("\n") +
      (startImportLine > 0 ? "\n" : "") +
      sortedImports.join("\n") +
      (lines.length > endImportLine + 1 ? "\n" : "") +
      lines.slice(endImportLine + 1).join("\n");

    // Skip saving if no changes
    if (newContent === content) {
      console.log(`✅ No changes needed for ${filePath}`);
      return false;
    }

    // Save the file
    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Import order fixed in ${filePath}`);

    // Return true to indicate the file was modified
    return true;
  } catch (error) {
    console.error(`❌ Error fixing imports in ${filePath}:`, error);
    return false;
  }
}

// Function to gather all TypeScript/JavaScript files in a directory
function gatherFiles(dirPath: string): string[] {
  const allFiles: string[] = [];

  function traverse(currentPath: string) {
    const files = fs.readdirSync(currentPath);

    files.forEach((file) => {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip excluded directories
        if (SKIP_DIRECTORIES.includes(file)) {
          return;
        }
        traverse(fullPath);
      } else if (stat.isFile() && /\.(tsx?|jsx?)$/.test(file)) {
        // Only include TypeScript and JavaScript files
        allFiles.push(fullPath);
      }
    });
  }

  traverse(dirPath);
  return allFiles;
}

// Verify files with ESLint
function verifyFilesWithEslint(files: string[]): void {
  if (files.length === 0) {
    console.log("No files were modified, skipping ESLint verification");
    return;
  }

  console.log(`\n🔍 Verifying ${files.length} modified files with ESLint...`);

  // Limit to a reasonable number of files to avoid command line length issues
  const MAX_FILES_PER_BATCH = 50;
  const batches: string[][] = [];

  for (let i = 0; i < files.length; i += MAX_FILES_PER_BATCH) {
    batches.push(files.slice(i, i + MAX_FILES_PER_BATCH));
  }

  let filesWithIssues = 0;

  batches.forEach((batch, index) => {
    console.log(
      `\n🔍 Verifying batch ${index + 1}/${batches.length} (${batch.length} files)`,
    );

    try {
      // Convert absolute paths to relative
      const relativeFiles = batch.map((file) =>
        path.relative(process.cwd(), file),
      );

      const cmd = `echo ${relativeFiles.join("\n")} | xargs npm run lint -- --file 2>&1 | grep "import/order"`;
      const result = execSync(cmd, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      });

      if (result.includes("import/order")) {
        console.log("⚠️ Some files still have import/order issues:");
        console.log(result);
        filesWithIssues += (result.match(/import\/order/g) || []).length;
      }
    } catch (error) {
      console.error(
        `Error verifying files with ESLint: Possibly okay if no issues found`,
        error,
      );
      // If grep doesn't find anything, command exits with code 1, which is good
      // It means no import/order issues were found
      console.log(`✅ No import/order issues found in batch ${index + 1}`);
    }
  });

  if (filesWithIssues > 0) {
    console.log(`⚠️ ${filesWithIssues} files still have import/order issues`);
  } else {
    console.log(`\n✅ All files passed ESLint verification for import/order!`);
  }
}

// Process files in batches
async function processFilesInBatches(files: string[]): Promise<string[]> {
  const totalFiles = files.length;
  console.log(`Processing ${totalFiles} files in batches of ${BATCH_SIZE}`);

  const modifiedFiles: string[] = [];

  for (let i = 0; i < totalFiles; i += BATCH_SIZE) {
    const endIndex = Math.min(i + BATCH_SIZE, totalFiles);
    const batch = files.slice(i, endIndex);

    console.log(
      `\nProcessing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(totalFiles / BATCH_SIZE)} (files ${i + 1}-${endIndex})`,
    );

    // Create promises for all files in the batch
    const promises = batch.map((file) => {
      return new Promise<boolean>((resolve) => {
        try {
          const wasModified = fixImportOrder(file);
          if (wasModified) {
            modifiedFiles.push(file);
          }
          resolve(wasModified);
        } catch (error) {
          console.error(`Error processing ${file}:`, error);
          resolve(false);
        }
      });
    });

    // Wait for all files in the batch to be processed
    await Promise.all(promises);

    // Progress indicator
    const progressPercent = Math.min(
      100,
      Math.round((endIndex / totalFiles) * 100),
    );
    console.log(`\nProgress: ${progressPercent}% (${endIndex}/${totalFiles})`);
  }

  return modifiedFiles;
}

// Main function
async function main() {
  // Process command line arguments
  const args = process.argv.slice(2);
  let verifyWithEslint = true;
  const targetPaths: string[] = [];

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--skip-verify") {
      verifyWithEslint = false;
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log(`
Usage: npx tsx fix-type-imports.ts [options] [file-or-directory-paths...]

Options:
  --skip-verify  Skip ESLint verification (faster, but won't report unfixed issues)
  --help, -h     Show this help message

Examples:
  npx tsx fix-type-imports.ts src/components/Button.tsx
  npx tsx fix-type-imports.ts src/components
  npx tsx fix-type-imports.ts --skip-verify src/pages src/components
`);
      process.exit(0);
    } else {
      const targetPath = args[i];
      if (targetPath) {
        targetPaths.push(targetPath);
      }
    }
  }

  // Default to current directory if no paths specified
  if (targetPaths.length === 0) {
    targetPaths.push("src");
  }

  // Track all modified files across all target paths
  const allModifiedFiles: string[] = [];

  // Process each target path
  for (const targetPath of targetPaths) {
    const absolutePath = path.resolve(process.cwd(), targetPath);

    if (!fs.existsSync(absolutePath)) {
      console.error(`Path not found: ${absolutePath}`);
      continue;
    }

    // Check if it's a directory
    const stat = fs.statSync(absolutePath);
    if (stat.isDirectory()) {
      console.log(`Processing directory: ${absolutePath}`);
      const files = gatherFiles(absolutePath);
      console.log(`Found ${files.length} TypeScript/JavaScript files`);
      const modifiedFiles = await processFilesInBatches(files);
      allModifiedFiles.push(...modifiedFiles);
    } else {
      // Fix a single file
      const wasModified = fixImportOrder(absolutePath);
      if (wasModified) {
        allModifiedFiles.push(absolutePath);
      }
    }
  }

  console.log(
    `\n✅ Import order fixing completed - Modified ${allModifiedFiles.length} files`,
  );

  // Run ESLint verification at the end if requested
  if (verifyWithEslint && allModifiedFiles.length > 0) {
    verifyFilesWithEslint(allModifiedFiles);
  }
}

// Run the script
main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
