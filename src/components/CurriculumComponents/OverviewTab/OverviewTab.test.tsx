import { forwardRef } from "react";
import { act } from "@testing-library/react";

import OverviewTab from "./OverviewTab";

import curriculumOverviewTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { mockVideoAsset } from "@/__tests__/__helpers__/cms";

const render = renderWithProvidersByName(["theme", "oakTheme", "analytics"]);

jest.mock("@mux/mux-player-react/lazy", () => {
  return forwardRef((props, ref) => {
    ref; // This prevents warning about ref not being used
    return <div data-testid="mux-player-mock" />;
  });
});

describe("Component - Overview Tab", () => {
  const mockOnClickNavItem = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    mockOnClickNavItem.mockClear();

    // Not supported in jsdom
    Element.prototype.checkVisibility = jest.fn(() => true) as jest.Mock;
    Element.prototype.scrollIntoView = jest.fn(() => {}) as jest.Mock;
  });

  test("explainer displayed", async () => {
    const fixture = curriculumOverviewTabFixture();
    fixture.curriculumCMSInfo.subjectPrinciples = [
      "Sequences learning over time which: • Builds musical knowledge, techniques and specialist language • Promotes the understanding of a diverse range of genres, traditions and styles • Develops pupils analytical skills in responding to different types of music",
    ];
    const { getByTestId, queryByTestId } = render(
      <OverviewTab data={fixture} onClickNavItem={mockOnClickNavItem} />,
    );
    const explainer = getByTestId("explainer");
    expect(explainer).toHaveTextContent("Aims and purpose");
    expect(queryByTestId("video-guide")).not.toBeInTheDocument();
  });

  test("multiple curriculum partners", async () => {
    const fixture = curriculumOverviewTabFixture();
    fixture.curriculumCMSInfo.curriculumPartnerOverviews = [
      {
        partnerBio: "PARTNER_1",
        partnerBioPortableTextRaw: [
          {
            style: "normal",
            _type: "block",
            children: [
              {
                _type: "span",
                marks: [],
                text: "PARTNER_PORTABLETEXT_1",
              },
            ],
          },
        ],
        curriculumPartner: fixture.curriculumCMSInfo.curriculumPartner,
      },
      {
        partnerBio: "PARTNER_2",
        partnerBioPortableTextRaw: [
          {
            style: "normal",
            _type: "block",
            children: [
              {
                _type: "span",
                marks: [],
                text: "PARTNER_PORTABLETEXT_2",
              },
            ],
          },
        ],
        curriculumPartner: fixture.curriculumCMSInfo.curriculumPartner,
      },
    ];
    const { queryAllByTestId } = render(
      <OverviewTab data={fixture} onClickNavItem={mockOnClickNavItem} />,
    );
    const partnerElements = queryAllByTestId("curriculum-partner");
    expect(partnerElements.length).toBe(2);
    expect(partnerElements[0]).toHaveTextContent("PARTNER_PORTABLETEXT_1");
    expect(partnerElements[1]).toHaveTextContent("PARTNER_PORTABLETEXT_2");
  });

  test("multiple curriculum partners", async () => {
    const fixture = curriculumOverviewTabFixture();
    fixture.curriculumCMSInfo.curriculumPartnerOverviews = [
      {
        partnerBio: "PARTNER_1",
        partnerBioPortableTextRaw: null,
        curriculumPartner: fixture.curriculumCMSInfo.curriculumPartner,
      },
      {
        partnerBio: "PARTNER_2",
        partnerBioPortableTextRaw: null,
        curriculumPartner: fixture.curriculumCMSInfo.curriculumPartner,
      },
    ];
    const { queryAllByTestId } = render(
      <OverviewTab data={fixture} onClickNavItem={mockOnClickNavItem} />,
    );
    const partnerElements = queryAllByTestId("curriculum-partner");
    expect(partnerElements.length).toBe(2);
    expect(partnerElements[0]).toHaveTextContent("PARTNER_1");
    expect(partnerElements[1]).toHaveTextContent("PARTNER_2");
  });

  test("explainer displayed when cycle 2 features enabled with video", async () => {
    const fixture = curriculumOverviewTabFixture();
    fixture.curriculumCMSInfo.subjectPrinciples = [
      "Sequences learning over time which: • Builds musical knowledge, techniques and specialist language • Promotes the understanding of a diverse range of genres, traditions and styles • Develops pupils analytical skills in responding to different types of music",
    ];
    fixture.curriculumCMSInfo.video = mockVideoAsset();
    fixture.curriculumCMSInfo.videoExplainer = "testing";
    const { getByTestId, queryByTestId } = render(
      <OverviewTab data={fixture} onClickNavItem={mockOnClickNavItem} />,
    );
    const explainer = getByTestId("explainer");
    expect(explainer).toHaveTextContent("Aims and purpose");
    expect(queryByTestId("video-guide")).toBeInTheDocument();
  });

  test("click heading links", async () => {
    const fixture = curriculumOverviewTabFixture();
    const { getAllByRole } = render(
      <OverviewTab data={fixture} onClickNavItem={mockOnClickNavItem} />,
    );
    const links = getAllByRole("link");
    expect(links[0]).toHaveTextContent("Aims and purpose");
    act(() => {
      links[0]!.click();
    });
    expect(mockOnClickNavItem).toHaveBeenCalledWith("#header-aims-and-purpose");
    (Element.prototype.checkVisibility as jest.Mock).mockClear();

    act(() => {
      links[1]!.click();
    });
    expect(mockOnClickNavItem).toHaveBeenCalledWith("#header-heading-1");
    (Element.prototype.checkVisibility as jest.Mock).mockClear();
  });
});
