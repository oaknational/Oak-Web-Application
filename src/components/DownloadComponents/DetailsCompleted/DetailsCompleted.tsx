import { FC } from "react";

import Typography, { P } from "../../Typography";
import Button from "../../Button";
import Flex from "../../Flex";

import Svg from "@/components/Svg";

export type DetailsCompletedProps = {
  email?: string;
  school?: string;
  onEditClick: () => void;
};

const getSchoolName = (school: string | undefined) => {
  if (school === "notListed") {
    return "My school isn’t listed";
  } else if (school === "homeschool") {
    return "Homeschool";
  } else {
    return school;
  }
};

const DetailsCompleted: FC<DetailsCompletedProps> = ({
  email,
  school,
  onEditClick,
}) => {
  return (
    <Flex
      $flexDirection="column"
      $gap={24}
      $pa={24}
      $width={420}
      $height={220}
      $position="relative"
      $alignItems="flex-start"
    >
      <Svg
        name="background-shape"
        $position="absolute"
        $left={0}
        $top={0}
        $zIndex="behind"
        $width="100%"
        $height="100%"
      />
      <Flex $flexDirection="column" $gap={16}>
        <Flex $flexDirection="column" $gap={4}>
          <Typography $font="heading-7">School</Typography>
          <P $font={"body-3"}>{getSchoolName(school)}</P>
        </Flex>
        <Flex $flexDirection="column" $gap={4}>
          <Typography $font="heading-7">Email</Typography>
          <P $font={"body-3"} $wordWrap={"break-word"}>
            {email ?? "Not provided"}
          </P>
        </Flex>
      </Flex>
      <Button
        label="Edit"
        variant="minimal"
        icon="edit"
        $iconPosition="trailing"
        iconBackground="black"
        onClick={onEditClick}
        $mt={8}
        aria-label="Edit details"
      />
    </Flex>
  );
};

export default DetailsCompleted;
