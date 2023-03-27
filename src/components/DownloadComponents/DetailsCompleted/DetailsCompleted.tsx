import { FC, useEffect, useState } from "react";

import { Heading, P } from "../../Typography";
import Button from "../../Button";
import Box from "../../Box";
import Flex from "../../Flex";
import Icon from "../../Icon";

export type DetailsCompletedProps = {
  email?: string;
  school?: string;
  onEditClick: () => void;
};

const DetailsCompleted: FC<DetailsCompletedProps> = ({
  email,
  school,
  onEditClick,
}) => {
  const getSchoolName = (school: string | undefined) => {
    if (school === "notListed") {
      return "My school isn’t listed";
    } else if (school === "homeschool") {
      return "Homeschool";
    } else {
      return school;
    }
  };

  const [displayEmail, setDisplayEmail] = useState(false);
  const [displaySchool, setDisplaySchool] = useState(false);

  useEffect(() => {
    if (email) {
      setDisplayEmail(true);
    }

    if (school) {
      setDisplaySchool(true);
    }
  }, [email, school]);

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
      {displaySchool && (
        <P $font={"body-3"} $color={"oakGrey4"} $mb={4} data-testid="school">
          school: {getSchoolName(school)}
        </P>
      )}
      {displayEmail && (
        <P
          $font={"body-3"}
          $color={"oakGrey4"}
          $mb={4}
          data-testid="email"
          $wordWrap={"break-word"}
        >
          email: {email}
        </P>
      )}
      <Button
        label="Edit"
        variant="minimal"
        icon="chevron-down"
        $iconPosition="trailing"
        iconBackground="teachersHighlight"
        onClick={onEditClick}
        $mt={8}
        aria-label="Edit details"
      />
    </Box>
  );
};

export default DetailsCompleted;
