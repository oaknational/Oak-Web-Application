import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

const curriculumHeaderQuery =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (sdk: Sdk) => async (args: { slug: string }) => {
    const splitSlug = args.slug.split("-");
    if (splitSlug.length < 2) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    const [subjectSlug, phaseSlug, ks4OptionSlug] = splitSlug;

    if (!subjectSlug || !phaseSlug) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    const capitalise = (word: string) =>
      word.charAt(0).toUpperCase() + word.slice(1);
    const subject = capitalise(subjectSlug);

    const phase = capitalise(phaseSlug);

    const ks4Option = ks4OptionSlug ? capitalise(ks4OptionSlug) : "";

    if (Object.values(args).some((arg) => !arg.length)) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    return {
      subject,
      phase,
      subjectSlug,
      phaseSlug,
      ks4Option,
      ks4OptionSlug,
    };
  };

export default curriculumHeaderQuery;
