import { FC } from "react";

import AspectRatio from "../../AspectRatio";
import Flex from "../../Flex";

interface OverviewPresentationProps {
  asset: string;
  lessonTitle: string;
}

const OverviewPresentation: FC<OverviewPresentationProps> = ({
  asset,
  lessonTitle,
}) => {
  return (
    <Flex $mt={[0, 16]} $justifyContent={"center"} $width={"100%"}>
      <Flex
        $minWidth={["100%", "70%", 840]}
        $alignItems={"center"}
        $flexDirection={"column"}
      >
        <AspectRatio ratio={"16:9"}>
          <iframe
            role="iframe"
            src={asset}
            title={lessonTitle}
            width="100%"
            height="100%"
          />
        </AspectRatio>
      </Flex>
    </Flex>
  );
};

export default OverviewPresentation;
