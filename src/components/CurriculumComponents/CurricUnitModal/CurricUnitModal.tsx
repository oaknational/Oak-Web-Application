import { OakFlex, OakBox } from "@oaknational/oak-components";

import { OakModalNew } from "../OakComponentsKitchen/OakModalNew";
import CurricUnitModalFooter from "../CurricUnitModalFooter";

import { createTeacherProgrammeSlug } from "@/utils/curriculum/slugs";
import { CurriculumFilters, Unit, UnitOption } from "@/utils/curriculum/types";

type CurricUnitModalProps = {
  open: boolean;
  onClose: () => void;
  unitData?: Unit | undefined;
  unitOptionData: UnitOption | undefined;
  ks4OptionSlug?: string | null;
  filters: CurriculumFilters;
  children: React.ReactNode;
  disableFooter?: boolean;
};
export default function CurricUnitModal({
  unitData,
  unitOptionData,
  ks4OptionSlug,
  open,
  onClose,
  filters,
  children,
  disableFooter,
}: CurricUnitModalProps) {
  return (
    <OakModalNew
      title={""}
      open={open}
      onClose={onClose}
      modalWidth={["100%", "all-spacing-22"]}
      content={
        <OakBox $position={"absolute"}>
          <OakFlex $flexDirection={"column"} $minWidth={"100%"} $flexGrow={1}>
            <OakFlex
              $height={"100%"}
              $justifyContent={"flex-end"}
              $width="100%"
              $position={"relative"}
              $overflow={"hidden"}
            >
              {children}
            </OakFlex>
          </OakFlex>
        </OakBox>
      }
      footer={
        disableFooter ? undefined : (
          <CurricUnitModalFooter
            programmeSlug={createTeacherProgrammeSlug(
              unitData,
              ks4OptionSlug,
              filters.tiers[0],
              unitData?.pathway_slug ?? undefined,
            )}
            unitData={unitData}
            unitOptionData={unitOptionData}
          />
        )
      }
    />
  );
}
