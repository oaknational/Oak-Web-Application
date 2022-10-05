import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";

import useBreadcrumbContext from "./useBreadcrumbContext";
import BreadcrumbProvider from "./BreadcrumbProvider";

const testBreadcrumbs = [
  {
    href: "/blog",
    label: "All",
  },
  {
    href: "/blog/category/Research",
    label: "Research",
    disabled: true,
  },
];

describe("useBredcrumbContext()", () => {
  test("breadcrumbs should initially be empty", () => {
    const { result } = renderHook(() => useBreadcrumbContext(), {
      wrapper: BreadcrumbProvider,
    });
    const { breadcrumbs } = result.current;

    expect(breadcrumbs).toHaveLength(0);
  });

  test("breadcrumbs can be updated", () => {
    const { result } = renderHook(() => useBreadcrumbContext(), {
      wrapper: BreadcrumbProvider,
    });
    const { updateBreadcrumbs } = result.current;

    act(() => {
      updateBreadcrumbs(testBreadcrumbs);
    });

    const { breadcrumbs } = result.current;

    expect(breadcrumbs).toEqual(testBreadcrumbs);
  });
});
