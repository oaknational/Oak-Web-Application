import { canonicalLessonRedirectQuery } from "./canonicalLessonRedirect.query";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("pupilLesson()", () => {
  it("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await canonicalLessonRedirectQuery({
        ...sdk,
        canonicalLessonRedirect: jest.fn(() =>
          Promise.resolve({
            canonicalLessonRedirectData: [],
          }),
        ),
      })({
        incomingPath: "lessons/lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  it("returns the redirect if found", async () => {
    const redirect = await canonicalLessonRedirectQuery({
      ...sdk,
      canonicalLessonRedirect: jest.fn(() =>
        Promise.resolve({
          canonicalLessonRedirectData: [
            {
              incoming_path: "lessons/lesson-slug",
              outgoing_path: "lessons/new-lesson-slug",
              redirect_type: "301",
            },
          ],
        }),
      ),
    })({
      incomingPath: "lessons/lesson-slug",
    });

    expect(redirect).toEqual({
      canonicalLessonRedirectData: {
        incomingPath: "lessons/lesson-slug",
        outgoingPath: "lessons/new-lesson-slug",
        redirectType: "301",
      },
    });
  });
});
