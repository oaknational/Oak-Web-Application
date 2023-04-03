/**
 * This component inlines any SVGs which we want to be available instantly
 * (e.g. Logo)
 * @see /scripts/build/image_data/generate_brand_assets.js
 */
import { FC } from "react";

// eslint-disable-next-line import/no-unresolved
import InlineSpriteSheetSvg from "../../image-data/generated/inline-sprite.svg";

const InlineSpriteSheet: FC = () => {
  return <InlineSpriteSheetSvg />;
};

export default InlineSpriteSheet;
