import { DropdownFocusManager } from "./DropdownFocusManager";

import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const mockData = topNavFixture.teachers!;

describe("DropdownFocusManager", () => {
  it("should build focusMap with correct top-level sections", () => {
    const manager = new DropdownFocusManager(
      mockData,
      "teachers",

      () => undefined,
    );

    const focusMap = manager.getFocusMap();
    // Top-level keys
    expect(focusMap.has("teachers-primary")).toBe(true);
    expect(focusMap.has("teachers-secondary")).toBe(true);
    expect(focusMap.has("teachers-curriculum-landing-page")).toBe(true);
    expect(focusMap.has("teachers-aboutUs")).toBe(true);
    expect(focusMap.has("teachers-guidance")).toBe(true);
  });

  it("should build children for keystages and subjects", () => {
    const manager = new DropdownFocusManager(
      mockData,
      "teachers",

      () => undefined,
    );

    const focusMap = manager.getFocusMap();
    // Check a keystage node
    const ks1Node = focusMap.get("teachers-primary-ks1");
    expect(ks1Node).toBeDefined();
    expect(ks1Node?.children).toEqual([
      "teachers-primary-ks1-english",
      "teachers-primary-ks1-maths",
      "teachers-primary-ks1-financial-education",
      "teachers-primary-ks1-all-keystages-button",
    ]);
    // Check a subject node
    const englishNode = focusMap.get("teachers-primary-ks1-english");
    expect(englishNode).toBeDefined();
    expect(englishNode?.parent?.parentId).toBe("teachers-primary-ks1");
    expect(englishNode?.children).toEqual([]);
  });

  it("should mark first and last children correctly", () => {
    const manager = new DropdownFocusManager(
      mockData,
      "teachers",

      () => undefined,
    );

    const focusMap = manager.getFocusMap();
    // First child in ks1
    const englishNode = focusMap.get("teachers-primary-ks1-english");
    expect(englishNode?.isFirstChild).toBe(true);
    // Last child in ks1
    const financialNode = focusMap.get(
      "teachers-primary-ks1-financial-education",
    );
    expect(financialNode?.isLastChild).toBe(false); // Only all-keystages is marked as last
    // All keystages button
    const allKeystagesNode = focusMap.get(
      "teachers-primary-ks1-all-keystages-button",
    );
    expect(allKeystagesNode?.isLastChild).toBe(true);
  });

  it("should build focusMap for aboutUs and guidance sections", () => {
    const manager = new DropdownFocusManager(
      mockData,
      "teachers",
      () => undefined,
    );

    const focusMap = manager.getFocusMap();
    // AboutUs links
    expect(focusMap.has("teachers-aboutUs-about-who-we-are")).toBe(true);
    expect(focusMap.has("teachers-aboutUs-about-meet-the-team")).toBe(true);
    // Guidance links
    expect(focusMap.has("teachers-guidance-lesson-planning")).toBe(true);
    expect(focusMap.has("teachers-guidance-blog-index")).toBe(true);
  });

  describe("focusFirstChild behavior", () => {
    let manager: DropdownFocusManager<typeof mockData>;
    let event: React.KeyboardEvent<HTMLDivElement>;
    beforeEach(() => {
      manager = new DropdownFocusManager(mockData, "teachers", () => undefined);
      event = {
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLDivElement>;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should focus the first child if it exists in the DOM", () => {
      const firstChildId = "teachers-primary-ks1-english";
      const focusMock = jest.fn();
      const elementMock = { focus: focusMock };
      jest.spyOn(document, "getElementById").mockImplementation((id) => {
        return (id === firstChildId
          ? elementMock
          : null) as unknown as HTMLElement;
      });

      const ks1Node = manager.getFocusMap().get("teachers-primary-ks1")!;
      // @ts-expect-error: access private for test
      manager.handleTab(ks1Node, event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(focusMock).toHaveBeenCalled();
    });

    it("should not focus if the first child is not in the DOM", () => {
      jest.spyOn(document, "getElementById").mockReturnValue(null);

      const ks1Node = manager.getFocusMap().get("teachers-primary-ks1")!;
      // @ts-expect-error: access private for test
      manager.handleTab(ks1Node, event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
  describe("focusParentSibling and focusParent behavior", () => {
    let manager: DropdownFocusManager<typeof mockData>;
    let event: React.KeyboardEvent<HTMLDivElement>;
    beforeEach(() => {
      manager = new DropdownFocusManager(mockData, "teachers", () => undefined);
      event = {
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLDivElement>;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should focus parent's sibling when tabbing on last child using handleTab", () => {
      // Setup: teachers-primary-ks1-all-keystages-button is last child, its parent is teachers-primary-ks1
      const siblingId = "teachers-primary-ks2";
      const focusMock = jest.fn();
      const elementMock = { focus: focusMock };
      jest.spyOn(document, "getElementById").mockImplementation((id) => {
        return (id === siblingId
          ? elementMock
          : null) as unknown as HTMLElement;
      });

      const node = manager
        .getFocusMap()
        .get("teachers-primary-ks1-all-keystages-button")!;
      // @ts-expect-error: access private for test
      manager.handleTab(node, event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(focusMock).toHaveBeenCalled();
    });

    it("should focus parent when shift-tabbing on first child using handleShiftTab", () => {
      const parentId = "teachers-primary-ks1";
      const focusMock = jest.fn();
      const elementMock = { focus: focusMock };
      jest.spyOn(document, "getElementById").mockImplementation((id) => {
        return (id === parentId ? elementMock : null) as unknown as HTMLElement;
      });

      const node = manager.getFocusMap().get("teachers-primary-ks1-english")!;
      // @ts-expect-error: access private for test
      manager.handleShiftTab(event, node);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(focusMock).toHaveBeenCalled();
    });
  });
});
