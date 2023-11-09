import { ChangeEvent, FC } from "react";
import { Control, Controller } from "react-hook-form";

import ResourceCard from "../ResourceCard";
import { sortShareResources } from "../helpers/sortResources";

import { LessonShareData, LessonShareSchema } from "@/node-lib/curriculum-api";
import Flex from "@/components/Flex";
import ButtonAsLink from "@/components/Button/ButtonAsLink";

export type ShareCardGroupProps = {
  shareableResources: LessonShareData["shareableResources"];
  control: Control;
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
        {sortedResources.map((resource) => (
          <Controller
            control={props.control}
            name="share"
            defaultValue={[]}
            render={({
              field: { value: fieldValue, onChange, name, onBlur },
            }) => {
              const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.checked) {
                  onChange([...fieldValue, resource.type]);
                } else {
                  onChange(
                    fieldValue.filter(
                      (val: LessonShareSchema["type"]) => val !== resource.type,
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
                  subtitle={resource.metadata}
                  resourceType={resource.type}
                  onChange={onChangeHandler}
                  checked={fieldValue.includes(resource.type)}
                  onBlur={onBlur}
                  hasError={props.hasError}
                  data-testid={`share-card-${resource.type}`}
                />
              );
            }}
          />
        ))}
      </Flex>
      <ButtonAsLink
        label="Preview as a pupil"
        icon="external"
        $iconPosition="trailing"
        variant="minimal"
        href={props.shareLink}
        page={null}
        iconBackground="black"
      />
    </Flex>
  );
};

export default ShareCardGroup;
