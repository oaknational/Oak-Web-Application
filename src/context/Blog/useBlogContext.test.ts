import { renderHook, act } from "@testing-library/react-hooks";

import useBlogContext from "./useBlogContext";
import BlogCategoriesProvider from "./BlogProvider";

describe("useBlogContext()", () => {
  test("'selectedCategory' should default to null", () => {
    const { result } = renderHook(() => useBlogContext(), {
      wrapper: BlogCategoriesProvider,
    });
    const { selectedCategory } = result.current;

    expect(selectedCategory).toBe(null);
  });

  test("setSelectedCategory should set the category", () => {
    const { result } = renderHook(() => useBlogContext(), {
      wrapper: BlogCategoriesProvider,
    });
    const { setSelectedCategory } = result.current;
    act(() => {
      setSelectedCategory("my-fave-category");
    });

    expect(result.current.selectedCategory).toBe("my-fave-category");
  });
});
