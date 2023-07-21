import { SubjectPhaseOptions } from "components/SubjectPhasePicker/SubjectPhasePicker";

const subjectPhaseOptions: SubjectPhaseOptions = {
  newSubjects: [
    { slug: "english", title: "English", displayOrder: 1 },
    { slug: "geography", title: "Geography", displayOrder: 1 },
    { slug: "history", title: "History", displayOrder: 1 },
    { slug: "maths", title: "Maths", displayOrder: 1 },
    { slug: "music", title: "Music", displayOrder: 1 },
    { slug: "science", title: "Science", displayOrder: 1 },
  ],
  legacySubjects: [
    { slug: "english", title: "English", displayOrder: 1 },
    { slug: "geography", title: "Geography", displayOrder: 1 },
    { slug: "history", title: "History", displayOrder: 1 },
    { slug: "maths", title: "Maths", displayOrder: 1 },
    { slug: "music", title: "Music", displayOrder: 1 },
    { slug: "science", title: "Science", displayOrder: 1 },
  ],
  phases: [
    { title: "Primary", slug: "primary", displayOrder: 1 },
    { title: "Secondary", slug: "secondary", displayOrder: 1 },
  ],
};

export default subjectPhaseOptions;
