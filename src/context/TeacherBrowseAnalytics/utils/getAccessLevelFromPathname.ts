import type { AccessLevelValueType } from "@/browser-lib/avo/Avo";

// Mirrors the accessLevel each teacher page passes to its analytics provider
const routes: ReadonlyArray<[RegExp, AccessLevelValueType]> = [
  [/^\/teachers\/programmes\/[^/]+\/units\/[^/]+\/lessons\/[^/]+/, "lesson"],
  [/^\/teachers\/lessons\/[^/]+/, "lesson"],
  [/^\/teachers\/programmes\/[^/]+\/units\/[^/]+\/lessons\/?$/, "unit"],
  [/^\/teachers\/programmes\/[^/]+/, "programme"],
  [/^\/teachers\/search\/?$/, "search"],
  [/^\/teachers\/my-library\/?$/, "my_library"],
  [/^\/teachers\/teach-with-oak(\/|$)/, "teach_with_oak"],
];

export const getAccessLevelFromPathname = (
  pathname: string | null | undefined,
): AccessLevelValueType | undefined => {
  if (!pathname) {
    return undefined;
  }

  return routes.find(([pattern]) => pattern.test(pathname))?.[1];
};
