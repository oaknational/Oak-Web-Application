import { renderHook, act } from "@testing-library/react-hooks";

import useMenuContext from "./useMenuContext";
import MenuProvider from "./MenuProvider";

describe("useMenuContext()", () => {
  test("'open' should default to false", () => {
    const { result } = renderHook(() => useMenuContext(), {
      wrapper: MenuProvider,
    });
    const { open } = result.current;

    expect(open).toBe(false);
  });

  test("toggleOpen should open menu", () => {
    const { result } = renderHook(() => useMenuContext(), {
      wrapper: MenuProvider,
    });
    const { toggleMenu } = result.current;
    act(() => {
      toggleMenu();
    });

    expect(result.current.open).toBe(true);
  });
});
