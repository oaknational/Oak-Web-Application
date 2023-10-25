import { FC } from "react";

import { Heading, P } from "@/components/Typography";
import Button from "@/components/Button";
import Flex from "@/components/Flex";
import Box from "@/components/Box";

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
    <Box $width={["100%", 420]} $height={"max-content"} $position="relative">
      <Box
        $position="absolute"
        $top={0}
        $left={0}
        $width="100%"
        $height="100%"
        $zIndex="behind"
      >
        <svg
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          viewBox="0 0 416 218"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.6631 4.25797C9.99403 4.69329 6.65606 5.12861 4.98697 9.04649C1.64879 14.2703 2.48305 18.2753 2.48305 25.5886C2.48305 34.7304 0 53.914 0 66.2204C0 76.7688 2.16281 94.9147 2.48305 104.898C2.89975 117.888 2.48305 137.031 2.48305 149.655C2.48305 162.279 2.90032 192.751 2.48305 197.975C2.06578 203.199 8.74214 209.729 11.6631 212.776C14.5841 215.823 35.0045 218 40.429 218C45.8536 218 65.9084 216.259 78.4266 216.259H149.363H202.357H236.99C250.343 216.259 302.502 216.694 315.437 216.259C328.373 215.823 383.035 216.259 395.971 216.259C408.906 216.259 410.158 206.246 410.158 202.764C410.158 199.281 416 173.162 416 162.714C416 152.267 413.996 107.075 413.079 98.7224C412.219 90.8866 413.079 83.0509 413.079 77.3917C413.079 71.7325 414.722 34.295 414.305 24.2827C413.888 14.2703 411.41 6.43457 410.158 3.82265C408.906 1.21073 392.19 0.775413 388.434 0.775413H350.905C346.733 0.775413 224.863 -0.968842 207.755 0.774777C195.571 2.01659 129.751 2.80691 98.0384 0.775413C86.633 1.21073 62.6537 2.16844 57.9803 2.51669C52.1385 2.95201 32.1094 1.21073 26.6848 1.21073H19.1739C17.5049 1.21073 13.3322 3.82265 11.6631 4.25797Z"
            fill="#E4E4E4"
          />
        </svg>
      </Box>
      <Flex $flexDirection="column" $gap={24} $pa={24} $alignItems="flex-start">
        <Flex $flexDirection="column" $gap={16}>
          <Flex $flexDirection="column" $gap={4}>
            <Heading tag="h3" $font="heading-7">
              School
            </Heading>
            <P $font={"body-2"}>{getSchoolName(school)}</P>
          </Flex>
          <Flex $flexDirection="column" $gap={4}>
            <Heading tag="h3" $font="heading-7">
              Email
            </Heading>
            <P $font={"body-2"} $wordWrap={"break-word"}>
              {email ? email : "Not provided"}
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
    </Box>
  );
};

export default DetailsCompleted;
