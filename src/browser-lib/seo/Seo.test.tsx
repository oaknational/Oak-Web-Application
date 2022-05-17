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

describe("Seo", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/initial");
  });

  it("should render the title meta tags", () => {
    const props = {
      title: "Maths lesson",
      description: "This is a lesson about maths...",
    };

    render(<SEO {...props} />, {
      container: document.head,
    });

    expect(document.title).toBe("Maths lesson");
  });
});
