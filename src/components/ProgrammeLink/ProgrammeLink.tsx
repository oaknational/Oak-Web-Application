import { ProgrammesData } from "../../node-lib/curriculum-api";
import OakLink from "../OakLink";

function ProgrammeLink({ programme }: { programme: ProgrammesData }) {
  const { programmeSlug, title } = programme;
  return (
    <OakLink
      page="programme"
      programme={programmeSlug}

      //TODO add tracking
    >
      {title}
    </OakLink>
  );
}

export default ProgrammeLink;
