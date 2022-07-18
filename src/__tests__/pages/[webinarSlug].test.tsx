import { screen, waitFor } from "@testing-library/react";

import WebinarDetailPage from "../../pages/webinars/[webinarSlug]";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("webinarDetailPage", () => {
  it("Renders title from props ", async () => {
    renderWithProviders(
      <WebinarDetailPage
        webinar={{
          title: "An upcoming webinar",
          id: "5",
          date: new Date().toISOString(),
          slug: "an-upcoming-webinar",
          hosts: [],
          summaryPortableText: [],
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "An upcoming webinar"
      );
    });
  });
});
