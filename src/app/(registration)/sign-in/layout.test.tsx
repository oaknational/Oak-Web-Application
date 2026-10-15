import { render, screen } from "@testing-library/react";

import SignInLayout, { metadata } from "./layout";

describe("SignInLayout", () => {
  it("sets a page title", () => {
    expect(metadata.title).toBe("Sign in");
  });

  it("renders its children", () => {
    render(<SignInLayout>sign in content</SignInLayout>);

    expect(screen.getByText("sign in content")).toBeInTheDocument();
  });
});
