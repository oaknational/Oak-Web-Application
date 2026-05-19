export const shouldInitIntroWorksheetResult = ({
  worksheetAvailable,
  currentSection,
}: {
  worksheetAvailable: boolean | undefined;
  currentSection: string;
}) => worksheetAvailable === undefined && currentSection === "intro";
