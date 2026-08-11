import { act } from "@testing-library/react";

import { CurricFiltersSubjectCategories } from "./CurricFiltersSubjectCategories";
import {
  ks4Setup,
  ks3and4Setup,
} from "./CurricFiltersSubjectCategories.fixtures";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricFiltersSubjectCategories", () => {
  it("renders correctly ks4 only", () => {
    const { getAllByRole, getByText } = render(
      <CurricFiltersSubjectCategories
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
          pathways: [],
          keystages: [],
        }}
        slugs={{
          subjectSlug: "english",
          phaseSlug: "secondary",
          ks4OptionSlug: null,
        }}
        onChangeFilters={() => {}}
        data={ks4Setup}
        context="curriculum-visualiser"
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(3);
    expect(getByText("Category (KS4)")).toBeInTheDocument();

    expect(elements[0]!.value).toEqual("biology");
    expect(elements[1]!.value).toEqual("chemistry");
    expect(elements[2]!.value).toEqual("physics");
  });

  it("renders correctly ks3 & ks4", () => {
    const { getAllByRole, getByText } = render(
      <CurricFiltersSubjectCategories
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["7", "8", "9", "10", "11"],
          threads: [],
          pathways: [],
          keystages: [],
        }}
        slugs={{
          subjectSlug: "english",
          phaseSlug: "secondary",
          ks4OptionSlug: null,
        }}
        onChangeFilters={() => {}}
        data={ks3and4Setup}
        context="curriculum-visualiser"
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(3);
    expect(getByText("Category")).toBeInTheDocument();
    expect(elements[0]!.value).toEqual("biology");
    expect(elements[1]!.value).toEqual("chemistry");
    expect(elements[2]!.value).toEqual("physics");
  });

  it("interacts correctly", () => {
    const onChangeFilters = jest.fn();
    const { getAllByRole } = render(
      <CurricFiltersSubjectCategories
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
          pathways: [],
          keystages: [],
        }}
        slugs={{
          subjectSlug: "english",
          phaseSlug: "secondary",
          ks4OptionSlug: null,
        }}
        onChangeFilters={onChangeFilters}
        data={ks4Setup}
        context="curriculum-visualiser"
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(3);

    act(() => elements[0]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith(
      {
        subjectCategories: ["biology"],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["10", "11"],
        pathways: [],
        keystages: [],
      },
      "subject_category_button",
    );
    act(() => elements[1]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith(
      {
        subjectCategories: ["chemistry"],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["10", "11"],
        pathways: [],
        keystages: [],
      },
      "subject_category_button",
    );
    act(() => elements[2]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith(
      {
        subjectCategories: ["physics"],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["10", "11"],
        pathways: [],
        keystages: [],
      },
      "subject_category_button",
    );
  });
});
