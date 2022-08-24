import { screen, waitFor } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import SummaryCard from "./SummaryCard";

describe("CardLinkIcon", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(
      <SummaryCard
        title={"title"}
        heading={"heading"}
        summary={"text"}
        imageMinWidth={140}
        textMaxWidth={140}
        cardImageProps={{
          imageSrc: "/images/illustrations/planning.svg",
          alt: "planning illustration",
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "title"
      );
    });
  });
});
