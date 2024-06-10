import { screen, waitFor } from "@testing-library/react";

import SubjectProgrammeList from "./SubjectProgrammeList";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import programmeListingFixture from "@/node-lib/curriculum-api-2023/fixtures/programmeListing.fixture";

describe("ProgrammeList", () => {
  it("Renders correct titles ", async () => {
    renderWithTheme(
      <SubjectProgrammeList
        onClick={() => {}}
        {...programmeListingFixture()}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByRole("paragraph")[0]?.textContent).toBe(
        "Foundation",
      );
      expect(screen.getAllByRole("paragraph")[1]?.textContent).toBe("Higher");
    });
  });
});
