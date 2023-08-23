import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

const curriculumHeaderQuery =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (sdk: Sdk) => async (args: { slug: string }) => {
    const splitSlug = args.slug.split("-");
    if (splitSlug.length < 2) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    const [subjectSlug, phaseSlug, examBoardSlug] = splitSlug;

    if (!subjectSlug || !phaseSlug) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    const capitalise = (word: string) =>
      word.charAt(0).toUpperCase() + word.slice(1);
    const subject = {
      title: capitalise(subjectSlug),
      slug: subjectSlug,
    };
    const phase = {
      title: capitalise(phaseSlug),
      slug: phaseSlug,
    };
    const examBoard = {
      title: examBoardSlug ? capitalise(examBoardSlug) : "",
      slug: examBoardSlug ?? "",
    };

    if (Object.values(args).some((arg) => !arg.length)) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    return {
      subject,
      phase,
      examBoard,
    };
  };

export default curriculumHeaderQuery;
