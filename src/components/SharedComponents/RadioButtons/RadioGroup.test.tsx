import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Radio from "./Radio";
import RadioGroup from "./RadioGroup";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("RadioGroup", () => {
  it("renders a RadioGroup", () => {
    renderWithTheme(
      <RadioGroup label="Select one of the following:">
        <Radio value="home">Home schooled</Radio>
        <Radio value="notListed">My school isn't listed</Radio>
      </RadioGroup>,
    );

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toBeInTheDocument();
  });

  it("renders a label", () => {
    renderWithTheme(
      <RadioGroup label="Select one of the following:">
        <Radio value="home">Home schooled</Radio>
        <Radio value="notListed">My school isn't listed</Radio>
      </RadioGroup>,
    );

    const label = screen.getByText("Select one of the following:");

    expect(label).toBeInTheDocument();
  });

  it("allows you to select a radio on click of label", async () => {
    let selected = null;

    const setSelected = (value: string) => {
      selected = value;
    };
    const { getByTestId, rerender } = renderWithTheme(
      <RadioGroup
        value={selected}
        onChange={setSelected}
        label="Select one of the following:"
      >
        <Radio data-testid={"radio-1"} value="home">
          Home schooled
        </Radio>
        <Radio data-testid={"radio-2"} value="notListed">
          My school isn't listed
        </Radio>
      </RadioGroup>,
    );

    const radio1 = getByTestId("radio-1");
    const radio2 = getByTestId("radio-2");

    await userEvent.click(radio1);

    rerender(
      <RadioGroup
        value={selected}
        onChange={setSelected}
        label="Select one of the following:"
      >
        <Radio data-testid={"radio-1"} value="home">
          Home schooled
        </Radio>
        <Radio data-testid={"radio-2"} value="notListed">
          My school isn't listed
        </Radio>
      </RadioGroup>,
    );

    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();
  });

  it("changes on keyboard input", async () => {
    let selected = null;

    const setSelected = (value: string) => {
      selected = value;
    };

    const { rerender, getByTestId } = renderWithTheme(
      <RadioGroup
        value={selected}
        onChange={setSelected}
        label="Select one of the following:"
      >
        <Radio data-testid={"radio-1"} value="home">
          Home schooled
        </Radio>
        <Radio data-testid={"radio-2"} value="notListed">
          My school isn't listed
        </Radio>
      </RadioGroup>,
    );

    const radio1 = getByTestId("radio-1");
    const radio2 = getByTestId("radio-2");

    const user = userEvent.setup();

    expect(radio1).not.toBeChecked();
    expect(radio2).not.toBeChecked();

    await user.tab();
    await user.keyboard("[ArrowDown]");
    await user.keyboard(" ");

    rerender(
      <RadioGroup
        value={selected}
        onChange={setSelected}
        label="Select one of the following:"
      >
        <Radio data-testid={"radio-1"} value="home">
          Home schooled
        </Radio>
        <Radio data-testid={"radio-2"} value="notListed">
          My school isn't listed
        </Radio>
      </RadioGroup>,
    );

    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();
  });
  it("can show an error validation message ", async () => {
    let selected = null;

    const setSelected = (value: string) => {
      selected = value;
    };

    const { getByText } = renderWithTheme(
      <RadioGroup
        value={selected}
        onChange={setSelected}
        label="Select one of the following:"
        hasError={true}
        errorMessage={"error"}
      >
        <Radio data-testid={"radio-1"} value="home">
          Home schooled
        </Radio>
        <Radio data-testid={"radio-2"} value="notListed">
          My school isn't listed
        </Radio>
      </RadioGroup>,
    );
    const label = getByText("error");

    expect(label).toBeInTheDocument();
  });
});
