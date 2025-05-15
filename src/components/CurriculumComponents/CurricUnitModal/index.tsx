import { OakFlex, OakBox } from "@oaknational/oak-components";

import { OakModalNew } from "../OakComponentsKitchen/OakModalNew";
import CurricUnitModalFooter from "../CurricUnitModalFooter";

import CurricUnitModalContent from "@/components/CurriculumComponents/CurricUnitModalContent";
import { createTeacherProgrammeSlug } from "@/utils/curriculum/slugs";
import {
  CurriculumFilters,
  Unit,
  YearData,
  Thread,
  UnitOption,
} from "@/utils/curriculum/types";

type CurricUnitModalProps = {
  open: boolean;
  onClose: () => void;
  unitData?: Unit | undefined;
  unitOptionData: UnitOption | undefined;
  ks4OptionSlug?: string | null;
  yearData: YearData;
  basePath: string;
  selectedThread: Thread | undefined;
  filters: CurriculumFilters;
};
export default function CurricUnitModal({
  unitData,
  unitOptionData,
  ks4OptionSlug,
  yearData,
  basePath,
  selectedThread,
  open,
  onClose,
  filters,
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
              {unitData && (
                <CurricUnitModalContent
                  basePath={basePath}
                  unitData={unitData}
                  unitOptionData={unitOptionData}
                  yearData={yearData}
                  selectedThread={selectedThread?.slug ?? null}
                />
              )}
            </OakFlex>
          </OakFlex>
        </OakBox>
      }
      footer={
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
      }
    />
  );
}
