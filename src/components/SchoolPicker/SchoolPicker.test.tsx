import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { Key, useState } from "react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import SchoolPicker from ".";

export const items = [
  {
    urn: "101105",
    la: "Westminster",
    name: "Dorothy Gardner Nursery School",
    postcode: "W9 3JY",
  },
  {
    urn: "101188",
    la: "Barking and Dagenham",
    name: "Dorothy Barley Infants' School",
    postcode: "RM8 2LL",
  },
  {
    urn: "108776",
    la: "Sunderland",
    name: "Dame Dorothy Primary School",
    postcode: "SR6 0EA",
  },
  {
    urn: "114580",
    la: "Brighton and Hove",
    name: "Dorothy Stringer School",
    postcode: "BN1 6PZ",
  },
  {
    urn: "138156",
    la: "Leicestershire",
    name: "Dorothy Goodman School Hinckley",
    postcode: "LE10 0EA",
  },
  {
    urn: "140687",
    la: "Barking and Dagenham",
    name: "Dorothy Barley Junior Academy",
    postcode: "RM8 2NB",
  },
];

const setFilterText = jest.fn();
const setInputValue = jest.fn();
const setSelectedValue = jest.fn();

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
        setSelectedValue={setSelectedValue}
      />
    );

    const searchAutoComplete = screen.getByTestId("search-autocomplete-input");

    expect(searchAutoComplete).toBeInTheDocument();
  });

  it("renders a input with search", async () => {
    const Wrapper = () => {
      const [inputValue, setInputValue] = useState("dor");
      const [, setSelectedValue] = useState<Key | undefined>("");
      return (
        <SchoolPicker
          schools={items}
          defaultSchools={items}
          setInputValue={setInputValue}
          inputValue={inputValue}
          label={"School picker"}
          setSelectedValue={setSelectedValue}
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
      const [, setSelectedValue] = useState<Key | undefined>("");
      return (
        <SchoolPicker
          schools={items}
          defaultSchools={items}
          setInputValue={setInputValue}
          inputValue={inputValue}
          label={"School picker"}
          setSelectedValue={setSelectedValue}
        />
      );
    };

    const { getByText } = renderWithTheme(<Wrapper />);

    expect(getByText("School picker")).toBeInTheDocument();
  });

  it("renders a listbox of items", async () => {
    const Wrapper = () => {
      const [inputValue, setInputValue] = useState("dorothy");
      const [, setSelectedValue] = useState<Key | undefined>("");
      return (
        <SchoolPicker
          schools={items}
          defaultSchools={items}
          setInputValue={setInputValue}
          inputValue={inputValue}
          label={"School picker"}
          setSelectedValue={setSelectedValue}
        />
      );
    };

    const { getByText } = renderWithTheme(<Wrapper />);

    const user = userEvent.setup();

    await user.tab();
    await user.keyboard("{arrowdown}");

    expect(
      getByText("Dorothy Gardner Nursery School, Westminster, W9 3JY")
    ).toBeInTheDocument();
  });

  it("allows an item to be selected from list ", async () => {
    const Wrapper = () => {
      const [inputValue, setInputValue] = useState("bal");
      const [, setSelectedValue] = useState<Key | undefined>("");
      return (
        <SchoolPicker
          schools={items}
          defaultSchools={items}
          setInputValue={setInputValue}
          inputValue={inputValue}
          label={"School picker"}
          setSelectedValue={setSelectedValue}
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
