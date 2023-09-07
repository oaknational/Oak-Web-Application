import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import DetailsCompleted from ".";

describe("DetailsCompleted", () => {
  it("renders DetailsCompleted component", async () => {
    const spy = jest.fn();

    const { getByText } = renderWithTheme(
      <DetailsCompleted
        email={"test@test.com"}
        school={"sample school"}
        onEditClick={() => spy()}
      />,
    );

    const email = getByText("email: test@test.com");
    expect(email).toBeInTheDocument();

    const school = getByText("school: sample school");
    expect(school).toBeInTheDocument();

    const detailsComplete = getByText("Details complete");
    expect(detailsComplete).toBeInTheDocument();

    const detailsSaved = getByText("We have your details saved already.");
    expect(detailsSaved).toBeInTheDocument();
  });

  it("does not render email if not passed", async () => {
    const spy = jest.fn();

    const { queryByTestId } = renderWithTheme(
      <DetailsCompleted school={"sample school"} onEditClick={() => spy()} />,
    );

    const email = queryByTestId("email");
    expect(email).toBeNull();
  });

  it("does not render school if not passed", async () => {
    const spy = jest.fn();

    const { queryByTestId } = renderWithTheme(
      <DetailsCompleted email={"test@test.com"} onEditClick={() => spy()} />,
    );

    const school = queryByTestId("school");
    expect(school).toBeNull();
  });

  it("calls correct function on Edit button click", async () => {
    const spy = jest.fn();

    const { getByText } = renderWithTheme(
      <DetailsCompleted
        email={"test@test.com"}
        school={"sample school"}
        onEditClick={() => spy()}
      />,
    );

    const button = getByText("Edit");
    const user = userEvent.setup();

    await user.click(button);
    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("renders correct message dependent on input", () => {
    it("should render homeschool message when user selects homeschool option", () => {
      const spy = jest.fn();

      const { getByText } = renderWithTheme(
        <DetailsCompleted
          email={"test@test.com"}
          school={"homeschool"}
          onEditClick={() => spy()}
        />,
      );

      const email = getByText("email: test@test.com");
      expect(email).toBeInTheDocument();

      const school = getByText("school: Homeschool");
      expect(school).toBeInTheDocument();
    });

    it("should render not listed message when users school is not listed", () => {
      const spy = jest.fn();

      const { getByText } = renderWithTheme(
        <DetailsCompleted
          email={"test@test.com"}
          school={"notListed"}
          onEditClick={() => spy()}
        />,
      );

      const email = getByText("email: test@test.com");
      expect(email).toBeInTheDocument();

      const school = getByText("school: My school isn’t listed");
      expect(school).toBeInTheDocument();
    });
  });
});
