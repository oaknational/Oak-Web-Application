"use client";
import {
  OakFlex,
  OakInformativeModal,
  OakMaxWidth,
  OakSecondaryButton,
} from "@oaknational/oak-components";
import { useState } from "react";

import { CurricTimetableHeader } from "../CurricTimetableHeader";

import { useTimetableParams } from "@/utils/curriculum/timetabling";
import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";

type CurricTimetablingUnitsProps = { subjectPhaseSlug: string };
export const CurricTimetablingUnits = ({
  subjectPhaseSlug,
}: CurricTimetablingUnitsProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [data] = useTimetableParams();
  const { subjectSlug } = parseSubjectPhaseSlug(subjectPhaseSlug)!;

  const onEditDetails = () => {
    setModalOpen(true);
  };

  const onCopyLink = () => {
    const urlToCopy = window.location.href;
    navigator.clipboard.writeText(urlToCopy);
  };

  return (
    <>
      <OakFlex $flexDirection={"column"} $pa={"inner-padding-xl5"}>
        <CurricTimetableHeader
          titleSlot={`Year ${data.year} ${subjectSlug}`}
          illustrationSlug={"magic-carpet"}
          additionalSlot={
            <OakFlex $maxWidth={"all-spacing-20"} $gap={"all-spacing-4"}>
              <OakSecondaryButton
                iconName="copy"
                isTrailingIcon={true}
                onClick={onEditDetails}
              >
                Edit details
              </OakSecondaryButton>
              <OakSecondaryButton
                iconName="edit"
                isTrailingIcon={true}
                onClick={onCopyLink}
              >
                Copy link
              </OakSecondaryButton>
            </OakFlex>
          }
        />
      </OakFlex>

      <OakInformativeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        closeOnBackgroundClick={true}
      >
        Edit details modal
      </OakInformativeModal>

      <OakMaxWidth $ph={"inner-padding-xl5"}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </OakMaxWidth>
    </>
  );
};
