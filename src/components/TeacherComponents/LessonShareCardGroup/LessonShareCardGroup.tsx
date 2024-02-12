import { ChangeEvent, FC } from "react";
import { Control, Controller } from "react-hook-form";
import { OakFlex } from "@oaknational/oak-components";

import ResourceCard from "@/components/TeacherComponents/ResourceCard";
import { sortShareResources } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/sortResources";
import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import {
  LessonShareData,
  LessonShareResourceData,
} from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";

export type LessonShareCardGroupProps = {
  shareableResources: LessonShareData["shareableResources"];
  control: Control<ResourceFormProps>;
  triggerForm: () => void;
  hasError?: boolean;
  shareLink: string;
};

const LessonShareCardGroup: FC<LessonShareCardGroupProps> = (props) => {
  const sortedResources = sortShareResources(props.shareableResources);

  return (
    <OakFlex
      $flexDirection="column"
      $gap={["all-spacing-4", "all-spacing-6"]}
      $alignItems="flex-start"
    >
      <OakFlex
        $gap={"all-spacing-4"}
        $flexDirection={["column", "row"]}
        $flexWrap={["nowrap", "wrap"]}
      >
        {sortedResources.map(
          (resource, i) =>
            resource.exists && (
              <Controller
                data-testid="lessonResourcesToShare"
                control={props.control}
                name="resources"
                defaultValue={[]}
                key={`${resource.type}-${i}`}
                render={({
                  field: { value: fieldValue, onChange, name, onBlur },
                }) => {
                  const onChangeHandler = (
                    e: ChangeEvent<HTMLInputElement>,
                  ) => {
                    if (e.target.checked) {
                      onChange([...fieldValue, resource.type]);
                    } else {
                      onChange(
                        fieldValue.filter(
                          (val: LessonShareResourceData["type"] | string) =>
                            val !== resource.type,
                        ),
                      );
                    }
                    // Trigger the form to reevaluate errors
                    props.triggerForm();
                  };
                  return (
                    <ResourceCard
                      id={resource.type}
                      name={name}
                      label={resource.label}
                      subtitle={
                        resource.metadata.toLowerCase() === "pdf"
                          ? "PDF"
                          : resource.metadata
                      }
                      resourceType={resource.type}
                      onChange={onChangeHandler}
                      checked={fieldValue.includes(resource.type)}
                      onBlur={onBlur}
                      hasError={props.hasError}
                    />
                  );
                }}
              />
            ),
        )}
      </OakFlex>
      <ButtonAsLink
        label="Preview as a pupil"
        icon="external"
        $iconPosition="trailing"
        variant="minimal"
        href={props.shareLink}
        page={null}
        iconBackground="black"
        disabled={props.hasError}
      />
    </OakFlex>
  );
};

export default LessonShareCardGroup;
