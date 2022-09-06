import { screen, waitFor } from "@testing-library/react";

import { CurriculumPage } from "../../node-lib/cms";
import renderWithProviders from "../__helpers__/renderWithProviders";
import { mockSeo, portableTextFromString } from "../__helpers__/cms";
import Curriculum from "../../pages/develop-your-curriculum";

const testCurriculumPageData: CurriculumPage = {
  id: "01",
  title: "Curriculum title",
  heading: "Curriculum heading",
  summaryPortableText: portableTextFromString("Planning summary"),
  info: {
    bodyPortableText: portableTextFromString("block text"),
    title: "title",
    cta: {
      external: "/",
      label: "label",
      linkType: "external",
    },
  },
  gettingStarted: {
    bodyPortableText: portableTextFromString("block text"),
    title: "title",
    cta: {
      external: "/",
      label: "label",
      linkType: "external",
    },
  },
  elements: {
    title: "element title",
    posts: [
      {
        title: "blog title",
        post: {
          title: "post title",
          slug: {
            current: "/",
          },
        },
      },
    ],
  },
  ourApproach: {
    bodyPortableText: portableTextFromString("block text"),
    title: "title",
    cta: {
      external: "/",
      label: "label",
      linkType: "external",
    },
  },
  seo: mockSeo(),
};

describe("pages/curriculum.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(
      <Curriculum pageData={testCurriculumPageData} isPreviewMode={false} />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "Curriculum title"
      );
    });
  });
});
