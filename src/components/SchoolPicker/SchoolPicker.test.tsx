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

const setSchoolPickerInputValue = jest.fn();
const setSelectedSchool = jest.fn();

describe("search autocomplete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders a SearchAutocomplete", () => {
    renderWithTheme(
      <SchoolPicker
        hasError={false}
        schools={[]}
        setSchoolPickerInputValue={setSchoolPickerInputValue}
        schoolPickerInputValue={"Dor"}
        label={"School picker"}
        setSelectedSchool={setSelectedSchool}
      />
    );

    const searchAutoComplete = screen.getByTestId("search-autocomplete-input");

    expect(searchAutoComplete).toBeInTheDocument();
  });

  it("renders a input with search", async () => {
    const Wrapper = () => {
      const [schoolPickerInputValue, setSchoolPickerInputValue] =
        useState("dor");
      const [, setSelectedSchool] = useState<Key | undefined>("");
      return (
        <SchoolPicker
          hasError={false}
          schools={items}
          defaultSchools={items}
          setSchoolPickerInputValue={setSchoolPickerInputValue}
          schoolPickerInputValue={schoolPickerInputValue}
          label={"School picker"}
          setSelectedSchool={setSelectedSchool}
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
      const [schoolPickerInputValue, setSchoolPickerInputValue] = useState("");
      const [, setSelectedSchool] = useState<Key | undefined>("");
      return (
        <SchoolPicker
          hasError={false}
          schools={items}
          defaultSchools={items}
          setSchoolPickerInputValue={setSchoolPickerInputValue}
          schoolPickerInputValue={schoolPickerInputValue}
          label={"School picker"}
          setSelectedSchool={setSelectedSchool}
        />
      );
    };

    const { getByText } = renderWithTheme(<Wrapper />);

    expect(getByText("School picker")).toBeInTheDocument();
  });

  it("renders a label with red background if validation hasError", async () => {
    const Wrapper = () => {
      const [schoolPickerInputValue, setSchoolPickerInputValue] = useState("");
      const [, setSelectedSchool] = useState<Key | undefined>("");
      return (
        <SchoolPicker
          hasError={true}
          schools={items}
          defaultSchools={items}
          setSchoolPickerInputValue={setSchoolPickerInputValue}
          schoolPickerInputValue={schoolPickerInputValue}
          label={"School picker"}
          setSelectedSchool={setSelectedSchool}
        />
      );
    };

    const { getByText } = renderWithTheme(<Wrapper />);

    expect(getByText("School picker")).toHaveStyle(
      `background: rgb(229, 29, 77) `
    );
  });

  it("renders a label with '*' if required prop is passed", async () => {
    const Wrapper = () => {
      const [schoolPickerInputValue, setSchoolPickerInputValue] = useState("");
      const [, setSelectedSchool] = useState<Key | undefined>("");
      return (
        <SchoolPicker
          hasError={true}
          schools={items}
          defaultSchools={items}
          setSchoolPickerInputValue={setSchoolPickerInputValue}
          schoolPickerInputValue={schoolPickerInputValue}
          label={"School picker"}
          setSelectedSchool={setSelectedSchool}
          required={true}
        />
      );
    };

    const { getByText } = renderWithTheme(<Wrapper />);

    expect(getByText("School picker *")).toBeInTheDocument();
  });

  it("renders a listbox of items", async () => {
    const Wrapper = () => {
      const [schoolPickerInputValue, setSchoolPickerInputValue] =
        useState("dorothy");
      const [, setSelectedSchool] = useState<Key | undefined>("");
      return (
        <SchoolPicker
          hasError={false}
          schools={items}
          defaultSchools={items}
          setSchoolPickerInputValue={setSchoolPickerInputValue}
          schoolPickerInputValue={schoolPickerInputValue}
          label={"School picker"}
          setSelectedSchool={setSelectedSchool}
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
      const [schoolPickerInputValue, setSchoolPickerInputValue] =
        useState("bal");
      const [, setSelectedSchool] = useState<Key | undefined>("");
      return (
        <SchoolPicker
          hasError={false}
          schools={items}
          defaultSchools={items}
          setSchoolPickerInputValue={setSchoolPickerInputValue}
          schoolPickerInputValue={schoolPickerInputValue}
          label={"School picker"}
          setSelectedSchool={setSelectedSchool}
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
