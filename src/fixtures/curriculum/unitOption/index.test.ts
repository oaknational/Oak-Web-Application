import { createUnitOption } from ".";

describe("createUnitOption", () => {
  it("basic", () => {
    const result = createUnitOption();

    expect(result).toEqual({
      unitvariant_id: 1,
      connection_prior_unit_description: null,
      connection_future_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      slug: "test",
      title: "Test",
      lessons: [],
      description: null,
      why_this_why_now: null,
      state: "published",
    });
  });

  it("with overrides", () => {
    const result = createUnitOption({
      slug: "plain-transfiguration",
      title: "Plain Transfiguration",
    });

    expect(result).toEqual({
      unitvariant_id: 1,
      connection_prior_unit_description: null,
      connection_future_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      slug: "plain-transfiguration",
      title: "Plain Transfiguration",
      lessons: [],
      description: null,
      why_this_why_now: null,
      state: "published",
    });
  });

  it("with only slug override", () => {
    const result = createUnitOption({
      slug: "plain-transfiguration",
    });

    expect(result).toEqual({
      unitvariant_id: 1,
      connection_prior_unit_description: null,
      connection_future_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      slug: "plain-transfiguration",
      title: "Plain transfiguration",
      lessons: [],
      description: null,
      why_this_why_now: null,
      state: "published",
    });
  });
});
