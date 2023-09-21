import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";
import waitForNextTick from "../../__tests__/__helpers__/waitForNextTick";
import { Heading } from "../Typography";

import CollapsibleSection from "./CollapsibleSection";

describe("CollapsibleSection", () => {
  it("renders a CollapsibleSection", () => {
    renderWithTheme(
      <CollapsibleSection
        title={"Slide deck"}
        headingTag={"h2"}
        startOpen={false}
        buttons={[
          {
            icon: "download",
            onClick: jest.fn(),
            ariaLabel: "Download button",
          },
          {
            icon: "share",
            onClick: jest.fn(),
            ariaLabel: "Share button",
          },
        ]}
      />,
    );

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading).toHaveTextContent("Slide deck");
  });

  it("Opens section on click of button", async () => {
    renderWithTheme(
      <CollapsibleSection
        title={"Slide deck"}
        headingTag={"h2"}
        startOpen={false}
      >
        <Heading $font={"heading-6"} tag={"h2"}>
          Use Oak in Beta
        </Heading>
      </CollapsibleSection>,
    );

    const user = userEvent.setup();
    await user.keyboard("{tab}");
    await user.keyboard("{Enter}");

    await waitForNextTick();

    const label = screen.getByText("Use Oak in Beta");

    expect(label).toBeInTheDocument();
  });

  it("has passed in buttons with onClick event", async () => {
    const handleClick = jest.fn();

    renderWithTheme(
      <CollapsibleSection
        title={"Slide deck"}
        headingTag={"h2"}
        startOpen={false}
        buttons={[
          {
            icon: "download",
            onClick: handleClick,
            ariaLabel: "Download button",
          },
        ]}
      >
        <Heading $font={"heading-6"} tag={"h2"}>
          Use Oak in Beta
        </Heading>
      </CollapsibleSection>,
    );

    fireEvent.click(screen.getByTitle(/Download button/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
