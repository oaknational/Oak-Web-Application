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
            text: genPortableText("ITEM_TEXT_3"),
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
  });
});
