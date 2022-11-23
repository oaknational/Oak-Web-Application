import { screen, waitFor } from "@testing-library/react";

import KeyStageListPage, {
  KeyStageProps,
} from "../../../../pages/beta/key-stages/[keyStageSlug]";
import renderWithProviders from "../../../__helpers__/renderWithProviders";
import renderWithSeo from "../../../__helpers__/renderWithSeo";

describe("pages/key-stages/[keyStageSlug].tsx", () => {
  describe("BlogDetailPage", () => {
    it("Renders title from props ", async () => {
      renderWithProviders(
        <KeyStageListPage
          keyStageData={{
            data: "key-stage-1",
          }}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
          "Key stage key-stage-1"
        );
      });
    });

    describe.skip("SEO", () => {
      it("renders the correct SEO details", async () => {
        const { seo } = renderWithSeo(
          <KeyStageListPage
            keyStageData={{
              data: "key-stage-1",
            }}
          />
        );

        expect(seo).toEqual({});
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

      expect(propsResult.props.keyStageData.data).toEqual("key-stage-1");
    });
  });
});
