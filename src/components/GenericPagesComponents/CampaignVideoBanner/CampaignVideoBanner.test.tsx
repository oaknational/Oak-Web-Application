import { CampaignVideoBanner } from "./CampaignVideoBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockVideoAsset } from "@/__tests__/__helpers__/cms";
import {
  bodyPortableText,
  headingPortableText,
} from "@/fixtures/campaign/portableText";
import { campaignTextStyles } from "@/pages/campaigns/[campaignSlug]";

const render = renderWithProviders();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPlayer = jest.fn((_props: never) => <div />);

jest.mock("@/components/SharedComponents/VideoPlayer", () => ({
  __esModule: true,
  default: (props: never) => mockPlayer(props),
}));

jest.mock("@/common-lib/urls", () => ({
  resolveOakHref: jest.fn(),
}));

describe("CampaignVideoBanner", () => {
  it("should render the heading", () => {
    const { getByRole } = render(
      <CampaignVideoBanner
        textStyles={campaignTextStyles}
        heading={headingPortableText()}
        video={mockVideoAsset()}
      />,
    );

    const heading = getByRole("heading");
    expect(heading).toBeInTheDocument();

    const headingText = headingPortableText()[0]?.children[0]?.text;
    if (!headingText) throw new Error("No heading text found in fixture");
    expect(heading).toHaveTextContent(headingText);
  });

  it("should render the subheading/body text", () => {
    const bodyFixture = bodyPortableText();
    const { getByRole } = render(
      <CampaignVideoBanner
        textStyles={campaignTextStyles}
        heading={headingPortableText()}
        subheading={bodyFixture}
        video={mockVideoAsset()}
      />,
    );
    const body = getByRole("paragraph");
    const bodyText = bodyFixture[0]?.children[0]?.text;
    if (!bodyText) throw new Error("No body text found in fixture");
    expect(body).toHaveTextContent(bodyText);
  });

  it("should render a given video", () => {
    const mockVideo = mockVideoAsset();
    render(
      <CampaignVideoBanner
        textStyles={campaignTextStyles}
        heading={headingPortableText()}
        video={mockVideo}
      />,
    );

    expect(mockPlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        playbackId: mockVideo.video.asset.playbackId,
        thumbnailTime: mockVideo.video.asset.thumbTime,
        title: mockVideo.title,
      }),
    );
  });
});
