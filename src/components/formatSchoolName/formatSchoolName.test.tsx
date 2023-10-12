import { formatSchoolName } from "./formatSchoolName";

describe("formatSchoolName", () => {
  it("should return the expected div with input value in bold", () => {
    expect(
      formatSchoolName(
        "Macaulay Church of England Primary School, Lambeth, SW4 0NU",
        "ima",
      ),
    ).toEqual(
      <div
        dangerouslySetInnerHTML={{
          __html:
            "Macaulay Church of England Pr<strong>ima</strong>ry School, Lambeth, SW4 0NU",
        }}
      />,
    );
  });
});
