import { act, renderHook } from "@testing-library/react";

import { KeyStage, SearchProvider, useSearchQuery } from "./SearchContext";

describe("context/SearchContext.tsx", () => {
  it("should default searchQuery.text to empty string", () => {
    const { result } = renderHook(useSearchQuery, { wrapper: SearchProvider });
    const { text } = result.current;
    expect(text).toEqual(text);
  });
  it("should update text with setText", async () => {
    const { result } = renderHook(useSearchQuery, { wrapper: SearchProvider });

    const searchText = "macb";
    await act(async () => {
      await result.current.setText(searchText);
    });

    expect(result.current.text).toEqual(searchText);
  });
  it("should default searchQuery.keyStages to empty set", () => {
    const { result } = renderHook(useSearchQuery, { wrapper: SearchProvider });
    const { keyStages } = result.current;
    expect(keyStages).toEqual(new Set());
  });
  it("should update keyStages with setKeyStages", async () => {
    const { result } = renderHook(useSearchQuery, { wrapper: SearchProvider });

    const keyStages = new Set<KeyStage>(["foundation"]);
    await act(async () => {
      await result.current.setKeyStages(keyStages);
    });

    expect(result.current.keyStages).toEqual(keyStages);
  });
});
