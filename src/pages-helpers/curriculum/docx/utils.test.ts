import { addQueryParamsToUrl, escapeXml } from "./utils";

describe("addQueryParamsToUrl", () => {
  it("should add query parms to base url", () => {
    const url =
      "https://www.thenational.academy/teachers/programmes/maths/ks3/units";
    const queryParams = {
      utm_source: "curriculum_plan",
      utm_medium: "document",
      utm_campaign: "maths_ks3_curriculum_plan",
    };
    const result = addQueryParamsToUrl(url, queryParams);
    expect(result).toBe(
      "https://www.thenational.academy/teachers/programmes/maths/ks3/units?utm_source=curriculum_plan&utm_medium=document&utm_campaign=maths_ks3_curriculum_plan",
    );
  });

  it("should not add query parms to base url with undefined query params", () => {
    const url =
      "https://www.thenational.academy/teachers/programmes/maths/ks3/units";
    const queryParams = undefined;
    const result = addQueryParamsToUrl(url, queryParams);
    expect(result).toBe(
      "https://www.thenational.academy/teachers/programmes/maths/ks3/units",
    );
  });
});

describe("escapeXml", () => {
  it("should escape XML characters within attribute values", () => {
    const unsafe = `<Relationship
        Id="$123"
        Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink"
        Target="https://www.thenational.academy/teachers/programmes/maths/ks3/units?utm_source=curriculum_plan&utm_medium=document&utm_campaign=maths_ks3_curriculum_plan"
        TargetMode="External"
      />`;
    const result = escapeXml(unsafe);
    expect(result).toBe(`&lt;Relationship
        Id=&quot;$123&quot;
        Type=&quot;http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink&quot;
        Target=&quot;https://www.thenational.academy/teachers/programmes/maths/ks3/units?utm_source=curriculum_plan&amp;utm_medium=document&amp;utm_campaign=maths_ks3_curriculum_plan&quot;
        TargetMode=&quot;External&quot;
      /&gt;`);
  });
});
