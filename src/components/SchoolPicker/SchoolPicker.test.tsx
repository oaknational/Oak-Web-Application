import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { useState } from "react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import SchoolPicker from ".";

const items = [
  {
    urn: "101105",
    la: "Westminster",
    name: "Dorothy Gardner Nursery School",
    postcode: "W9 3JY",
    fullInfo: "101105, Westminster, Dorothy Gardner Nursery School, W9 3JY",
    status: "Open",
  },
  {
    urn: "101188",
    la: "Barking and Dagenham",
    name: "Dorothy Barley Infants' School",
    postcode: "RM8 2LL",
    fullInfo:
      "101188, Barking and Dagenham, Dorothy Barley Infants' School, RM8 2LL",
    status: "Open",
  },
  {
    urn: "108776",
    la: "Sunderland",
    name: "Dame Dorothy Primary School",
    postcode: "SR6 0EA",
    fullInfo: "108776, Sunderland, Dame Dorothy Primary School, SR6 0EA",
    status: "Open",
  },
  {
    urn: "114580",
    la: "Brighton and Hove",
    name: "Dorothy Stringer School",
    postcode: "BN1 6PZ",
    fullInfo: "114580, Brighton and Hove, Dorothy Stringer School, BN1 6PZ",
    status: "Open",
  },
  {
    urn: "138156",
    la: "Leicestershire",
    name: "Dorothy Goodman School Hinckley",
    postcode: "LE10 0EA",
    fullInfo:
      "138156, Leicestershire, Dorothy Goodman School Hinckley, LE10 0EA",
    status: "Open",
  },
  {
    urn: "140687",
    la: "Barking and Dagenham",
    name: "Dorothy Barley Junior Academy",
    postcode: "RM8 2NB",
    fullInfo:
      "140687, Barking and Dagenham, Dorothy Barley Junior Academy, RM8 2NB",
    status: "Open",
  },
];

const setFilterText = jest.fn();
const setInputValue = jest.fn();

jest.mock("./useSchoolPicker", () => {
  return jest.fn(() => {
    return {
      items: items,
      loadingState: "idle",
      error: null,
      FilterText: "Dorothy Stringer School",
      setFilterText,
    };
  });
});

describe("search autocomplete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders a SearchAutocomplete", () => {
    renderWithTheme(
      <SchoolPicker
        schools={[]}
        setInputValue={setInputValue}
        inputValue={"Dor"}
        label={"School picker"}
      />
    );

    const searchAutoComplete = screen.getByTestId("search-autocomplete-input");

    expect(searchAutoComplete).toBeInTheDocument();
  });

  it("renders a input with search", async () => {
    const Wrapper = () => {
      const [inputValue, setInputValue] = useState("dor");
      return (
        <SchoolPicker
          schools={items}
          defaultSchools={items}
          setInputValue={setInputValue}
          inputValue={inputValue}
          label={"School picker"}
        />
      );
    };

    renderWithTheme(<Wrapper />);
    const input = screen.getByTestId("search-autocomplete-input");

    const user = userEvent.setup();

    await user.tab();
    await user.keyboard("{Backspace}");
    await userEvent.type(input, "Hello");
    await user.keyboard("{arrowdown}");
    expect(input).toHaveValue("Hello");
  });

  it("renders a label", async () => {
    const Wrapper = () => {
      const [inputValue, setInputValue] = useState("");
      return (
        <SchoolPicker
          schools={items}
          defaultSchools={items}
          setInputValue={setInputValue}
          inputValue={inputValue}
          label={"School picker"}
        />
      );
    };

    const { getByText } = renderWithTheme(<Wrapper />);

    expect(getByText("School picker")).toBeInTheDocument();
  });

  it("renders a listbox of items", async () => {
    const Wrapper = () => {
      const [inputValue, setInputValue] = useState("dorothy");
      return (
        <SchoolPicker
          schools={items}
          defaultSchools={items}
          setInputValue={setInputValue}
          inputValue={inputValue}
          label={"School picker"}
        />
      );
    };

    const { getByText } = renderWithTheme(<Wrapper />);

    const user = userEvent.setup();

    await user.tab();
    await user.keyboard("{arrowdown}");

    expect(
      getByText("Dorothy Gardner Nursery School, Westminster")
    ).toBeInTheDocument();
  });

  it("allows an item to be selected from list ", async () => {
    const Wrapper = () => {
      const [inputValue, setInputValue] = useState("bal");
      return (
        <SchoolPicker
          schools={items}
          defaultSchools={items}
          setInputValue={setInputValue}
          inputValue={inputValue}
          label={"School picker"}
        />
      );
    };

    renderWithTheme(<Wrapper />);
    const input = screen.getByTestId("search-autocomplete-input");

    const user = userEvent.setup();

    await user.tab();
    await user.keyboard("{Backspace}");
    await userEvent.type(input, "Dorothy");
    await user.keyboard("{arrowdown}");
    await user.keyboard("{arrowdown}");
    await user.keyboard("{arrowdown}");
    await user.keyboard("{Enter}");
    expect(input).toHaveValue(
      "Dame Dorothy Primary School, Sunderland, SR6 0EA"
    );
  });
});
