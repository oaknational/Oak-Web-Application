import { render, screen } from "@testing-library/react";
import { DefaultTheme, ThemeProvider } from "styled-components";

import { mockImageAsset } from "../../__tests__/__helpers__/cms";
import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import CMSImage from "./CMSImage";

describe("CMSImage", () => {
  it("renders an image", () => {
    const mockImage = mockImageAsset();
    render(
      <ThemeProvider
        theme={
          {
            colors: { pastelTurqoise: "#123456" },
            contrastColors: { pastelTurqoise: "white" },
          } as DefaultTheme
        }
      >
        <CMSImage image={mockImage} />
      </ThemeProvider>
    );

    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
  });

  it("uses the altText from the image prop", async () => {
    const altString = "a donkey in a field on a sunny day";
    const mockImage = { ...mockImageAsset(), altText: altString };

    renderWithProviders(<CMSImage image={mockImage} />);

    const img = screen.getByRole("img");
    expect(img.getAttribute("alt")).toBe(altString);
  });

  it("overrides the image altText with the `alt` prop", async () => {
    const altString = "a donkey in a field on a sunny day";
    const altStringOverride = "a horse in a field on an overcast day";
    const mockImage = { ...mockImageAsset(), altText: altString };

    renderWithProviders(<CMSImage image={mockImage} alt={altStringOverride} />);

    const img = screen.getByRole("img");
    expect(img.getAttribute("alt")).toBe(altStringOverride);
  });

  it("sets an empty alt text string if explicitly provided", async () => {
    const mockImage = mockImageAsset();
    renderWithProviders(<CMSImage image={mockImage} alt="" />);

    const img = screen.getByRole("img");
    // note: `toHaveAttribute("alt", "")` returns false positives, explicitly check
    expect(img.getAttribute("alt")).toBe("");
  });
});
