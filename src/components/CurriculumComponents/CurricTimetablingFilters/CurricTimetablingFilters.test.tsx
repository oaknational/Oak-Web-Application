import CurricTimetablingFilters from "./";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { createFilter } from "@/fixtures/curriculum/filters";
import { createYearData } from "@/fixtures/curriculum/yearData";
import { createThread } from "@/fixtures/curriculum/thread";
import { createUnit } from "@/fixtures/curriculum/unit";
import { findAccosiatedLabel } from "@/utils/curriculum/dom";

describe("CurricTimetablingFilters", () => {
  test("basic usage", () => {
    const thread1 = createThread({ slug: "addition" });
    const thread2 = createThread({ slug: "subtraction" });

    const { baseElement, getAllByTestId } = renderWithTheme(
      <CurricTimetablingFilters
        filters={createFilter({})}
        onChangeFilters={() => {}}
        data={{
          yearData: {
            "1": createYearData({
              units: [createUnit({ slug: "test-1", threads: [thread1] })],
            }),
            "2": createYearData({
              units: [createUnit({ slug: "test-2", threads: [thread2] })],
            }),
          },
          threadOptions: [thread1, thread2],
          yearOptions: ["1", "2"],
        }}
        slugs={{
          phaseSlug: "primary",
          subjectSlug: "maths",
          ks4OptionSlug: null,
        }}
      />,
    );

    const findAccosiatedLabelWithBase = findAccosiatedLabel.bind(
      null,
      baseElement,
    );

    const yearRadios = getAllByTestId("year-radio");
    expect(yearRadios).toHaveLength(2);
    expect(findAccosiatedLabelWithBase(yearRadios[0]!)).toHaveTextContent(
      "Year 1",
    );
    expect(findAccosiatedLabelWithBase(yearRadios[1]!)).toHaveTextContent(
      "Year 2",
    );

    const threadRadios = getAllByTestId("thread-radio");
    expect(threadRadios).toHaveLength(2);
    expect(findAccosiatedLabelWithBase(threadRadios[0]!)).toHaveTextContent(
      "Addition",
    );
    expect(findAccosiatedLabelWithBase(threadRadios[1]!)).toHaveTextContent(
      "Subtraction",
    );
    expect(baseElement).toMatchSnapshot();
  });
});
