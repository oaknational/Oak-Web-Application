import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SuggestedFilters from "./SearchSuggestedFilters";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { SearchIntent } from "@/pages/api/search/schemas";
import { convertSearchIntentToFilters } from "@/context/Search/search.helpers";
import { SearchQuery, SetSearchQuery } from "@/context/Search/search.types";

function createSetQuery(initial: SearchQuery): {
  setQuery: SetSearchQuery;
  getCurrent: () => SearchQuery;
} {
  let current = { ...initial } as SearchQuery;
  const setQuery: SetSearchQuery = (update) => {
    if (typeof update === "function") {
      const partial = update(current);
      current = { ...current, ...partial };
    } else {
      current = { ...current, ...update };
    }
  };
  return { setQuery, getCurrent: () => current };
}

const MOCK_INTENT: SearchIntent = {
  directMatch: {
    subject: { slug: "maths", title: "Maths" },
    keyStage: null,
    year: null,
    examBoard: null,
  },
  suggestedFilters: [
    { type: "subject", slug: "maths", title: "Maths" },
    { type: "key-stage", slug: "ks1", title: "Ks1" },
    { type: "key-stage", slug: "ks2", title: "Ks2" },
    { type: "key-stage", slug: "ks3", title: "Ks3" },
    { type: "key-stage", slug: "ks4", title: "Ks4" },
    { type: "exam-board", slug: "aqa", title: "Aqa" },
    { type: "exam-board", slug: "edexcel", title: "Edexcel" },
  ],
};

describe("SearchSuggestedFilters", () => {
  it("renders suggested filters from provided intent", () => {
    const query: SearchQuery = { term: "maths" };
    const { setQuery } = createSetQuery(query);

    renderWithTheme(
      <SuggestedFilters
        setQuery={setQuery}
        query={query}
        searchFilters={convertSearchIntentToFilters(MOCK_INTENT)}
      />,
    );

    expect(screen.getByLabelText("Maths suggested filter")).toBeInTheDocument();
    expect(screen.getByLabelText("Ks1 suggested filter")).toBeInTheDocument();
    expect(screen.getByLabelText("Ks2 suggested filter")).toBeInTheDocument();
    expect(screen.getByLabelText("Ks3 suggested filter")).toBeInTheDocument();
    expect(screen.getByLabelText("Ks4 suggested filter")).toBeInTheDocument();
    expect(screen.getByLabelText("Aqa suggested filter")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Edexcel suggested filter"),
    ).toBeInTheDocument();
  });

  it("sets checked state based on query", () => {
    const query: SearchQuery = {
      term: "",
      subjects: ["maths"],
      keyStages: ["ks2"],
      examBoards: ["aqa"],
    };
    const { setQuery } = createSetQuery(query);

    renderWithTheme(
      <SuggestedFilters
        setQuery={setQuery}
        query={query}
        searchFilters={convertSearchIntentToFilters(MOCK_INTENT)}
      />,
    );

    expect(
      screen.getByRole("checkbox", { name: /Maths suggested filter/i }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: /Ks2 suggested filter/i }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: /Aqa suggested filter/i }),
    ).toBeChecked();

    expect(
      screen.getByRole("checkbox", { name: /Ks1 suggested filter/i }),
    ).not.toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: /Edexcel suggested filter/i }),
    ).not.toBeChecked();
  });

  it("toggles subject filter via setQuery", async () => {
    const initial: SearchQuery = { term: "", subjects: [] };
    const { setQuery, getCurrent } = createSetQuery(initial);
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithTheme(
      <SuggestedFilters
        setQuery={setQuery}
        query={initial}
        searchFilters={convertSearchIntentToFilters(MOCK_INTENT)}
      />,
    );

    const maths = screen.getByRole("checkbox", {
      name: /Maths suggested filter/i,
    });
    await user.click(maths);
    expect(getCurrent().subjects).toEqual(["maths"]);

    await user.click(maths);
    expect(getCurrent().subjects).toEqual([]);
  });

  it("toggles key-stage filter via setQuery", async () => {
    const initial: SearchQuery = { term: "", keyStages: [] };
    const { setQuery, getCurrent } = createSetQuery(initial);
    const user = userEvent.setup({ pointerEventsCheck: 0 });

    renderWithTheme(
      <SuggestedFilters
        setQuery={setQuery}
        query={initial}
        searchFilters={convertSearchIntentToFilters(MOCK_INTENT)}
      />,
    );

    const ks1 = screen.getByRole("checkbox", { name: /Ks1 suggested filter/i });
    await user.click(ks1);
    expect(getCurrent().keyStages).toEqual(["ks1"]);

    await user.click(ks1);
    expect(getCurrent().keyStages).toEqual([]);
  });

  it("toggles year filter via setQuery", async () => {
    const intent: SearchIntent = {
      directMatch: null,
      suggestedFilters: [{ type: "year", slug: "year-1", title: "Year-1" }],
    };
    const initial: SearchQuery = { term: "", yearGroups: [] };
    const { setQuery, getCurrent } = createSetQuery(initial);
    const user = userEvent.setup({ pointerEventsCheck: 0 });

    renderWithTheme(
      <SuggestedFilters
        setQuery={setQuery}
        query={initial}
        searchFilters={convertSearchIntentToFilters(intent)}
      />,
    );

    const year1 = screen.getByRole("checkbox", {
      name: /Year-1 suggested filter/i,
    });
    await user.click(year1);
    expect(getCurrent().yearGroups).toEqual(["year-1"]);

    await user.click(year1);
    expect(getCurrent().yearGroups).toEqual([]);
  });
  it(" Does not render if no searchFilters are provided", () => {
    const query: SearchQuery = {
      term: "",
      subjects: [],
      keyStages: [],
      examBoards: [],
    };
    const { setQuery } = createSetQuery(query);

    renderWithTheme(
      <SuggestedFilters setQuery={setQuery} query={query} searchFilters={[]} />,
    );

    expect(screen.queryByText("Suggested filters")).not.toBeInTheDocument();
  });
});
