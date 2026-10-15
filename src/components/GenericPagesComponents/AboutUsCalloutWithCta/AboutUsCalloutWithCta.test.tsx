import { AboutUsCalloutWithCta } from ".";

import { joinResearchPanelHeaderBlockFixture } from "@/__tests__/pages/about-us/get-involved/join-research-panel.fixtures";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";

const render = renderWithProvidersByName(["oakTheme"]);

describe("AboutUsCalloutWithCta", () => {
  it("renders default content correctly", () => {
    const { baseElement, getByRole } = render(
      <AboutUsCalloutWithCta
        link={{
          text: "Get in touch with an expert",
          href: "https://share.hsforms.com/2yBT-92_WT6CvX1b6L3Iw8Qbvumd",
        }}
      />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent(
      "Discover how Oak can support you",
    );
    expect(getByRole("paragraph")).toHaveTextContent(
      "To explore the impact Oak’s curricula could have in your school or trust, fill out the form below and one of our experts will be in touch shortly.",
    );
    expect(getByRole("link")).toHaveTextContent("Get in touch with an expert");
  });

  it("renders custom content correctly", () => {
    const { baseElement, getByRole } = render(
      <AboutUsCalloutWithCta
        headingTag="h1"
        link={{
          text: joinResearchPanelHeaderBlockFixture.button.label,
          href: getLinkHref(joinResearchPanelHeaderBlockFixture.button),
        }}
        title={joinResearchPanelHeaderBlockFixture.title}
        text={joinResearchPanelHeaderBlockFixture.bodyRaw}
        image={joinResearchPanelHeaderBlockFixture.image}
      />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent(
      "Join the Oak research panel",
    );
    expect(getByRole("paragraph")).toHaveTextContent(
      "Your feedback is essential to help us understand the realities of teaching and learning. By listening to teachers like you, we learn about your preferences, challenges and needs, and can use these insights to shape Oak curriculum resources, lessons and tools.",
    );
    expect(getByRole("link")).toHaveTextContent("Join the research panel");
  });
});
