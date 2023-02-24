import { act, renderHook } from "@testing-library/react";

import { KeyStage, SearchProvider, useSearchQuery } from "./SearchContext";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("context/SearchContext.tsx", () => {
  describe("searchQuery.text", () => {
    it("should default searchQuery.text to empty string", () => {
      const { result } = renderHook(useSearchQuery, {
        wrapper: SearchProvider,
      });
      const { text } = result.current;
      expect(text).toEqual(text);
    });

    it("should update text with setText", async () => {
      const { result } = renderHook(useSearchQuery, {
        wrapper: SearchProvider,
      });

      const searchText = "macb";
      await act(async () => {
        await result.current.setText(searchText);
      });

      expect(result.current.text).toEqual(searchText);
    });

    it("should default searchQuery.text to term taken from URL if available", () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const useRouter = jest.spyOn(require("next/router"), "useRouter");

      useRouter.mockReturnValueOnce({
        pathname: "beta/teachers/search",
        query: { term: "test search term" },
      });

      const { result } = renderHook(useSearchQuery, {
        wrapper: SearchProvider,
      });
      const { text } = result.current;
      expect(text).toEqual("test search term");
    });
  });

  describe("searchQuery.keyStages", () => {
    it("should default searchQuery.keyStages to empty set", () => {
      const { result } = renderHook(useSearchQuery, {
        wrapper: SearchProvider,
      });
      const { keyStages } = result.current;
      expect(keyStages).toEqual(new Set());
    });

    it("should update keyStages with setKeyStages", async () => {
      const { result } = renderHook(useSearchQuery, {
        wrapper: SearchProvider,
      });

      const keyStages = new Set<KeyStage>(["3"]);
      await act(async () => {
        await result.current.setKeyStages(keyStages);
      });

      expect(result.current.keyStages).toEqual(keyStages);
    });

    it("should set initial keyStages from url if available", async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const useRouter = jest.spyOn(require("next/router"), "useRouter");

      useRouter.mockReturnValueOnce({
        pathname: "beta/teachers/search",
        query: { keystages: "1,2,3" },
      });

      const { result } = renderHook(useSearchQuery, {
        wrapper: SearchProvider,
      });
      const { keyStages } = result.current;
      expect(keyStages).toEqual(new Set(["1", "2", "3"]));
    });
  });
});
