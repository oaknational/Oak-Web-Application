import { createThread } from "@/fixtures/curriculum/thread";
import { createUnit } from "@/fixtures/curriculum/unit";

const thread1 = createThread({ slug: "thread1" });
const thread2 = createThread({ slug: "thread2" });
const thread3 = createThread({ slug: "thread3" });

export const basicSetup = {
  yearData: {
    "10": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      threads: [thread1, thread2, thread3],
      isSwimming: false,
      nationalCurriculum: [],
      subjectCategories: [],
      units: [
        createUnit({
          year: "10",
          threads: [thread1],
        }),
        createUnit({
          year: "10",
          threads: [thread2],
        }),
        createUnit({
          year: "10",
          threads: [thread3],
        }),
      ],
    },
    "11": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      nationalCurriculum: [],
      subjectCategories: [],
      units: [createUnit({ year: "2", threads: [] })],
    },
  },
  threadOptions: [thread1, thread2, thread3],
  yearOptions: [],
};
