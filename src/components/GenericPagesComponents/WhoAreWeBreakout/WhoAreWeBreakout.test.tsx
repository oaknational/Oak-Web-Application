import { WhoAreWeBreakout } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("WhoAreWeBreakout", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <WhoAreWeBreakout
        content="TESTING_CONTENT"
        image={{
          asset: {
            _id: `image-1-300x300-png`,
            url: `https://cdn.sanity.io/images/p/d/1-300x300.png`,
          },
          altText: "test",
        }}
      />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("paragraph")).toHaveTextContent("TESTING_CONTENT");
    const imageEl = getByRole("img");
    expect(imageEl).toHaveAttribute(
      "src",
      "https://NEXT_PUBLIC_SANITY_ASSET_CDN_HOST/images/NEXT_PUBLIC_SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_DATASET/1-300x300.png?w=640&h=640&fm=webp&q=80&fit=clip&auto=format",
    );
    expect(imageEl).toHaveAttribute("alt", "test");
  });
});
