import { FC } from "react";

import { Heading, P } from "../../Typography";
import Button from "../../Button";
import Box from "../../Box";
import Flex from "../../Flex";
import Icon from "../../Icon";

export type DetailsCompletedProps = {
  email: string;
  school: string;
  onEditClick: () => void;
};

const DetailsCompleted: FC<DetailsCompletedProps> = ({
  email,
  school,
  onEditClick,
}) => {
  return (
    <Box $mt={56} $mb={96}>
      <Flex $mb={12}>
        <Heading tag="h3" $font={"heading-5"}>
          Details complete
        </Heading>
        <Icon
          variant="brush"
          name={"tick"}
          size={36}
          $background={"success"}
          $ml={28}
        />
      </Flex>
      <P $mb={8}>We have your details saved already.</P>
      <P $font={"body-3"} $color={"oakGrey4"} $mb={4}>
        school: {school}
      </P>
      <P $font={"body-3"} $color={"oakGrey4"} $mb={12}>
        email: {email}
      </P>
      <Button
        label="Edit"
        variant="minimal"
        icon="chevron-down"
        $iconPosition="trailing"
        iconBackground="teachersHighlight"
        onClick={onEditClick}
      />
    </Box>
  );
};

export default DetailsCompleted;
