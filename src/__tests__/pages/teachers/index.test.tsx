import { getStaticProps } from "@/pages/teachers/index";

describe("Teachers Page", () => {
  describe("getStaticProps", () => {
    it("Should redirect to home '/'", async () => {
      const result = await getStaticProps();

      expect(result).toEqual({
        redirect: {
          destination: "/",
        },
      });
    });
  });
});
