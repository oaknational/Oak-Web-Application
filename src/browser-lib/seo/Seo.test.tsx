import { render } from "@testing-library/react";
import mockRouter from "next-router-mock";

import SEO from "./Seo";

jest.mock("next/head", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: Array<React.ReactElement> }) => {
      return <>{children}</>;
    },
  };
});

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const mockSeoProps = {
  title: "Maths lesson",
  description: "This is a lesson about maths...",
};

describe.skip("SEO", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/initial");
  });

  it("should render the title meta tags", () => {
    render(<SEO {...mockSeoProps} />, {
      container: document.head,
    });

    console.log("Fake head element:", document.querySelector("fake-head"));

    expect(document.title).toBe("Maths lesson");
  });

  it("should trim trailing slashes from canonical URLs", () => {
    render(
      <SEO {...mockSeoProps} canonicalURL={"https://thenational.academy/"} />,
      {
        container: document.head,
      },
    );

    const canonical = document
      .querySelector("link[rel=canonical]")
      ?.getAttribute("href");

    expect(canonical).toBe("https://thenational.academy");
  });

  it("should build a default canonical URL from the current route", () => {
    mockRouter.setCurrentUrl("/foo/");

    const props = {
      title: "Maths lesson",
      description: "This is a lesson about maths...",
    };

    render(<SEO {...props} />, {
      container: document.head,
    });

    const canonical = document
      .querySelector("link[rel=canonical]")
      ?.getAttribute("href");

    // The host is coming from config, we may also want to test mocking that
    expect(canonical).toBe("https://www.thenational.academy/foo");
  });
});
