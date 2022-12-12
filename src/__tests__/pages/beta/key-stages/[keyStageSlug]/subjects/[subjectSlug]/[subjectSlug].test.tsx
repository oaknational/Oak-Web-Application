import { screen, waitFor } from "@testing-library/react";

import teachersKeyStageSubjectTiersFixture from "../../../../../../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjectTiers.fixture";
import SubjectListingPage from "../../../../../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]";
import renderWithProviders from "../../../../../../__helpers__/renderWithProviders";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("pages/teachers/key-stages/[keyStageSlug]/subjects/", () => {
  it("Renders title ", () => {
    renderWithProviders(
      <SubjectListingPage
        curriculumData={teachersKeyStageSubjectTiersFixture()}
      />
    );

    waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Tiers page"
      );
    });
  });
});
