import { ChangeEvent, FC } from "react";
import { Control, Controller } from "react-hook-form";

import ResourceCard from "../ResourceCard";
import { sortShareResources } from "../helpers/sortResources";
import { ResourceFormProps } from "../downloadAndShare.types";

import { LessonShareData, LessonShareSchema } from "@/node-lib/curriculum-api";
import Flex from "@/components/SharedComponents/Flex";
import ButtonAsLink from "@/components/Button/ButtonAsLink";

export type ShareCardGroupProps = {
  shareableResources: LessonShareData["shareableResources"];
  control: Control<ResourceFormProps>;
  triggerForm: () => void;
  hasError?: boolean;
  shareLink: string;
};

const ShareCardGroup: FC<ShareCardGroupProps> = (props) => {
  const sortedResources = sortShareResources(props.shareableResources);

  return (
    <Flex $flexDirection="column" $gap={[16, 24]} $alignItems="flex-start">
      <Flex
        $gap={16}
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
                          (val: LessonShareSchema["type"] | string) =>
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
      </Flex>
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
    </Flex>
  );
};

export default ShareCardGroup;
