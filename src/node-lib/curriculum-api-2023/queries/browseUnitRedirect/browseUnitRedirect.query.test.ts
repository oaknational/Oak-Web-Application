import { browseUnitRedirectQuery } from "./browseUnitRedirect.query";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("pupilLesson()", () => {
  it("throws a not found error if no unit is found", async () => {
    await expect(async () => {
      await browseUnitRedirectQuery({
        ...sdk,
        browseUnitRedirect: jest.fn(() =>
          Promise.resolve({
            browseUnitRedirectData: [],
          }),
        ),
      })({
        incomingPath: "programmes/programmeSlug/units/unitSlug/lessons",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  it("returns the redirect if found", async () => {
    const redirect = await browseUnitRedirectQuery({
      ...sdk,
      browseUnitRedirect: jest.fn(() =>
        Promise.resolve({
          browseUnitRedirectData: [
            {
              incoming_path: "programmes/programmeSlug/units/unitSlug/lessons",
              outgoing_path: "programmes/programmeSlug/units/unitSlug1/lessons",
              redirect_type: 301,
            },
          ],
        }),
      ),
    })({
      incomingPath: "lessons/lesson-slug",
    });

    expect(redirect).toEqual({
      browseUnitRedirectData: {
        incomingPath: "programmes/programmeSlug/units/unitSlug/lessons",
        outgoingPath: "programmes/programmeSlug/units/unitSlug1/lessons",
        redirectType: 301,
      },
    });
  });
});
