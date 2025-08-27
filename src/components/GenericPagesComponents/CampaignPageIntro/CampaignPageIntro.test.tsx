import { screen } from "@testing-library/dom";

import { bodyPortableText } from "../SupportYourTeamTextBlockCard/SupportYourTeamTextBlockCard.stories";

import { CampaignPageIntro } from "./CampaignPageIntro";
import { headingPortableText } from "./campaignPageIntro.fixtures";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";



const render = renderWithProviders();

describe("CampaignPageIntro", () => {
  it("should render a heading", () => {
    render(
      <CampaignPageIntro
        heading={headingPortableText}
        body={bodyPortableText}
      />,
    );
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    const headingText = headingPortableText[0]?.children[0]?.text;
    if (!headingText) throw new Error("No heading text found in fixture");
    expect(heading).toHaveTextContent(headingText);
  });
  it("should render body text as a p", () => {
    render(
      <CampaignPageIntro
        heading={headingPortableText}
        body={bodyPortableText}
      />,
    );
    const body = screen.getByRole("paragraph");
    const bodyText = bodyPortableText[0]?.children[0]?.text;
    if (!bodyText) throw new Error("No body text found in fixture");
    expect(body).toHaveTextContent(bodyText);
  });
});
