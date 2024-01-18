import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import mockRouter from "next-router-mock";
// import { useRouter } from "next/router";

import useMenuContext from "./useMenuContext";
import MenuProvider from "./MenuProvider";

vi.mock("next/dist/client/router", () => require("next-router-mock"));

describe("useMenuContext()", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
  });

  it("'open' should default to false", () => {
    const { result } = renderHook(() => useMenuContext(), {
      wrapper: MenuProvider,
    });
    const { open } = result.current;

    expect(open).toBe(false);
  });

  it("toggleOpen should open menu", () => {
    const { result } = renderHook(() => useMenuContext(), {
      wrapper: MenuProvider,
    });
    const { openMenu } = result.current;
    act(() => {
      openMenu();
    });

    expect(result.current.open).toBe(true);
  });

  it("closeMenu should close menu", () => {
    const { result } = renderHook(() => useMenuContext(), {
      wrapper: MenuProvider,
    });
    const { closeMenu } = result.current;
    act(() => {
      closeMenu();
    });

    expect(result.current.open).toBe(false);
  });
});
