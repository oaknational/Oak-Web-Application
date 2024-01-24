import { loadEnvConfig } from "@next/env";
import { vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

loadEnvConfig(".");

vi.mock("@/node-lib/curriculum-api");
vi.mock("@/node-lib/curriculum-api-2023");
vi.mock("next/dist/client/router", () => require("next-router-mock"));
vi.mock("next/router", () => require("next-router-mock"));
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...actual,
    useId: () => "react-use-id-test-result",
  };
});
vi.mock(
  "@/components/GenericPagesComponents/InlineSpriteSheet/InlineSpriteSheet.tsx",
  () => ({
    default: () => null,
  }),
);
afterEach(() => {
  cleanup();
});
