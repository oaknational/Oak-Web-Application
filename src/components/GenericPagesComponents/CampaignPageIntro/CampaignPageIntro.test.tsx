import { screen } from "@testing-library/dom";

import { CampaignPageIntro } from "./CampaignPageIntro";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { headingPortableText } from "@/fixtures/campaign/portableText";
import { campaignTextStyles } from "@/pages/campaigns/[campaignSlug]";

const bodyPortableText = [
  {
    _key: "f4b422515ecb",
    _type: "block",
    children: [
      {
        _key: "2fc17246dfe10",
        _type: "span",
        marks: [],
        text: "Using Oak as a foundation for lesson planning can save teachers three hours per week; that’s the equivalent of three weeks a year.",
      },
    ],
    markDefs: [],
    style: "normal",
  },
  {
    _key: "ef36946e7316",
    _type: "block",
    children: [
      {
        _key: "70449613c203",
        _type: "span",
        marks: [],
        text: "Thousands of high-quality, sequenced lesson resources",
      },
    ],
    level: 1,
    listItem: "bullet",
    markDefs: [],
    style: "normal",
  },
];

const render = renderWithProviders();

describe("CampaignPageIntro", () => {
  it("should render a heading", () => {
    render(
      <CampaignPageIntro
        textStyles={campaignTextStyles}
        heading={headingPortableText()}
        body={bodyPortableText}
      />,
    );
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    const headingText = headingPortableText()[0]?.children[0]?.text;
    if (!headingText) throw new Error("No heading text found in fixture");
    expect(heading).toHaveTextContent(headingText);
  });
  it("should render body text as a p", () => {
    render(
      <CampaignPageIntro
        textStyles={campaignTextStyles}
        heading={headingPortableText()}
        body={bodyPortableText}
      />,
    );
    const body = screen.getByRole("paragraph");
    const bodyText = bodyPortableText[0]?.children[0]?.text;
    if (!bodyText) throw new Error("No body text found in fixture");
    expect(body).toHaveTextContent(bodyText);
  });
});
