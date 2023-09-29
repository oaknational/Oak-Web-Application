import { FC } from "react";

import Typography from "../Typography";
import Flex from "../Flex";

const HeaderMetadata: FC<{
  examBoardTitle?: string | null;
  tierTitle?: string | null;
  yearTitle?: string | null; // TODO: make required
}> = (props) => {
  const { yearTitle, examBoardTitle, tierTitle } = props;

  const headerValues = [yearTitle, examBoardTitle, tierTitle].filter(
    (value) => !!value,
  );

  const headerElements = headerValues.map((value, i) => (
    <>
      <Typography>{value}</Typography>
      {i + 1 !== headerValues.length && <Typography>•</Typography>}
    </>
  ));

  return <Flex $gap={8}>{headerElements}</Flex>;
};

export default HeaderMetadata;
