import Image, { ImageProps } from "next/image";
import styled from "styled-components";

import { box, BoxProps } from "@/components/SharedComponents/Box";

export type LegacyOwaImageProps = ImageProps & BoxProps;

/**
 * This legacy component is used temporarily until CMSImage is removed
 * This component should not be used anywhere else
 * @deprecated use OwaImage instead
 */
const LegacyOwaImage = styled(Image)<LegacyOwaImageProps>`
  ${box}
`;

export default LegacyOwaImage;
