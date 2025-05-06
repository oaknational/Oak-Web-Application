import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import SearchActiveFilters from "./SearchActiveFilters";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { searchFilters } from "@/components/TeacherComponents/SearchFilters/test-helpers";
import { trackSearchModified } from "@/components/TeacherViews/Search/helpers";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const mockSearchTerm = "macbeth";
const searchFilterModifiedMock = jest.fn();

describe("SearchActiveFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test.each(
    searchFilters.keyStageFilters
      .filter((ks) => ks.checked)
      .map((ks) => ks.title),
  )("should render the checked filters: %s", async (ks) => {
    const { getByRole } = renderWithTheme(
      <SearchActiveFilters
        searchFilters={searchFilters}
        trackSearchModified={trackSearchModified(
          mockSearchTerm,
          searchFilterModifiedMock,
        )}
      />,
    );
    const button = getByRole("button", { name: `Remove ${ks} filter` });
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    await waitFor(() => {
      expect(searchFilterModifiedMock).toHaveBeenLastCalledWith({
        analyticsUseCase: "Teacher",
        componentType: "filter_link",
        engagementIntent: "refine",
        eventVersion: "2.0.0",
        filterModificationType: "remove",
        filterType: "Key stage filter",
        filterValue: ks,
        platform: "owa",
        product: "teacher lesson resources",
        searchTerm: "macbeth",
      });
    });
  });
  test.each(
    searchFilters.keyStageFilters
      .filter((ks) => !ks.checked)
      .map((ks) => ks.title),
  )("should not render the unchecked filters: %s", (ks) => {
    const { queryByRole } = renderWithTheme(
      <SearchActiveFilters
        searchFilters={searchFilters}
        trackSearchModified={trackSearchModified(
          mockSearchTerm,
          searchFilterModifiedMock,
        )}
      />,
    );
    const button = queryByRole("button", { name: `Remove ${ks} filter` });
    expect(button).not.toBeInTheDocument();
  });
  test.each(
    searchFilters.subjectFilters
      .filter((subject) => subject.checked)
      .map((subject) => subject.title),
  )("should render the checked filters: %s", async (subject) => {
    const { getByRole } = renderWithTheme(
      <SearchActiveFilters
        searchFilters={searchFilters}
        trackSearchModified={trackSearchModified(
          mockSearchTerm,
          searchFilterModifiedMock,
        )}
      />,
    );
    const button = getByRole("button", { name: `Remove ${subject} filter` });
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    await waitFor(() => {
      expect(searchFilterModifiedMock).toHaveBeenLastCalledWith({
        analyticsUseCase: "Teacher",
        componentType: "filter_link",
        engagementIntent: "refine",
        eventVersion: "2.0.0",
        filterModificationType: "remove",
        filterType: "Subject filter",
        filterValue: subject,
        platform: "owa",
        product: "teacher lesson resources",
        searchTerm: "macbeth",
      });
    });
  });

  test.each(
    searchFilters.subjectFilters
      .filter((subject) => !subject.checked)
      .map((subject) => subject.title),
  )("should not render the unchecked filters: %s", (subject) => {
    const { queryByRole } = renderWithTheme(
      <SearchActiveFilters
        searchFilters={searchFilters}
        trackSearchModified={trackSearchModified(
          mockSearchTerm,
          searchFilterModifiedMock,
        )}
      />,
    );
    const button = queryByRole("button", { name: `Remove ${subject} filter` });
    expect(button).not.toBeInTheDocument();
  });

  test.each(
    searchFilters.contentTypeFilters
      .filter((type) => type.checked)
      .map((ContentType) => ContentType.title),
  )("should render the checked type filters: %s", async (ContentType) => {
    const { getByRole } = renderWithTheme(
      <SearchActiveFilters
        searchFilters={searchFilters}
        trackSearchModified={trackSearchModified(
          mockSearchTerm,
          searchFilterModifiedMock,
        )}
      />,
    );
    const button = getByRole("button", {
      name: `Remove ${ContentType} filter`,
    });
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    await waitFor(() => {
      expect(searchFilterModifiedMock).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        componentType: "filter_link",
        engagementIntent: "refine",
        eventVersion: "2.0.0",
        filterModificationType: "remove",
        filterType: "Content type filter",
        filterValue: ContentType,
        platform: "owa",
        product: "teacher lesson resources",
        searchTerm: "macbeth",
      });
    });
  });

  test.each(
    searchFilters.contentTypeFilters
      .filter((type) => !type.checked)
      .map((ContentType) => ContentType.title),
  )("should not render the unchecked type filters: %s", (ContentType) => {
    const { queryByRole } = renderWithTheme(
      <SearchActiveFilters
        searchFilters={searchFilters}
        trackSearchModified={trackSearchModified(
          mockSearchTerm,
          searchFilterModifiedMock,
        )}
      />,
    );
    const button = queryByRole("button", {
      name: `Remove ${ContentType} filter`,
    });
    expect(button).not.toBeInTheDocument();
  });

  test.each(
    searchFilters.yearGroupFilters
      .filter((yearGroup) => yearGroup.checked)
      .map((yearGroup) => yearGroup.title),
  )("should render the checked year group filters: %s", async (yearGroup) => {
    const { getByRole } = renderWithTheme(
      <SearchActiveFilters
        searchFilters={searchFilters}
        trackSearchModified={trackSearchModified(
          mockSearchTerm,
          searchFilterModifiedMock,
        )}
      />,
    );
    const button = getByRole("button", {
      name: `Remove ${yearGroup} filter`,
    });
    expect(button).toBeInTheDocument();

    userEvent.click(button);
    await waitFor(() => {
      expect(searchFilterModifiedMock).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        componentType: "filter_link",
        engagementIntent: "refine",
        eventVersion: "2.0.0",
        filterModificationType: "remove",
        filterType: "Year filter",
        filterValue: "Year 10",
        platform: "owa",
        product: "teacher lesson resources",
        searchTerm: "macbeth",
      });
    });
  });
});
