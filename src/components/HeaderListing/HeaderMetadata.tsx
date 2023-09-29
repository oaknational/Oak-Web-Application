import { FC } from "react";

import Typography from "../Typography";
import Flex from "../Flex";

// TODO: extract and name sensibly
const HeaderMetadata: FC<{
  examBoardTitle?: string | null;
  tierTitle?: string | null;
  yearTitle?: string | null;
}> = (props) => {
  const { yearTitle, examBoardTitle, tierTitle } = props;

  return (
    <Flex $gap={8}>
      {[yearTitle, examBoardTitle, tierTitle]
        .filter((value) => !!value)
        .map((value, i, arr) => {
          return (
            <>
              <Typography>{value}</Typography>
              {i + 1 !== arr.length && <Typography>•</Typography>}
            </>
          );
        })}
    </Flex>
  );
};

export default HeaderMetadata;
