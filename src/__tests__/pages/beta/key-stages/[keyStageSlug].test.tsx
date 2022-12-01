import { screen, waitFor } from "@testing-library/react";

import {
  subjectListData,
  unavailableSubjectListData,
} from "../../../../browser-lib/fixtures/subjectListing";
import KeyStageListPage, {
  KeyStageProps,
} from "../../../../pages/beta/key-stages/[keyStageSlug]";
import { mockSeoResult } from "../../../__helpers__/cms";
import renderWithProviders from "../../../__helpers__/renderWithProviders";
import renderWithSeo from "../../../__helpers__/renderWithSeo";

describe("pages/key-stages/[keyStageSlug].tsx", () => {
  it("Renders title from props ", async () => {
    renderWithProviders(
      <KeyStageListPage
        keyStageData={{
          url: "key-stage-1",
          subjectListData,
          unavailableSubjectListData,
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "key stage 1"
      );
    });
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(
        <KeyStageListPage
          keyStageData={{
            url: "key-stage-1",
            subjectListData,
            unavailableSubjectListData,
          }}
        />
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key stage | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Key stage by subject",
        ogTitle: "Key stage | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Key stage by subject",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should return the paths of all keystages", async () => {
      const { getStaticPaths } = await import(
        "../../../../pages/beta/key-stages/[keyStageSlug]"
      );

      const pathsResult = await getStaticPaths({});

      expect(pathsResult.paths).toEqual([
        { params: { keyStageSlug: "key-stage-1" } },
        { params: { keyStageSlug: "key-stage-2" } },
        { params: { keyStageSlug: "key-stage-3" } },
        { params: { keyStageSlug: "key-stage-4" } },
      ]);
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const { getStaticProps } = await import(
        "../../../../pages/beta/key-stages/[keyStageSlug]"
      );
      const propsResult = (await getStaticProps({
        params: { keyStageSlug: "key-stage-1" },
      })) as {
        props: KeyStageProps;
      };

      expect(propsResult.props.keyStageData.url).toEqual("key-stage-1");
    });
  });
});
