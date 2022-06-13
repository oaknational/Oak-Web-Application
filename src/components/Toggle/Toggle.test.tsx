import { screen } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Toggle from "./Toggle";

describe("Toggle", () => {
  it("renders a Toggle", () => {
    renderWithProviders(
      <Toggle
        checked={true}
        labelOn="label"
        labelOff="label"
        onChange={() => console.log("on change")}
      />
    );

    const input = screen.getByRole("checkbox");

    expect(input).toBeInTheDocument();
  });

  it("renders a label", () => {
    renderWithProviders(
      <Toggle
        checked={true}
        labelOn="label on"
        labelOff="label"
        onChange={() => console.log("on change")}
      />
    );

    const label = screen.getByText("label on");

    expect(label).toBeInTheDocument();
  });

  // it("changes checkbox state on click ", async () => {
  //   let value = false;

  //   renderWithProviders(
  //     <Toggle
  //       checked={value}
  //       disabled={false}
  //       labelOn="label on"
  //       labelOff="label"
  //       onChange={() => (value = !value)}
  //     />
  //   );
  //   const input = screen.getByRole("checkbox");
  //   // const div = getByTestId(DIV_ID);
  //   expect(input).not.toBeChecked();
  //   // // expect(div.style["display"]).toEqual("none");
  //   userEvent.click(input);
  //   expect(input).toBeChecked();
  // expect(checkbox.checked).toEqual(true);
  // // expect(div.style["display"]).toEqual("block");
  // fireEvent.click(checkbox);
  // expect(checkbox.checked).toEqual(false);
  // // expect(div.style["display"]).toEqual("none");
});

// it("it can't be changed if disabled", async () => {
//   let value = false;

//   const toggleValue = () => {
//     value = !value;
//   };

//   const { rerender } = render(
//     <Toggle
//       id="unique-123"
//       labelText="Agree to terms"
//       checked={value}
//       onChange={() => toggleValue()}
//       disabled
//     />
//   );

//   const user = userEvent.setup();

//   const input = screen.getByRole("Toggle");
//   expect(input).not.toBeChecked();

//   await user.tab();
//   await user.keyboard(" ");

//   rerender(
//     <Toggle
//       id="unique-123"
//       labelText="Agree to terms"
//       checked={value}
//       onChange={() => toggleValue()}
//       disabled
//     />
//   );

//   expect(input).not.toBeChecked();
// });

// it("changes on keyboard input", async () => {
//   let value = false;

//   const toggleValue = () => {
//     value = !value;
//   };

//   const { rerender } = render(
//     <Toggle
//       id="unique-123"
//       labelText="Agree to terms"
//       checked={value}
//       onChange={() => toggleValue()}
//     />
//   );

//   const user = userEvent.setup();

//   const input = screen.getByRole("Toggle");
//   expect(input).not.toBeChecked();

//   await user.tab();
//   await user.keyboard(" ");

//   rerender(
//     <Toggle
//       id="unique-123"
//       labelText="Agree to terms"
//       checked={value}
//       onChange={() => toggleValue()}
//     />
//   );

//   expect(input).toBeChecked();
// });

// it("has a label associated with it", () => {
//   render(
//     <Toggle
//       id="unique-123"
//       checked
//       labelText="Agree to terms"
//       onChange={() => {
//         console.log("on change");
//       }}
//     />
//   );

//   const ToggleElement = screen.getByLabelText("Agree to terms");
//   expect(ToggleElement.tagName).toEqual("INPUT");
//   expect(ToggleElement.getAttribute("type")).toEqual("Toggle");
// });
// });
