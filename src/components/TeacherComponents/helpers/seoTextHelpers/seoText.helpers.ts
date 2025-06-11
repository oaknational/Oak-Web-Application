export const getPhase = (year: string) => {
  const match = year.match(/\d+/);
  const yearNumber = match ? Number(match[0]) : null;

  return yearNumber && yearNumber < 7 ? "primary" : "secondary";
};

export const formatSubjectName = (subject: string) => {
  const excludedSubjects = [
    "English",
    "French",
    "Spanish",
    "German",
    "RSHE (PSHE)",
  ];

  return excludedSubjects.includes(subject) ? subject : subject.toLowerCase();
};
