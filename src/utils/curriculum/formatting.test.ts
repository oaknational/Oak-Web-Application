import {
  getYearGroupTitle,
  getPhaseText,
  getShortPhaseText,
  getSuffixFromFeatures,
} from "./formatting";

describe("getYearGroupTitle", () => {
  describe("no suffix", () => {
    it("support all-years", () => {
      expect(
        getYearGroupTitle(
          {
            ["all-years"]: {
              units: [],
              childSubjects: [],
              tiers: [],
              subjectCategories: [],
              isSwimming: true,
              groupAs: "Swimming",
            },
          },
          "All years",
        ),
      ).toEqual("Swimming (all years)");
    });

    it("support years", () => {
      expect(
        getYearGroupTitle(
          {
            ["7"]: {
              units: [],
              childSubjects: [],
              tiers: [],
              subjectCategories: [],
              isSwimming: false,
              groupAs: null,
            },
          },
          "7",
        ),
      ).toEqual("Year 7");
    });
  });

  describe("with suffix", () => {
    it("support all years", () => {
      expect(
        getYearGroupTitle(
          {
            ["All years"]: {
              units: [],
              childSubjects: [],
              tiers: [],
              subjectCategories: [],
              isSwimming: true,
              groupAs: "Swimming",
            },
          },
          "All years",
          "units",
        ),
      ).toEqual("Swimming units (all years)");
    });

    it("support years", () => {
      expect(
        getYearGroupTitle(
          {
            ["7"]: {
              units: [],
              childSubjects: [],
              tiers: [],
              subjectCategories: [],
              isSwimming: false,
              groupAs: null,
            },
          },
          "7",
          "units",
        ),
      ).toEqual("Year 7 units");
    });
  });
});

describe("getPhaseText", () => {
  it("ks1", () => {
    expect(getPhaseText({ slug: "primary" }, [{ slug: "ks1" }])).toEqual(
      "Key stage 1",
    );
    expect(getPhaseText({ slug: "secondary" }, [{ slug: "ks1" }])).toEqual("");
  });

  it("ks2", () => {
    expect(getPhaseText({ slug: "primary" }, [{ slug: "ks2" }])).toEqual(
      "Key stage 2",
    );
    expect(getPhaseText({ slug: "secondary" }, [{ slug: "ks2" }])).toEqual("");
  });

  it("ks1 & ks2", () => {
    expect(
      getPhaseText({ slug: "primary" }, [{ slug: "ks1" }, { slug: "ks2" }]),
    ).toEqual("Key stage 1 and 2");
    expect(
      getPhaseText({ slug: "secondary" }, [{ slug: "ks1" }, { slug: "ks2" }]),
    ).toEqual("");
  });

  it("ks3", () => {
    expect(getPhaseText({ slug: "primary" }, [{ slug: "ks3" }])).toEqual("");
    expect(getPhaseText({ slug: "secondary" }, [{ slug: "ks3" }])).toEqual(
      "Key stage 3",
    );
  });

  it("ks4", () => {
    expect(getPhaseText({ slug: "primary" }, [{ slug: "ks4" }])).toEqual("");
    expect(getPhaseText({ slug: "secondary" }, [{ slug: "ks4" }])).toEqual(
      "Key stage 4",
    );
  });

  it("ks3 & ks4", () => {
    expect(
      getPhaseText({ slug: "primary" }, [{ slug: "ks3" }, { slug: "ks4" }]),
    ).toEqual("");
    expect(
      getPhaseText({ slug: "secondary" }, [{ slug: "ks3" }, { slug: "ks4" }]),
    ).toEqual("Key stage 3 and 4");
  });

  it("missing", () => {
    expect(getPhaseText({ slug: "secondary" }, [])).toEqual("");
    expect(getPhaseText({ slug: "primary" }, [])).toEqual("");
  });
});

describe("getShortPhaseText", () => {
  it("ks1", () => {
    expect(getShortPhaseText({ slug: "primary" }, [{ slug: "ks1" }])).toEqual(
      "KS1",
    );
    expect(getShortPhaseText({ slug: "secondary" }, [{ slug: "ks1" }])).toEqual(
      "",
    );
  });

  it("ks2", () => {
    expect(getShortPhaseText({ slug: "primary" }, [{ slug: "ks2" }])).toEqual(
      "KS2",
    );
    expect(getShortPhaseText({ slug: "secondary" }, [{ slug: "ks2" }])).toEqual(
      "",
    );
  });

  it("ks1 & ks2", () => {
    expect(
      getShortPhaseText({ slug: "primary" }, [
        { slug: "ks1" },
        { slug: "ks2" },
      ]),
    ).toEqual("KS1 & KS2");
    expect(
      getShortPhaseText({ slug: "secondary" }, [
        { slug: "ks1" },
        { slug: "ks2" },
      ]),
    ).toEqual("");
  });

  it("ks3", () => {
    expect(getShortPhaseText({ slug: "primary" }, [{ slug: "ks3" }])).toEqual(
      "",
    );
    expect(getShortPhaseText({ slug: "secondary" }, [{ slug: "ks3" }])).toEqual(
      "KS3",
    );
  });

  it("ks4", () => {
    expect(getShortPhaseText({ slug: "primary" }, [{ slug: "ks4" }])).toEqual(
      "",
    );
    expect(getShortPhaseText({ slug: "secondary" }, [{ slug: "ks4" }])).toEqual(
      "KS4",
    );
  });

  it("ks3 & ks4", () => {
    expect(
      getShortPhaseText({ slug: "primary" }, [
        { slug: "ks3" },
        { slug: "ks4" },
      ]),
    ).toEqual("");
    expect(
      getShortPhaseText({ slug: "secondary" }, [
        { slug: "ks3" },
        { slug: "ks4" },
      ]),
    ).toEqual("KS3 & KS4");
  });

  it("missing", () => {
    expect(getShortPhaseText({ slug: "secondary" }, [])).toEqual("");
    expect(getShortPhaseText({ slug: "primary" }, [])).toEqual("");
  });
});

describe("getSuffixFromFeatures", () => {
  it("value if override present", () => {
    expect(
      getSuffixFromFeatures({
        programme_field_overrides: {
          subject: "test",
        },
      }),
    ).toBe("(test)");
  });

  it("undefined if override not present", () => {
    expect(getSuffixFromFeatures(undefined)).toBe(undefined);
  });
});
