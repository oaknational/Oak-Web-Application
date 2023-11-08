import { ChangeEvent, FC } from "react";
import { Control, Controller } from "react-hook-form";

import ResourceCard from "../ResourceCard";

import Flex from "@/components/Flex";
import { LessonShareData, LessonShareSchema } from "@/node-lib/curriculum-api";


export type ShareCardGroupProps = {
  shareableResources: LessonShareData["shareableResources"];
  control: Control;
  triggerForm: () => void;
  hasError?: boolean;
};

const ShareCardGroup: FC<ShareCardGroupProps> = (props) => {
  return (
    <Flex>
      {props.shareableResources.map((resource) => (
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
  );
};

export default ShareCardGroup;
