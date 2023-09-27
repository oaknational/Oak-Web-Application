#!/bin/bash
set -e

node ./scripts/build/image_data/generate_favicons.js
node ./scripts/build/image_data/generate_inline_sprite.js
node ./scripts/build/image_data/generate_social_sharing_image.js
node ./scripts/build/image_data/generate_sprite.js
node ./scripts/build/image_data/write_sanity_asset_json.js
