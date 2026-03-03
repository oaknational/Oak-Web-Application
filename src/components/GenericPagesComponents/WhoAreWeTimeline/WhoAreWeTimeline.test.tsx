import { getByRole } from "@testing-library/dom";

import WhoAreWeTimeline from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

function genPortableText(text: string) {
  return [
    {
      _type: "block",
      children: [{ _type: "span", text }],
    },
  ];
}

describe("WhoAreWeTimeline", () => {
  it("renders correctly", () => {
    const { baseElement, getAllByRole, getAllByTestId } = render(
      <WhoAreWeTimeline
        title={"TEST_TITLE"}
        subTitle={"TEST_SUBTITLE"}
        items={[
          {
            title: "ITEM_TITLE_1",
            subTitle: "ITEM_SUBTITLE_1",
            text: genPortableText("ITEM_TEXT_1"),
          },
          {
            title: "ITEM_TITLE_2",
            subTitle: "ITEM_SUBTITLE_2",
            text: genPortableText("ITEM_TEXT_2"),
          },
          {
            title: "ITEM_TITLE_3",
            subTitle: "ITEM_SUBTITLE_3",
            text: [
              {
                markDefs: [
                  {
                    anchor: "newsletter-signup",
                    _type: "anchorLink",
                    _key: "683215566391",
                  },
                  {
                    anchor: null,
                    _type: "anchorLink",
                    _key: "683215566392",
                  },
                ],
                children: [
                  {
                    marks: [],
                    text: "ITEM_TEXT_3",
                    _key: "18ee5a82e52d",
                    _type: "span",
                  },
                  {
                    _type: "span",
                    marks: ["683215566391"],
                    text: "TEST_LINK_1",
                    _key: "c8e9af4e47b7",
                  },
                  {
                    _type: "span",
                    marks: ["683215566392"],
                    text: "TEST_LINK_2",
                    _key: "c8e9af4e47b8",
                  },
                ],
                _type: "block",
                style: "normal",
                _key: "39d387e70e2a",
              },
            ],
          },
        ]}
      />,
    );
    expect(baseElement).toMatchSnapshot();
    const headingEls = getAllByRole("heading");
    expect(headingEls[0]).toHaveTextContent("TEST_TITLE");

    const itemEls = getAllByTestId("timetable-timeline-item");
    itemEls.forEach((itemEl, index) => {
      expect(getByRole(itemEl, "heading")).toHaveTextContent(
        `ITEM_TITLE_${index + 1}`,
      );
      expect(itemEl).toHaveTextContent(`ITEM_TEXT_${index + 1}`);
    });
    const linkEl = getAllByRole("link");
    expect(linkEl[0]?.textContent).toEqual("TEST_LINK_1");
    expect(linkEl[0]?.getAttribute("href")).toEqual("#newsletter-signup");
    expect(linkEl[1]?.textContent).toEqual("TEST_LINK_2");
    expect(linkEl[1]?.getAttribute("href")).toEqual("#");
  });
});
