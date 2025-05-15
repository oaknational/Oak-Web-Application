import { createUnit } from "@/fixtures/curriculum/unit";
import { createThread } from "@/fixtures/curriculum/thread";
import { createLesson } from "@/fixtures/curriculum/lesson";

export const basicUnit = createUnit({
  threads: [
    createThread({ slug: "test-thread" }),
    createThread({ slug: "another-test-thread" }),
  ],
  lessons: [
    createLesson({ slug: "test-lesson" }),
    createLesson({ slug: "another-test-lesson" }),
  ],
  connection_prior_unit_description: "test prior unit description",
  connection_future_unit_description: "test future unit description",
  connection_prior_unit_title: "test prior unit title",
  connection_future_unit_title: "test future unit title",
  cycle: "1",
  why_this_why_now: "test why this why now",
  description: "test description",
});
