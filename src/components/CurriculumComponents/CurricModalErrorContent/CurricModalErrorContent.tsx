import { OakFlex, OakHeading, OakP } from "@oaknational/oak-components";
import styled from "styled-components";

const shadow =
  "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000";

const ErrorHeading = styled(OakHeading)`
  color: white;
  font-size: 120px;
  line-height: 144px;
  text-shadow: ${shadow};
`;

type CurricModalErrorContentProps = {
  statusCode: string;
  message: string;
  additional?: string;
};
export default function CurricModalErrorContent({
  statusCode,
  message,
  additional,
}: CurricModalErrorContentProps) {
  return (
    <OakFlex
      $gap="space-between-s"
      $mv="space-between-l"
      $flexDirection={"column"}
    >
      <ErrorHeading tag="h1">{statusCode}</ErrorHeading>
      <OakHeading $font={"heading-4"} tag="h2">
        {message}
      </OakHeading>
      {additional && <OakP $font={"body-1"}>{additional}</OakP>}
    </OakFlex>
  );
}
