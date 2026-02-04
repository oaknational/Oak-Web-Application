import { DropdownFocusManager } from "./DropdownFocusManager";

import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const mockData = topNavFixture.teachers!;

describe("DropdownFocusManager", () => {
  it("should build focusMap with correct top-level sections", () => {
    const manager = new DropdownFocusManager(mockData);
    // @ts-expect-error: access private for test
    const focusMap = manager.getFocusMap();
    // Top-level keys
    expect(focusMap.has("primary-subnav-button")).toBe(true);
    expect(focusMap.has("secondary-subnav-button")).toBe(true);
    expect(focusMap.has("aboutUs-subnav-button")).toBe(true);
    expect(focusMap.has("guidance-subnav-button")).toBe(true);
  });

  it("should build children for keystages and subjects", () => {
    const manager = new DropdownFocusManager(mockData);
    // @ts-expect-error: access private for test
    const focusMap = manager.getFocusMap();
    // Check a keystage node
    const ks1Node = focusMap.get("ks1-dropdown-button");
    expect(ks1Node).toBeDefined();
    expect(ks1Node?.children).toEqual([
      "ks1-english-subject-button",
      "ks1-maths-subject-button",
      "ks1-financial-education-subject-button",
    ]);
    // Check a subject node
    const englishNode = focusMap.get("ks1-english-subject-button");
    expect(englishNode).toBeDefined();
    expect(englishNode?.parent).toBe("ks1-dropdown-button");
    expect(englishNode?.children).toEqual([]);
  });

  it("should mark first and last children correctly", () => {
    const manager = new DropdownFocusManager(mockData);
    // @ts-expect-error: access private for test
    const focusMap = manager.getFocusMap();
    // First child in ks1
    const englishNode = focusMap.get("ks1-english-subject-button");
    expect(englishNode?.isFirstChild).toBe(true);
    // Last child in ks1
    const financialNode = focusMap.get(
      "ks1-financial-education-subject-button",
    );
    expect(financialNode?.isLastChild).toBeUndefined(); // Only all-keystages is marked as last
    // All keystages button
    const allKeystagesNode = focusMap.get("ks1-all-keystages-button");
    expect(allKeystagesNode?.isLastChild).toBe(true);
  });

  it("should build focusMap for aboutUs and guidance sections", () => {
    const manager = new DropdownFocusManager(mockData);
    // @ts-expect-error: access private for test
    const focusMap = manager.getFocusMap();
    // AboutUs links
    expect(focusMap.has("about-who-we-are-dropdown-button")).toBe(true);
    expect(focusMap.has("about-board-dropdown-button")).toBe(true);
    // Guidance links
    expect(focusMap.has("lesson-planning-dropdown-button")).toBe(true);
    expect(focusMap.has("blog-index-dropdown-button")).toBe(true);
  });

  describe("focusFirstChild behavior", () => {
    let manager: DropdownFocusManager;
    let event: React.KeyboardEvent<HTMLDivElement>;
    beforeEach(() => {
      manager = new DropdownFocusManager(mockData);
      event = {
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLDivElement>;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should focus the first child if it exists in the DOM", () => {
      const firstChildId = "ks1-english-subject-button";
      const focusMock = jest.fn();
      const elementMock = { focus: focusMock };
      jest.spyOn(document, "getElementById").mockImplementation((id) => {
        return (id === firstChildId
          ? elementMock
          : null) as unknown as HTMLElement;
      });
      // @ts-expect-error: access private for test
      const ks1Node = manager.getFocusMap().get("ks1-dropdown-button")!;
      // @ts-expect-error: access private for test
      manager.focusFirstChild(ks1Node, event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(focusMock).toHaveBeenCalled();
    });

    it("should not focus if the first child is not in the DOM", () => {
      jest.spyOn(document, "getElementById").mockReturnValue(null);
      // @ts-expect-error: access private for test
      const ks1Node = manager.getFocusMap().get("ks1-dropdown-button")!;
      // @ts-expect-error: access private for test
      manager.focusFirstChild(ks1Node, event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});
