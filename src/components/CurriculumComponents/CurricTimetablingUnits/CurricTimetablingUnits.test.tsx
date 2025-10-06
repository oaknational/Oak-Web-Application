import { waitFor } from "@testing-library/dom";
import { act } from "@testing-library/react";

import { CurricTimetablingUnits } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("CurricTimetablingUnits", () => {
  test("snapshot", () => {
    const { container } = renderWithTheme(
      <CurricTimetablingUnits subjectPhaseSlug={"maths-primary"} />,
    );
    expect(container).toMatchSnapshot();
  });
  test("edit details", () => {
    const { getAllByRole, getByTestId } = renderWithTheme(
      <CurricTimetablingUnits subjectPhaseSlug={"maths-primary"} />,
    );
    const els = getAllByRole("button");
    expect(els[0]).toHaveTextContent("Edit details");

    act(() => {
      els[0]!.click();
    });

    waitFor(() => {
      expect(getByTestId("edit-details-modal")).toBeTruthy();
    });
  });

  test("copy link", () => {
    const { getAllByRole } = renderWithTheme(
      <CurricTimetablingUnits subjectPhaseSlug={"maths-primary"} />,
    );
    const els = getAllByRole("button");
    expect(els[1]).toHaveTextContent("Copy link");

    act(() => {
      els[1]!.click();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
