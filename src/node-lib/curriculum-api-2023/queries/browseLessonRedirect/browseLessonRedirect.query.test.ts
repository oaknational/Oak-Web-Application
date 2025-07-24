import { browseLessonRedirectQuery } from "./browseLessonRedirect.query";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("pupilLesson()", () => {
  it("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await browseLessonRedirectQuery({
        ...sdk,
        browseLessonRedirect: jest.fn(() =>
          Promise.resolve({
            redirectData: [],
          }),
        ),
      })({
        incomingPath: "lessons/lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  it("returns the redirect if found", async () => {
    const redirect = await browseLessonRedirectQuery({
      ...sdk,
      browseLessonRedirect: jest.fn(() =>
        Promise.resolve({
          redirectData: [
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
      redirectData: {
        incomingPath: "lessons/lesson-slug",
        outgoingPath: "lessons/new-lesson-slug",
        redirectType: 301,
      },
    });
  });
});
