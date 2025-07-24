import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { Key, useState } from "react";

import SchoolPicker from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const schools = [
  {
    urn: "101105",
    la: "Westminster",
    name: "Dorothy Bricks Nursery School",
    postcode: "AB1 1CD",
  },
  {
    urn: "101188",
    la: "Barking and Dagenham",
    name: "Dorothy Woodland Infants' School",
    postcode: "AB1 2CD",
  },
  {
    urn: "108776",
    la: "Sunderland",
    name: "Dorothy Meadows Primary School",
    postcode: "AB1 3CD",
  },
  {
    urn: "114580",
    la: "Brighton and Hove",
    name: "Dorothy Fields School",
    postcode: "AB1 4CD",
  },
  {
    urn: "138156",
    la: "Leicestershire",
    name: "Dorothy Hillside School",
    postcode: "AB1 5CD",
  },
  {
    urn: "140687",
    la: "Barking and Dagenham",
    name: "Dorothy New Junior Academy",
    postcode: "AB1 6CD",
  },
];

const setSchoolPickerInputValue = jest.fn();
const setSelectedSchool = jest.fn();

describe("search autocomplete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders a SearchCombobox input", () => {
    renderWithTheme(
      <SchoolPicker
        hasError={false}
        schools={[]}
        setSchoolPickerInputValue={setSchoolPickerInputValue}
        schoolPickerInputValue={"Dor"}
        label={"School picker"}
        setSelectedSchool={setSelectedSchool}
        withHomeschool={true}
      />,
    );

    const searchAutoComplete = screen.getByTestId("search-combobox-input");

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
          schools={schools}
          defaultSchools={schools}
          setSchoolPickerInputValue={setSchoolPickerInputValue}
          schoolPickerInputValue={schoolPickerInputValue}
          label={"School picker"}
          setSelectedSchool={setSelectedSchool}
          withHomeschool={true}
        />
      );
    };

    renderWithTheme(<Wrapper />);
    const input = screen.getByTestId("search-combobox-input");

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
          schools={schools}
          defaultSchools={schools}
          setSchoolPickerInputValue={setSchoolPickerInputValue}
          schoolPickerInputValue={schoolPickerInputValue}
          label={"School picker"}
          setSelectedSchool={setSelectedSchool}
          withHomeschool={true}
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
          schools={schools}
          defaultSchools={schools}
          setSchoolPickerInputValue={setSchoolPickerInputValue}
          schoolPickerInputValue={schoolPickerInputValue}
          label={"School picker"}
          setSelectedSchool={setSelectedSchool}
          withHomeschool={true}
        />
      );
    };

    const { getByText } = renderWithTheme(<Wrapper />);

    expect(getByText("School picker")).toHaveStyle(
      `background: rgb(221, 0, 53) `,
    );
  });

  it("renders a label with '(required)' if required prop is passed", async () => {
    const Wrapper = () => {
      const [schoolPickerInputValue, setSchoolPickerInputValue] = useState("");
      const [, setSelectedSchool] = useState<Key | undefined>("");
      return (
        <SchoolPicker
          hasError={true}
          schools={schools}
          defaultSchools={schools}
          setSchoolPickerInputValue={setSchoolPickerInputValue}
          schoolPickerInputValue={schoolPickerInputValue}
          label={"School picker"}
          setSelectedSchool={setSelectedSchool}
          withHomeschool={true}
          required={true}
        />
      );
    };

    const { getByText } = renderWithTheme(<Wrapper />);

    expect(getByText("School picker (required)")).toBeInTheDocument();
  });

  it("renders a listbox of schools", async () => {
    const Wrapper = () => {
      const [schoolPickerInputValue, setSchoolPickerInputValue] =
        useState("dorothy");
      const [, setSelectedSchool] = useState<Key | undefined>("");
      return (
        <SchoolPicker
          hasError={false}
          schools={schools}
          defaultSchools={schools}
          setSchoolPickerInputValue={setSchoolPickerInputValue}
          schoolPickerInputValue={schoolPickerInputValue}
          label={"School picker"}
          setSelectedSchool={setSelectedSchool}
          withHomeschool={true}
        />
      );
    };

    const { getByText } = renderWithTheme(<Wrapper />);

    const user = userEvent.setup();

    await user.tab();
    await user.keyboard("{arrowdown}");
    expect(
      getByText("Bricks Nursery School, Westminster, AB1 1CD"),
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
          schools={schools}
          defaultSchools={schools}
          setSchoolPickerInputValue={setSchoolPickerInputValue}
          schoolPickerInputValue={schoolPickerInputValue}
          label={"School picker"}
          setSelectedSchool={setSelectedSchool}
          withHomeschool={true}
        />
      );
    };

    renderWithTheme(<Wrapper />);
    const input = screen.getByTestId("search-combobox-input");

    const user = userEvent.setup();

    await user.tab();
    await user.keyboard("{Backspace}");
    await userEvent.type(input, "Meadows");
    await user.keyboard("{arrowdown}");
    await user.keyboard("{arrowdown}");
    await user.keyboard("{arrowdown}");
    await user.keyboard("{Enter}");
    expect(input).toHaveValue(
      "Dorothy Meadows Primary School, Sunderland, AB1 3CD",
    );
  });
});
