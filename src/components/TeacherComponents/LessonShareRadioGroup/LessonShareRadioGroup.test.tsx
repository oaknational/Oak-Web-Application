import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import { ResourceFormValues } from "../types/downloadAndShare.types";

import LessonShareRadioGroup, {
  LessonShareRadioGroupProps,
} from "./LessonShareRadioGroup";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const defaultProps = {
  name: "hideYearGroup",
  title: "Hide year group when sharing?",
  description: "Choose whether pupils can see the year group.",
  icon: "class-grouping",
  options: [
    { value: "show", label: "Show year group" },
    { value: "hide", label: "Hide year group" },
  ],
} satisfies Omit<LessonShareRadioGroupProps, "control">;

const ComponentWrapper = (props: Partial<LessonShareRadioGroupProps>) => {
  const { control } = useForm<ResourceFormValues>();

  return (
    <LessonShareRadioGroup {...defaultProps} {...props} control={control} />
  );
};

describe("LessonShareRadioGroup", () => {
  it("renders the heading, description and radio group", () => {
    renderWithTheme(<ComponentWrapper />);

    expect(
      screen.getByRole("heading", {
        name: "Hide year group when sharing?",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Choose whether pupils can see the year group."),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("group", {
        name: "Hide year group when sharing?",
      }),
    ).toHaveLength(2);
    expect(
      screen.getByRole("radio", { name: "Show year group" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Hide year group" }),
    ).toBeInTheDocument();
  });

  it("links the fieldset to the heading", () => {
    renderWithTheme(<ComponentWrapper />);

    expect(
      screen.getByRole("heading", {
        name: "Hide year group when sharing?",
      }),
    ).toHaveAttribute("id", "hide-year-group-when-sharing");
    const groups = screen.getAllByRole("group", {
      name: "Hide year group when sharing?",
    });
    expect(
      groups.find(
        (group) =>
          group.getAttribute("aria-labelledby") ===
          "hide-year-group-when-sharing",
      ),
    ).toBeInTheDocument();
  });

  it("selects the first option by default", () => {
    renderWithTheme(<ComponentWrapper />);

    expect(
      screen.getByRole("radio", { name: "Show year group" }),
    ).toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Hide year group" }),
    ).not.toBeChecked();
  });

  it("supports a supplied default value", () => {
    renderWithTheme(<ComponentWrapper defaultValue="hide" />);

    expect(
      screen.getByRole("radio", { name: "Show year group" }),
    ).not.toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Hide year group" }),
    ).toBeChecked();
  });

  it("updates the selected option", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ComponentWrapper />);

    const hideYearGroup = screen.getByRole("radio", {
      name: "Hide year group",
    });
    await user.click(hideYearGroup);

    expect(hideYearGroup).toBeChecked();
  });
});
