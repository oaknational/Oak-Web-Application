import sdk from "../../sdk";

import specialistSubjectListingQuery from "./specialistSubjectListing.query";

describe("specialist subject listing", () => {
  test("it runs", async () => {
    const res = await specialistSubjectListingQuery({
      ...sdk,
    })();

    expect(res).toBeDefined();
  });
  test("it returns therapies and specialist subjects", async () => {
    const res = await specialistSubjectListingQuery({
      ...sdk,
    })();

    expect(res.therapies).toBeDefined();
    expect(res.specialist).toBeDefined();
  });
  test("it returns unique lists of therapies and specialist subjects", async () => {
    const res = await specialistSubjectListingQuery({
      ...sdk,
    })();

    const therapies = res.therapies.map((t) => t.subjectSlug);
    const specialist = res.specialist.map((s) => s.subjectSlug);

    therapies.forEach((t, i) => {
      expect(therapies.indexOf(t)).toBe(i);
    });
    specialist.forEach((s, i) => {
      expect(specialist.indexOf(s)).toBe(i);
    });
  });
});
