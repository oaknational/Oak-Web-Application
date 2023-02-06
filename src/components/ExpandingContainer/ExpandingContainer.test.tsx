import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";
import Card from "../Card";

import ExpandingContainer from ".";

const downloadLink = "/downloads";

it("component renders with the title", () => {
  const { getAllByRole } = renderWithTheme(
    <ExpandingContainer
      external={true}
      projectable={true}
      downloadable={true}
      downloadLink={downloadLink}
      title={"Video"}
    >
      <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
        Grid box
      </Card>
    </ExpandingContainer>
  );

  expect(getAllByRole("button")).toHaveLength(3);
  expect(getAllByRole("link")).toHaveLength(1);
});
it("component renders with the title only", () => {
  const { getAllByRole } = renderWithTheme(
    <ExpandingContainer
      external={false}
      projectable={false}
      downloadable={false}
      title={"Video"}
    >
      <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
        Grid box
      </Card>
    </ExpandingContainer>
  );

  expect(getAllByRole("button")).toHaveLength(1);
});
it("renders top right icons", async () => {
  const log1 = jest.spyOn(console, "log");
  const log2 = jest.spyOn(console, "log");
  const user = userEvent.setup();
  renderWithTheme(
    <ExpandingContainer
      external={true}
      projectable={true}
      downloadable={true}
      downloadLink={downloadLink}
      title={"Video"}
    >
      <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
        Grid box
      </Card>
    </ExpandingContainer>
  );

  const downloadLinkButton = screen.getByTestId("download-button");
  expect(downloadLinkButton).toHaveAttribute("href", downloadLink);

  const projectButton = screen.getByTestId("project-button");
  await user.click(projectButton);
  expect(log1).toHaveBeenCalled();

  const externalButton = screen.getByTestId("external-button");
  await user.click(externalButton);
  expect(log2).toHaveBeenCalled();
});
it("component expands and contract on click", async () => {
  const user = userEvent.setup();
  renderWithTheme(
    <ExpandingContainer
      external={true}
      projectable={true}
      downloadable={true}
      downloadLink={downloadLink}
      title={"Video"}
    >
      <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
        Grid box
      </Card>
    </ExpandingContainer>
  );

  const downloadButton = screen.getByTestId("expand-button");
  await user.click(downloadButton);
  expect(screen.getByTestId("expanded-container")).toHaveStyle(
    "max-height: 1600px"
  );
});
