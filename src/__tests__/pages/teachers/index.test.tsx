import { getServerSideProps } from "@/pages/teachers/index";

describe("Teachers Page", () => {
  describe("getServerSideProps", () => {
    it("Should redirect to home '/'", async () => {
      const result = await getServerSideProps();

      expect(result).toEqual({
        redirect: {
          destination: "/",
          statusCode: 301,
        },
      });
    });
  });
});
