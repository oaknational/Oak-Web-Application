/**
 * This component fetches sprite.svg from the public folder and makes it
 * available to the browser.
 * @see /scripts/build/image_data/generate_sprite.js
 */
import { FC } from "react";

const SpriteSheet: FC = () => {
  return (
    <object
      role="presentation"
      type="image/svg+xml"
      data="/images/sprite/sprite.svg"
      width="0"
      height="0"
    />
  );
};

export default SpriteSheet;
