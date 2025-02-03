import { MockInstance, vi } from "vitest";
import {
  createEvent,
  fireEvent,
  render,
  renderHook,
} from "@testing-library/react";
import mockRouter from "next-router-mock";
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes/next-13";
import { act } from "react-dom/test-utils";

import {
  useGetSectionLinkProps,
  useLessonPopStateHandler,
  useNavigateToSection,
} from "./lessonNavigation";

vi.mock("next/router", async () => await vi.importActual("next-router-mock"));

mockRouter.useParser(
  createDynamicRouteParser(["/pupils/lessons/[lessonSlug]/[section]"]),
);
mockRouter.push("/pupils/lessons/slug-ccuk0d/overview");

describe(useNavigateToSection, () => {
  let pushStateSpy: MockInstance;
  let replaceStateSpy: MockInstance;

  beforeEach(() => {
    pushStateSpy = vi.spyOn(window.history, "pushState");
    replaceStateSpy = vi.spyOn(window.history, "replaceState");
  });

  afterEach(() => {
    pushStateSpy.mockRestore();
    replaceStateSpy.mockRestore();
  });

  it("calls replaceState when the section is the same as the current section", () => {
    const { result } = renderHook(() => useNavigateToSection());

    result.current("overview");

    expect(replaceStateSpy).toHaveBeenCalledWith(
      "overview",
      "",
      "/pupils/lessons/slug-ccuk0d/overview",
    );
    expect(pushStateSpy).not.toHaveBeenCalled();
  });

  it("calls pushState when the section is different from the current section", () => {
    const { result } = renderHook(() => useNavigateToSection());

    result.current("video");

    expect(pushStateSpy).toHaveBeenCalledWith(
      "video",
      "",
      "/pupils/lessons/slug-ccuk0d/video",
    );
    expect(replaceStateSpy).not.toHaveBeenCalled();
  });
});

describe(useGetSectionLinkProps, () => {
  it("returns an object with the href and onClick handler", () => {
    const { result } = renderHook(() => useGetSectionLinkProps());

    expect(result.current("video", () => {})).toEqual({
      href: "/pupils/lessons/slug-ccuk0d/video",
      onClick: expect.any(Function),
    });
  });

  it("calls the callback with the section when onClick is called", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useGetSectionLinkProps());
    const { getByRole } = render(
      <a {...result.current("video", callback)}>Video</a>,
    );
    const event = createEvent.click(getByRole("link"));
    vi.spyOn(event, "preventDefault");

    act(() => {
      fireEvent(getByRole("link"), event);
    });

    expect(callback).toHaveBeenCalledWith("video");
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

describe(useLessonPopStateHandler, () => {
  it("calls the callback with the section when the popstate event is fired", () => {
    const callback = vi.fn();
    renderHook(() => useLessonPopStateHandler(callback));

    fireEvent(
      window,
      new window.PopStateEvent("popstate", {
        state: "starter-quiz",
      }),
    );

    expect(callback).toHaveBeenCalledWith("starter-quiz");
  });

  it('defaults to the "overview" section when the popstate event has no state', () => {
    const callback = vi.fn();
    renderHook(() => useLessonPopStateHandler(callback));

    fireEvent(window, new window.PopStateEvent("popstate"));

    expect(callback).toHaveBeenCalledWith("overview");
  });
});
