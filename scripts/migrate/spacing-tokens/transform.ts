import { FileInfo, API, JSXAttribute, JSCodeshift } from "jscodeshift";

// const flexStype = [
//     "$gap",
//     "$columnGap",
//     "$rowGap",
// ];

// const positionStyle = [
//     "$top",
//     "$right",
//     "$bottom",
//     "$left",
//     "$inset",
// ]

// const sizeStyle = [
//     "$width",
//     "$minWidth",
//     "$maxWidth",
//     "$height",
//     "$minHeight",
//     "$maxHeight"
// ]

// const spacingStyles = [
//     "$pa",
//     "$ph",
//     "$pv",
//     "$pl",
//     "$pr",
//     "$pt",
//     "$pb",
//     "$ma",
//     "$mh",
//     "$mv",
//     "$ml",
//     "$mr",
//     "$mt",
//     "$mb",
// ]

// const gridStyle = [
//     "$rg",
//     "$cg"
// ]

// const JSX_ATTR_MAPPING = new Set([
//     ...flexStype,
//     ...positionStyle,
//     ...sizeStyle,
//     ...spacingStyles,
//     ...gridStyle,
// ])

const ALL_SPACING_MAPPINGS = {
  "all-spacing-0": "spacing-0",
  "all-spacing-05": "spacing-2",
  "all-spacing-1": "spacing-4",
  "all-spacing-2": "spacing-8",
  "all-spacing-3": "spacing-12",
  "all-spacing-4": "spacing-16",
  "all-spacing-5": "spacing-20",
  "all-spacing-6": "spacing-24",
  "all-spacing-7": "spacing-32",
  "all-spacing-8": "spacing-40",
  "all-spacing-9": "spacing-48",
  "all-spacing-10": "spacing-56",
  "all-spacing-11": "spacing-64",
  "all-spacing-12": "spacing-72",
  "all-spacing-13": "spacing-80",
  "all-spacing-14": "spacing-92",
  "all-spacing-15": "spacing-100",
  "all-spacing-16": "spacing-120",
  "all-spacing-17": "spacing-160",
  "all-spacing-18": "spacing-180",
  "all-spacing-19": "spacing-240",
  "all-spacing-20": "spacing-360",
  "all-spacing-21": "spacing-480",
  "all-spacing-22": "spacing-640",
  "all-spacing-23": "spacing-960",
  "all-spacing-24": "spacing-1280",
};

const SPACE_BETWEEN_MAPPING = {
  "space-between-none": "spacing-0",
  "space-between-sssx": "spacing-4",
  "space-between-ssx": "spacing-8",
  "space-between-xs": "spacing-12",
  "space-between-s": "spacing-16",
  "space-between-m": "spacing-24",
  "space-between-m2": "spacing-32",
  "space-between-l": "spacing-48",
  "space-between-xl": "spacing-56",
  "space-between-xxl": "spacing-72",
  "space-between-xxxl": "spacing-80",
};

const INNER_PADDING_MAPPING = {
  "inner-padding-none": "spacing-0",
  "inner-padding-ssx": "spacing-4",
  "inner-padding-xs": "spacing-8",
  "inner-padding-s": "spacing-12",
  "inner-padding-m": "spacing-16",
  "inner-padding-l": "spacing-20",
  "inner-padding-xl": "spacing-24",
  "inner-padding-xl2": "spacing-32",
  "inner-padding-xl3": "spacing-40",
  "inner-padding-xl4": "spacing-48",
  "inner-padding-xl5": "spacing-56",
  "inner-padding-xl6": "spacing-64",
  "inner-padding-xl7": "spacing-72",
  "inner-padding-xl8": "spacing-80",
};

const MAPPINGS: Record<string, string> = {
  ...ALL_SPACING_MAPPINGS,
  ...SPACE_BETWEEN_MAPPING,
  ...INNER_PADDING_MAPPING,
};

function replaceSpacingTokens(j: JSCodeshift, val?: JSXAttribute["value"]) {
  if (val?.type === "StringLiteral" && MAPPINGS[val.value]) {
    return j.stringLiteral(MAPPINGS[val.value]!);
  }
  return val;
}

export default function (fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  return root
    .find(j.StringLiteral, () => {
      return true;
    })
    .replaceWith((inner) => {
      return replaceSpacingTokens(j, inner.value);
    })
    .toSource();

  // return root
  // .find(
  //     j.JSXAttribute, (attr: JSXAttribute) => {
  //         if (JSX_ATTR_MAPPING.has(String(attr.name.name))) {
  //             return true;
  //         }
  //         return false;
  //     }
  // ).replaceWith((node: ASTPath<JSXAttribute>) => {
  //     return j(node)
  //         .find(j.StringLiteral, () => {
  //             return true;
  //         })
  //         .replaceWith((inner) => {
  //            return replaceSpacingTokens(j, inner.value);
  //         })
  //         .toSource();
  // })
  // .toSource();
}
