import { pupilUnitRedirectQuery } from "./pupilUnitRedirect.query";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("pupilLesson()", () => {
  it("throws a not found error if no unit is found", async () => {
    await expect(async () => {
      await pupilUnitRedirectQuery({
        ...sdk,
        pupilUnitRedirect: jest.fn(() =>
          Promise.resolve({
            pupilUnitRedirectData: [],
          }),
        ),
      })({
        incomingPath: "programmes/programmeSlug/units/unitSlug/lessons",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  it("returns the redirect if found", async () => {
    const redirect = await pupilUnitRedirectQuery({
      ...sdk,
      pupilUnitRedirect: jest.fn(() =>
        Promise.resolve({
          pupilUnitRedirectData: [
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
      pupilUnitRedirectData: {
        incomingPath: "programmes/programmeSlug/units/unitSlug/lessons",
        outgoingPath: "programmes/programmeSlug/units/unitSlug1/lessons",
        redirectType: 301,
      },
    });
  });
});
