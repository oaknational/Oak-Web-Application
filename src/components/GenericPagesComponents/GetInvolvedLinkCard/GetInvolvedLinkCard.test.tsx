import { GetInvolvedLinkCard } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("GetInvolvedLinkCard", () => {
  it("renders", () => {
    const { container } = render(
      <GetInvolvedLinkCard
        headingTag={"h2"}
        headingTitle={"Give your feedback"}
        buttons={[{ text: "Get in touch", link: "#" }]}
        content="Share your story and we'll send you a gift voucher as a thanks for your time. Whether you've planned more efficiently, strengthened your subject knowledge or refreshed your curriculum design, your experience can inspire other teachers."
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
