import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";
import { Heading } from "../Typography";

import CollapsibleSection from "./CollapsibleSection";

describe("CollapsibleSection", () => {
  it("renders a CollapsibleSection", () => {
    renderWithProviders(
      <CollapsibleSection
        title={"Presentation"}
        headingTag={"h2"}
        startOpen={false}
        buttons={[
          {
            icon: "Download",
            onClick: jest.fn(),
            ariaLabel: "Download button",
          },
          {
            icon: "Share",
            onClick: jest.fn(),
            ariaLabel: "Share button",
          },
        ]}
      />
    );

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading).toHaveTextContent("Presentation");
  });

  it("Opens section on click of button", async () => {
    renderWithProviders(
      <CollapsibleSection
        title={"Presentation"}
        headingTag={"h2"}
        startOpen={false}
      >
        <Heading fontSize={20} tag={"h2"}>
          Use Oak in Beta
        </Heading>
      </CollapsibleSection>
    );

    const user = userEvent.setup();
    await user.keyboard("{tab}");
    await user.keyboard("{Enter}");

    const label = screen.getByText("Use Oak in Beta");

    expect(label).toBeInTheDocument();
  });

  it("has passed in buttons with onClick event", async () => {
    const handleClick = jest.fn();

    renderWithProviders(
      <CollapsibleSection
        title={"Presentation"}
        headingTag={"h2"}
        startOpen={false}
        buttons={[
          {
            icon: "Download",
            onClick: handleClick,
            ariaLabel: "Download button",
          },
        ]}
      >
        <Heading fontSize={20} tag={"h2"}>
          Use Oak in Beta
        </Heading>
      </CollapsibleSection>
    );

    fireEvent.click(screen.getByTitle(/Download button/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
