import { builtinModules } from "module";

import { glob } from "glob";
import {
  createCompilerHost,
  forEachChild,
  isImportDeclaration,
  ModuleResolutionKind,
  ScriptTarget,
  type Node,
} from "typescript";
import chalk from "chalk";

import tsConfig from "../../../tsconfig.json";

const tsHost = createCompilerHost(
  {
    allowJs: tsConfig.compilerOptions.allowJs,
    noEmit: true,
    isolatedModules: true,
    resolveJsonModule: tsConfig.compilerOptions.resolveJsonModule,
    moduleResolution: ModuleResolutionKind.Classic, // we don't want node_modules
    incremental: true,
    noLib: true,
    noResolve: true,
  },
  true,
);

function delintNode(node: Node) {
  const importing: string[] = [];
  if (isImportDeclaration(node)) {
    const moduleName = node.moduleSpecifier.getText().replace(/['"]/g, "");
    if (
      !moduleName.startsWith("node:") &&
      !builtinModules.includes(moduleName)
    ) {
      importing.push(moduleName);
    }
  } else {
    forEachChild(node, (item) => {
      for (const file of delintNode(item)) {
        importing.push(file);
      }
    });
  }
  return importing;
}

// Adapted from <https://gist.github.com/tinovyatkin/727ddbf7e7e10831a1eca9e4ff2fc32e>
function getImports(fileName: string) {
  const sourceFile = tsHost.getSourceFile(
    fileName,
    ScriptTarget.Latest,
    (msg) => {
      throw new Error(`Failed to parse ${fileName}: ${msg}`);
    },
  );

  if (!sourceFile) {
    console.error(`Failed to find file ${fileName}`);
    return [];
  }

  return delintNode(sourceFile);
}

const IMPORT_MAP = [
  {
    id: "Flex",
    files: ["src/components/SharedComponents/Flex.deprecated"],
  },
  {
    id: "OwaLink",
    files: ["src/components/SharedComponents/OwaLink"],
  },
  {
    id: "Box",
    files: ["src/components/SharedComponents/Box"],
  },
  {
    id: "Icon",
    files: ["src/components/SharedComponents/Icon.deprecated"],
  },
  {
    id: "Input",
    files: ["src/components/SharedComponents/Input"],
  },
  {
    id: "MaxWidth",
    files: ["src/components/SharedComponents/MaxWidth"],
  },
  {
    id: "TagPromotional",
    files: ["src/components/SharedComponents/TagPromotional"],
  },
  {
    id: "OwaImage",
    files: ["src/components/SharedComponents/OwaImage"],
  },
  {
    id: "Heading.deprecated",
    files: ["src/components/SharedComponents/Typography/Heading.deprecated"],
  },
  {
    id: "Typography",
    files: ["src/components/SharedComponents/Typography"],
  },
  {
    id: "Button",
    files: ["src/components/SharedComponents/Button"],
  },
];

function remapShortRefs(filepath: string) {
  if (filepath.match(/^@/)) {
    return filepath.replace(/^@\//, "src/");
  }
  return filepath;
}

function findImport(importPath: string) {
  for (const { id, files } of IMPORT_MAP) {
    for (const file of files) {
      if (importPath.startsWith(file)) {
        return id;
      }
    }
  }
}

function outputHtml(/*refs: Record<string, string[]>*/) {
  throw new Error("TODO");
}

function formatId(id: string) {
  return id.replace(/\.deprecated/, "");
}

function outputStdout(refs: Record<string, string[]>) {
  for (const [id, files] of Object.entries(refs)) {
    const importFiles = IMPORT_MAP.find((ref) => ref.id === id)!.files;
    console.log(
      `${chalk.green(`<${formatId(id)}/>`)} — ${chalk.blue(`./${importFiles[0]}`)} ${chalk.gray(`(${files.length} files)`)}`,
    );
    for (const file of files) {
      console.log(` - ./${file}`);
    }
    console.log("");
  }
}

async function findRefs(pattern: string) {
  const foundRefs: Record<string, string[]> = {};
  const files = await glob(pattern, {});

  for await (const file of files) {
    const imports = getImports(file).map(remapShortRefs);
    for (const importDef of imports) {
      const id = findImport(importDef);
      if (id) {
        const arr = foundRefs[id] ? [...foundRefs[id]] : [];
        arr.push(file);
        foundRefs[id] = arr;
      }
    }
  }
  return foundRefs;
}

async function run(mode: string) {
  const refs = await findRefs(import.meta.dirname + "/../src/**/*.tsx");

  if (mode === "html") {
    outputHtml(/*refs*/);
  }
  if (mode === "stdout") {
    outputStdout(refs);
  }
}

run("stdout");
