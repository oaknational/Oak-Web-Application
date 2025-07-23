import { pupilBrowseLessonRedirectQuery } from "./pupilBrowseLessonRedirect.query";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("pupilLesson()", () => {
  it("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await pupilBrowseLessonRedirectQuery({
        ...sdk,
        pupilBrowseLessonRedirect: jest.fn(() =>
          Promise.resolve({
            pupilBrowseLessonRedirectData: [],
          }),
        ),
      })({
        incomingPath: "lessons/lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  it("returns the redirect if found", async () => {
    const redirect = await pupilBrowseLessonRedirectQuery({
      ...sdk,
      pupilBrowseLessonRedirect: jest.fn(() =>
        Promise.resolve({
          pupilBrowseLessonRedirectData: [
            {
              incoming_path: "lessons/lesson-slug",
              outgoing_path: "lessons/new-lesson-slug",
              redirect_type: 301,
            },
          ],
        }),
      ),
    })({
      incomingPath: "lessons/lesson-slug",
    });

    expect(redirect).toEqual({
      pupilBrowseLessonRedirectData: {
        incomingPath: "lessons/lesson-slug",
        outgoingPath: "lessons/new-lesson-slug",
        redirectType: 301,
      },
    });
  });
});
