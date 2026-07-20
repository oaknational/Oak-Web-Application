import { ChangeEvent, FC } from "react";
import { Control, Controller } from "react-hook-form";
import { OakDownloadCard, OakFlex, OakGrid } from "@oaknational/oak-components";
import { uniq } from "lodash";

import ResourceCard, {
  getActivityDownloadCardAriaLabel,
} from "@/components/TeacherComponents/ShareResourceCard/ShareResourceCard";
import { getDownloadCardFieldErrorAriaProps } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/shareDownloadFormErrorIds";
import { sortShareResources } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/sortResources";
import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { SharePageNumberedHeading } from "@/components/TeacherComponents/SharePageNumberedHeading/SharePageNumberedHeading";
import { Fieldset } from "@/components/CurriculumComponents/OakComponentsKitchen/Fieldset";
import { LessonShareData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";

export const SHARE_SELECT_ACTIVITIES_HEADING_ID =
  "share-select-activities-heading";

const FULL_ONLINE_LESSON_TITLE = "Full online lesson";
const FULL_ONLINE_LESSON_FORMAT =
  "Share the whole lesson (starter quiz, lesson video, worksheet and exit quiz) and view results";

export type LessonShareCardGroupProps = {
  shareableResources: LessonShareData["shareableResources"];
  control: Control<ResourceFormValues>;
  triggerForm: () => void;
  hasError?: boolean;
  hideCheckboxes: boolean;
};

const LessonShareCardGroup: FC<LessonShareCardGroupProps> = (props) => {
  const sortedResources = sortShareResources(props.shareableResources).filter(
    (r) => r.exists && r.metadata !== null,
  );

  const checkboxOnChangeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (val: string[]) => void,
    fieldValue: string[],
    resourceType: string | string[],
  ) => {
    if (e.target.checked) {
      onChange(
        uniq([
          ...fieldValue,
          ...(Array.isArray(resourceType) ? resourceType : [resourceType]),
        ]),
      );
    } else {
      onChange(
        uniq(
          fieldValue.filter(
            (val) =>
              !(Array.isArray(resourceType)
                ? resourceType.includes(val)
                : val === resourceType),
          ),
        ),
      );
    }
    // Trigger the form to reevaluate errors
    props.triggerForm();
  };

  return (
    <OakFlex $flexDirection={"column"} $gap={"spacing-40"}>
      <SharePageNumberedHeading
        number={1}
        title={"Select activities"}
        titleId={SHARE_SELECT_ACTIVITIES_HEADING_ID}
        paragraph={
          "Select the activities you want to share. You must select at least one activity."
        }
      />
      <Fieldset aria-labelledby={SHARE_SELECT_ACTIVITIES_HEADING_ID}>
        <OakGrid
          $display="grid"
          $gridTemplateColumns={["1fr", "1fr 1fr"]}
          $cg="spacing-16"
          $rg="spacing-32"
          $maxWidth={"spacing-960"}
        >
          <OakFlex
            $flexDirection={"row"}
            $gap={"spacing-16"}
            $justifyContent={"stretch"}
          >
            <Controller
              data-testid="lessonResourcesToShare"
              control={props.control}
              name="resources"
              defaultValue={[]}
              key={`${"all"}`}
              render={({
                field: { value: fieldValue, onChange, name, onBlur },
              }) => {
                return (
                  <OakDownloadCard
                    format={FULL_ONLINE_LESSON_FORMAT}
                    id={"download-card-wrapping-long"}
                    data-testid="resourceCard"
                    value={"all"}
                    name={name}
                    title={FULL_ONLINE_LESSON_TITLE}
                    aria-label={getActivityDownloadCardAriaLabel(
                      FULL_ONLINE_LESSON_TITLE,
                      FULL_ONLINE_LESSON_FORMAT,
                    )}
                    {...getDownloadCardFieldErrorAriaProps(props.hasError)}
                    checked={["exit-quiz", "starter-quiz", "video"].every(
                      (section) => fieldValue.includes(section),
                    )}
                    onChange={(e) => {
                      checkboxOnChangeHandler(e, onChange, fieldValue, [
                        "exit-quiz",
                        "starter-quiz",
                        "video",
                      ]);
                    }}
                    onBlur={onBlur}
                    iconName={["quiz", "video", "worksheet", "quiz"]}
                  />
                );
              }}
            />
          </OakFlex>
          <OakFlex $flexDirection={"column"} $gap={"spacing-32"}>
            {sortedResources.map((resource, i) => (
              <Controller
                data-testid="lessonResourcesToShare"
                control={props.control}
                name="resources"
                defaultValue={[]}
                key={`${resource.type}-${i}`}
                render={({
                  field: { value: fieldValue, onChange, name, onBlur },
                }) => {
                  return (
                    <ResourceCard
                      id={resource.type}
                      name={name}
                      label={resource.label}
                      subtitle={resource.metadata!}
                      resourceType={resource.type}
                      onChange={(e) => {
                        checkboxOnChangeHandler(
                          e,
                          onChange,
                          fieldValue,
                          resource.type,
                        );
                      }}
                      checked={fieldValue.includes(resource.type)}
                      onBlur={onBlur}
                      hasError={props.hasError}
                      useDownloadPageLayout={false}
                    />
                  );
                }}
              />
            ))}
          </OakFlex>
        </OakGrid>
      </Fieldset>
    </OakFlex>
  );
};

export default LessonShareCardGroup;
