import { DefaultTheme, ThemeProvider } from "styled-components";

import CMSImage from "./CMSImage";

import { mockImageAsset } from "@/__tests__/__helpers__/cms";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("CMSImage", () => {
  it("renders an image", () => {
    const mockImage = mockImageAsset();
    const { getByRole } = render(
      <ThemeProvider
        theme={
          {
            colors: { aqua: "#123456" },
            contrastColors: { aqua: "white" },
          } as DefaultTheme
        }
      >
        <CMSImage image={mockImage} />
      </ThemeProvider>,
    );

    const img = getByRole("presentation");
    expect(img).toBeInTheDocument();
  });

  it("uses the altText from the image prop", async () => {
    const altString = "a donkey in a field on a sunny day";
    const mockImage = { ...mockImageAsset(), altText: altString };

    const { getByRole } = render(<CMSImage image={mockImage} />);

    const img = getByRole("img");
    expect(img.getAttribute("alt")).toBe(altString);
  });

  it("overrides the image altText with the `alt` prop", async () => {
    const altString = "a donkey in a field on a sunny day";
    const altStringOverride = "a horse in a field on an overcast day";
    const mockImage = { ...mockImageAsset(), altText: altString };

    const { getByRole } = render(
      <CMSImage image={mockImage} alt={altStringOverride} />,
    );

    const img = getByRole("img");
    expect(img.getAttribute("alt")).toBe(altStringOverride);
  });

  it("sets an empty alt text string if explicitly provided", async () => {
    const mockImage = mockImageAsset();
    const { getByRole } = render(<CMSImage image={mockImage} alt="" />);

    const img = getByRole("presentation");
    // note: `toHaveAttribute("alt", "")` returns false positives, explicitly check
    expect(img.getAttribute("alt")).toBe("");
  });

  it("hides an image from the accessability tree when isPresentational is true", async () => {
    const altString = "a donkey in a field on a sunny day";
    const mockImage = {
      ...mockImageAsset(),
      altText: altString,
      isPresentational: true,
    };
    const { getByRole, queryByRole } = render(<CMSImage image={mockImage} />);

    const img = queryByRole("presentation");
    expect(img).not.toBeInTheDocument();

    const hiddenImg = getByRole("presentation", { hidden: true });
    // note: `toHaveAttribute("alt", "")` returns false positives, explicitly check
    expect(hiddenImg.getAttribute("alt")).toBe("");
    expect(hiddenImg).toHaveAttribute("aria-hidden", "true");
  });

  it("uses the proxied CDN url", () => {
    const mockImage = mockImageAsset();
    const { getByRole } = render(<CMSImage image={mockImage} />);

    const img = getByRole("presentation");
    expect(img.getAttribute("src")).toBe(
      "https://NEXT_PUBLIC_SANITY_ASSET_CDN_HOST/images/NEXT_PUBLIC_SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_DATASET/abcdef-300x300.png?w=640&h=640&fm=webp&q=80&fit=clip&auto=format",
    );
  });
});
