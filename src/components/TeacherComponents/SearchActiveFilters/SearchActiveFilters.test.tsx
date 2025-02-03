import SearchActiveFilters from "./SearchActiveFilters";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { searchFilters } from "@/components/TeacherComponents/SearchFilters/test-helpers";

vi.mock("next/dist/client/router", () => require("next-router-mock"));

describe("SearchActiveFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test.each(
    searchFilters.keyStageFilters
      .filter((ks) => ks.checked)
      .map((ks) => ks.title),
  )("should render the checked filters: %s", (ks) => {
    const { getByRole } = renderWithTheme(
      <SearchActiveFilters searchFilters={searchFilters} />,
    );
    const button = getByRole("button", { name: `Remove ${ks} filter` });
    expect(button).toBeInTheDocument();
  });
  test.each(
    searchFilters.keyStageFilters
      .filter((ks) => !ks.checked)
      .map((ks) => ks.title),
  )("should not render the unchecked filters: %s", (ks) => {
    const { queryByRole } = renderWithTheme(
      <SearchActiveFilters searchFilters={searchFilters} />,
    );
    const button = queryByRole("button", { name: `Remove ${ks} filter` });
    expect(button).not.toBeInTheDocument();
  });
  test.each(
    searchFilters.subjectFilters
      .filter((subject) => subject.checked)
      .map((subject) => subject.title),
  )("should render the checked filters: %s", (subject) => {
    const { getByRole } = renderWithTheme(
      <SearchActiveFilters searchFilters={searchFilters} />,
    );
    const button = getByRole("button", { name: `Remove ${subject} filter` });
    expect(button).toBeInTheDocument();
  });

  test.each(
    searchFilters.subjectFilters
      .filter((subject) => !subject.checked)
      .map((subject) => subject.title),
  )("should not render the unchecked filters: %s", (subject) => {
    const { queryByRole } = renderWithTheme(
      <SearchActiveFilters searchFilters={searchFilters} />,
    );
    const button = queryByRole("button", { name: `Remove ${subject} filter` });
    expect(button).not.toBeInTheDocument();
  });

  test.each(
    searchFilters.contentTypeFilters
      .filter((type) => type.checked)
      .map((ContentType) => ContentType.title),
  )("should render the checked type filters: %s", (ContentType) => {
    const { getByRole } = renderWithTheme(
      <SearchActiveFilters searchFilters={searchFilters} />,
    );
    const button = getByRole("button", {
      name: `Remove ${ContentType} filter`,
    });
    expect(button).toBeInTheDocument();
  });

  test.each(
    searchFilters.contentTypeFilters
      .filter((type) => !type.checked)
      .map((ContentType) => ContentType.title),
  )("should not render the unchecked type filters: %s", (ContentType) => {
    const { queryByRole } = renderWithTheme(
      <SearchActiveFilters searchFilters={searchFilters} />,
    );
    const button = queryByRole("button", {
      name: `Remove ${ContentType} filter`,
    });
    expect(button).not.toBeInTheDocument();
  });
});
