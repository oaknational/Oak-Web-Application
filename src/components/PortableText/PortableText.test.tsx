import { PortableText } from "@portabletext/react";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import noop from "../../__tests__/__helpers__/noop";
import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";
import { useCookieConsent } from "../../browser-lib/cookie-consent/CookieConsentProvider";

import {
  BasePortableTextProvider,
  PTExternalLink,
  PTInternalLink,
} from "./PortableText";
import { PTActionTrigger } from "./PTActionTrigger";
import portableTextFixture from "./portableTextFixture.json";

const consoleWarnSpy = jest.spyOn(console, "warn");
consoleWarnSpy.mockImplementation(noop);

jest.mock("../../browser-lib/cookie-consent/CookieConsentProvider");

const reportError = jest.fn();
jest.mock("../../common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

describe("PortableText", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
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
        />
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
        />
      );

      const link = getByRole("link");
      expect(link).toHaveAccessibleName("Some internal link");
      expect(link).toHaveAttribute("href", "/legal/some-policy");
    });

    it("renders nothing and warns when it can't resolve a href", () => {
      const { queryByRole } = renderWithTheme(
        <PTInternalLink
          children={["Some internal link"]}
          text="Some internal link"
          markType="internalLink"
          value={{
            _type: "internalLink",
            reference: { contentType: "doesntExist" as never },
          }}
          renderNode={() => undefined}
        />
      );

      const link = queryByRole("link");
      expect(link).not.toBeInTheDocument();

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(reportError).toHaveBeenCalled();
    });
  });

  describe("PTActionTrigger", () => {
    it("renders a button that triggers cookie consent manager ", async () => {
      const showConsentManager = jest.fn();
      (useCookieConsent as jest.Mock).mockImplementation(() => ({
        showConsentManager,
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
        />
      );

      const button = getByRole("button");
      expect(button).toHaveAccessibleName("Manage cookies");

      await user.click(button);

      await waitFor(() => {
        expect(showConsentManager).toHaveBeenCalled();
      });
    });
  });

  describe("BasePortableTextProvider", () => {
    it("renders basic html", () => {
      const { getAllByRole, container } = renderWithTheme(
        <BasePortableTextProvider>
          <PortableText value={portableTextFixture} />
        </BasePortableTextProvider>
      );

      const lists = getAllByRole("list");
      expect(lists).toHaveLength(2);

      expect(container.querySelector("em")).toBeInTheDocument();
      expect(container.querySelector("strong")).toBeInTheDocument();
    });
  });
});
