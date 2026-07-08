import { OaksImpactStats } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("OaksImpactStats", () => {
  it("renders correctly", () => {
    const data = {
      headingText: "MAIN_HEADER",
      headingCopy: "MAIN_HEADER_COPY",
      link: {
        href: "#",
        text: "LINK",
      },
      items: new Array(3).fill(true).map((_item, index) => {
        return {
          image: {
            alt: "",
            src: "https://res.cloudinary.com/oak-web-application/image/upload/v1749031463/icons/clipboard_yll2yj.svg",
          },
          headingText: `ITEM_HEADING_${index}`,
          body: `ITEM_HEADING_BODY_${index}`,
        };
      }),
    };
    const { baseElement, getByRole } = render(<OaksImpactStats {...data} />);
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { level: 2 })).toHaveTextContent("MAIN_HEADER");
  });
});
