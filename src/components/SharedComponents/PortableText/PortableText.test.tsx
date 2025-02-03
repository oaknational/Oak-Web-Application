import { Mock, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCookieConsent } from "@oaknational/oak-components";

import {
  PTAnchorLink,
  PTAnchorTarget,
  PTExternalLink,
  PTInternalLink,
  PortableTextWithDefaults,
} from "./PortableText";
import { PTActionTrigger } from "./PTActionTrigger";
import portableTextFixture from "./portableTextFixture.json";

import noop from "@/__tests__/__helpers__/noop";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
vi.mock("@oaknational/oak-components", async () => {
  return {
    __esModule: true,
    ...(await vi.importActual("@oaknational/oak-components")),
    useCookieConsent: vi.fn(),
  };
});

const consoleWarnSpy = vi.spyOn(console, "warn");

const reportError = vi.fn();
vi.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

describe("PortableText", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();

    consoleWarnSpy.mockImplementation(noop);
  });

  describe("PTExternalLink", () => {
    it("renders a link to the provided external href", () => {
      const { getByRole } = renderWithTheme(
        <PTExternalLink
          children={["Some link"]}
          text="Some link"
          markType="link"
          value={{ _type: "link", href: "https://example.com" }}
          renderNode={() => undefined}
        />,
      );

      const link = getByRole("link");

      expect(link).toHaveAccessibleName("Some link");
      expect(link).toHaveAttribute("href", "https://example.com");
    });
  });

  describe("PTInternalLink", () => {
    it("renders a link to the provided internal page", () => {
      const { getByRole } = renderWithTheme(
        <PTInternalLink
          children={["Some internal link"]}
          text="Some internal link"
          markType="internalLink"
          value={{
            _type: "internalLink",
            reference: { contentType: "policyPage", slug: "some-policy" },
          }}
          renderNode={() => undefined}
        />,
      );

      const link = getByRole("link");
      expect(link).toHaveAccessibleName("Some internal link");
      expect(link).toHaveAttribute("href", "/legal/some-policy");
    });

    it("renders nothing when not passed a reference", () => {
      const { container } = renderWithTheme(
        <PTInternalLink
          children={["Some internal link"]}
          text="Some internal link"
          markType="internalLink"
          value={{ _type: "internalLink", reference: undefined }}
          renderNode={() => undefined}
        />,
      );

      expect(container).toBeEmptyDOMElement();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it("renders nothing and warns when passed an un-resolved ref", () => {
      const { container } = renderWithTheme(
        <PTInternalLink
          children={["Some internal link"]}
          text="Some internal link"
          markType="internalLink"
          value={{
            _type: "internalLink",
            reference: { _type: "reference", _ref: "abcdef" },
          }}
          renderNode={() => undefined}
        />,
      );
      expect(container).toBeEmptyDOMElement();

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(reportError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          internalReference: { _ref: "abcdef", _type: "reference" },
        }),
      );
    });

    it("renders nothing and warns when it can't resolve a href", () => {
      const { container } = renderWithTheme(
        <PTInternalLink
          children={["Some internal link"]}
          text="Some internal link"
          markType="internalLink"
          value={{
            _type: "internalLink",
            reference: { contentType: "does-not-exist" as never },
          }}
          renderNode={() => undefined}
        />,
      );

      expect(container).toBeEmptyDOMElement();

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(reportError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          internalReference: { contentType: "does-not-exist" },
        }),
      );
    });
  });

  describe("PTActionTrigger", () => {
    it("renders a button that triggers cookie consent manager ", async () => {
      const openSettings = vi.fn();
      (useCookieConsent as Mock).mockImplementation(() => ({
        openSettings,
      }));
      const user = userEvent.setup();

      const { getByRole } = renderWithTheme(
        <PTActionTrigger
          children={["Manage cookies"]}
          text="Manage cookies"
          markType="action"
          value={{
            _type: "action",
            actionType: "OPEN_COOKIE_SETTINGS" as never,
          }}
          renderNode={() => undefined}
        />,
      );

      const button = getByRole("button");
      expect(button).toHaveAccessibleName("Manage cookies");

      await user.click(button);

      await waitFor(() => {
        expect(openSettings).toHaveBeenCalled();
      });
    });
  });

  describe("PTAnchorLink", () => {
    it("renders an anchor link  ", async () => {
      const { getByRole } = renderWithTheme(
        <PTAnchorLink
          children={["An anchor link"]}
          text="An anchor link"
          markType="anchor"
          value={{
            _type: "anchor",
            anchor: "a-section-of-the-page",
          }}
          renderNode={() => undefined}
        />,
      );

      const link = getByRole("link");
      expect(link).toHaveAccessibleName("An anchor link");
      expect(link).toHaveAttribute("href", "#a-section-of-the-page");
    });

    it("renders nothing when not passed an anchor", async () => {
      const { container } = renderWithTheme(
        <PTAnchorLink
          children={["An anchor link"]}
          text="An anchor link"
          markType="anchor"
          renderNode={() => undefined}
        />,
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("PTAnchorTarget", () => {
    it("renders an anchor target", async () => {
      const { getByText, container } = renderWithTheme(
        <PTAnchorTarget
          children={["An anchor target"]}
          text="An anchor target"
          markType="anchorTarget"
          value={{
            _type: "anchorTarget",
            anchor: "a-section-of-the-page",
          }}
          renderNode={() => undefined}
        />,
      );

      const tag = getByText("An anchor target");
      const anchorTarget = container.querySelector(
        "#a-section-of-the-page",
      ) as HTMLElement;

      expect(tag).toContainElement(anchorTarget);
    });

    it("renders nothing when not passed an anchor", async () => {
      const { container } = renderWithTheme(
        <PTAnchorTarget
          children={["An anchor target"]}
          text="An anchor target"
          markType="anchorTarget"
          renderNode={() => undefined}
        />,
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("PortableTextWithDefaults", () => {
    it("renders basic html", () => {
      const { getAllByRole, container } = renderWithTheme(
        <PortableTextWithDefaults value={portableTextFixture} />,
      );

      const lists = getAllByRole("list");
      expect(lists).toHaveLength(2);

      expect(container.querySelector("em")).toBeInTheDocument();
      expect(container.querySelector("strong")).toBeInTheDocument();
    });
  });
});
