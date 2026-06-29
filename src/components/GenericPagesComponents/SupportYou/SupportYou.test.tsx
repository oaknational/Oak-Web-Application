import { SupportYou } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("SupportYou", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <SupportYou
        title="TESTING_HEADING"
        body="TESTING_CONTENT"
        link={{
          href: "#",
          text: "TESTING_LINK",
        }}
        image={{
          asset: {
            _id: "ef2a05d634b1ade34d33664c44fa36cb62e1aaba-3000x2001-jpg",
            url: "https://NEXT_PUBLIC_SANITY_ASSET_CDN_HOST/images/NEXT_PUBLIC_SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_DATASET/1-300x300.png",
          },
          altText: "TEST_ALT",
        }}
      />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent("TESTING_HEADING");
    expect(getByRole("paragraph")).toHaveTextContent("TESTING_CONTENT");
    expect(getByRole("link")).toHaveTextContent("TESTING_LINK");
    const imageEl = getByRole("img");
    expect(imageEl).toHaveAttribute(
      "src",
      "https://NEXT_PUBLIC_SANITY_ASSET_CDN_HOST/images/NEXT_PUBLIC_SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_DATASET/1-300x300.png",
    );
    expect(imageEl).toHaveAttribute("alt", "TEST_ALT");
  });
});
