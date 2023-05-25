import { UseSearchFiltersReturnType } from "../../context/Search/useSearchFilters";
import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import ActiveFilters from "./ActiveFilters";

jest.mock("next/dist/client/router", () => require("next-router-mock"));
export const mockOnChange = jest.fn();
export const searchFilters: UseSearchFiltersReturnType = {
  keyStageFilters: [
    {
      slug: "ks2",
      title: "Key-stage 2",
      shortCode: "KS2",
      onChange: mockOnChange,
      checked: false,
    },
    {
      slug: "4",
      title: "Key-stage 4",
      shortCode: "KS4",
      onChange: jest.fn(),
      checked: true,
    },
  ],
  subjectFilters: [
    {
      slug: "maths",
      title: "Maths",
      onChange: mockOnChange,
      checked: false,
    },
    {
      slug: "science",
      title: "Science",
      onChange: jest.fn(),
      checked: true,
    },
  ],
};

describe("ActiveFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test.each(
    searchFilters.keyStageFilters
      .filter((ks) => ks.checked)
      .map((ks) => ks.title)
  )("should render the checked filters: %s", (ks) => {
    const { getByRole } = renderWithTheme(
      <ActiveFilters searchFilters={searchFilters} />
    );
    const button = getByRole("button", { name: `Remove ${ks} filter` });
    expect(button).toBeInTheDocument();
  });
  test.each(
    searchFilters.keyStageFilters
      .filter((ks) => !ks.checked)
      .map((ks) => ks.title)
  )("should not render the unchecked filters: %s", (ks) => {
    const { queryByRole } = renderWithTheme(
      <ActiveFilters searchFilters={searchFilters} />
    );
    const button = queryByRole("button", { name: `Remove ${ks} filter` });
    expect(button).not.toBeInTheDocument();
  });
  test.each(
    searchFilters.subjectFilters
      .filter((subject) => subject.checked)
      .map((subject) => subject.title)
  )("should render the checked filters: %s", (subject) => {
    const { getByRole } = renderWithTheme(
      <ActiveFilters searchFilters={searchFilters} />
    );
    const button = getByRole("button", { name: `Remove ${subject} filter` });
    expect(button).toBeInTheDocument();
  });

  test.each(
    searchFilters.subjectFilters
      .filter((subject) => !subject.checked)
      .map((subject) => subject.title)
  )("should not render the unchecked filters: %s", (subject) => {
    const { queryByRole } = renderWithTheme(
      <ActiveFilters searchFilters={searchFilters} />
    );
    const button = queryByRole("button", { name: `Remove ${subject} filter` });
    expect(button).not.toBeInTheDocument();
  });
});
