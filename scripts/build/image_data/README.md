# Image data

This app uses images which are intellectual property of Oak and are not to
be open sourced.

These images include UI icons, illustrations, and other graphics.

The images are hosted in Sanity, and this script is used to fetch the image
data, which is git ignored so that that it does not persist in the codebase.

## SVG Sprite

UI icon and UI graphic images are downloaded and compiled into a spritesheet
stored at `public/images/sprite/sprite.svg`. Unique slugs for these images
are stored in JSON at `src/image-data/ui-icons.json` and
`src/image-data/ui-graphics.json`. These JSON files are used for static type
inference.

## Samity asset data

Subject icons (whose filesize tends to be larger, and which are used in the
app less frequently) are not added to the spritesheet. Instead their Sanity
asset data is stored (at `src/image-data/subject-icons.json`) ready to be
consumed by @sanity/image-url

## GROQ

The Sanity queries use GROQ, find documentation here:
https://www.sanity.io/docs/how-queries-work
