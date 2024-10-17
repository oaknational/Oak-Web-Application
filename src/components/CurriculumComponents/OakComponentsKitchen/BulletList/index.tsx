import { OakTypography, OakTypographyProps } from "@oaknational/oak-components";
import { Fragment } from "react";

type BulletListProps = {
  items: { text: string }[];
} & OakTypographyProps;
export default function BulletList(props: BulletListProps) {
  const { items, ...fontProps } = props;

  const children = items.map(({ text }, i) => (
    <Fragment key={`${text}`}>
      <OakTypography {...fontProps}>{text}</OakTypography>
      {i + 1 < items.length && (
        <OakTypography {...fontProps} aria-hidden>
          •
        </OakTypography>
      )}
    </Fragment>
  ));

  return <Fragment>{children}</Fragment>;
}
