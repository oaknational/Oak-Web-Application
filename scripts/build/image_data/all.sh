#!/bin/bash
set -e

node ./scripts/build/image_data/generate_favicons.cjs
node ./scripts/build/image_data/generate_inline_sprite.cjs
node ./scripts/build/image_data/generate_social_sharing_image.cjs
node ./scripts/build/image_data/generate_sprite.cjs
node ./scripts/build/image_data/write_sanity_asset_json.cjs
