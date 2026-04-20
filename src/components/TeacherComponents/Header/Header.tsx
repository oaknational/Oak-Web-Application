import {
  OakUiRoleToken,
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakTypography,
  OakUL,
  OakLI,
  OakIcon,
  OakImage,
  OakIconName,
  OakFlex,
  OakHandDrawnCardWithIcon,
  OakBoxProps,
  OakTagFunctional,
} from "@oaknational/oak-components";

type HeaderProps = {
  /**
   * Top level heading
   */
  heading: string;
  /**
   * Summary copy
   */
  summary?: React.ReactNode;
  /**
   * Bullet points rendered as a list with a tick icon
   */
  bullets?: string[];
  /**
   * A slot for content that appears above the main content
   *
   * This content will span the full width of the grid. Ideal for breadcrumbs.
   */
  headerSlot?: React.ReactNode;
  /**
   * A slot for content that appears below the main content
   *
   * This content will span the full width of the grid up to the tablet breakpoing and 7 columns from desktop.
   *
   * Ideal for action buttons and links.
   */
  footerSlot?: React.ReactNode;
  /**
   * The level of the decorative background colour to be used. Defaults to transparent.
   */
  backgroundColorLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

export type LargeHeaderProps = {
  layoutVariant: "large";
  /**
   * A hero image for the header;
   */
  heroImage: string | null;
  /**
   * Whether to use the subdued vaiant of the background colour for the main background
   */
  useSubduedBackground?: boolean;
} & HeaderProps;

export type SubjectIcon = `subject-${string}` & OakIconName;
export type CompactHeaderProps = {
  layoutVariant: "compact";
  /**
   * An optional subject icon to display alongside the header
   */
  subjectIcon?: SubjectIcon;
  /**
   * Optional list of tags to display above the heading
   */
  tags?: Array<string>;
} & HeaderProps;

const isCompactHeaderProps = (
  u: LargeHeaderProps | CompactHeaderProps,
): u is CompactHeaderProps => {
  return u.layoutVariant === "compact";
};

/**
 * Header component for programme pages
 *
 * The header slot and footer slot are optional
 *
 * ```
 * Grid layout
 *
 * MOBILE: 12       TABLET: 7, 5                   DESKTOP: 7, 5
 * |-------------|  |-------------|-------------|  |-------------|-------------|
 * | headerSlot  |  | headerSlot  | headerSlot  |  | headerSlot  | headerSlot  |
 * | subjectHero |  | contentArea | subjectHero |  | contentArea | subjectHero |
 * | contentArea |  | footerSlot  | footerSlot  |  | footerSlot  | subjectHero  |
 * | footerSlot  |  |-------------|-------------|  |-------------|-------------|
 * |-------------|
 * ```
 */
export const Header = (props: LargeHeaderProps | CompactHeaderProps) => {
  const { heading, summary, bullets, headerSlot, footerSlot } = props;

  const isCompactLayout = isCompactHeaderProps(props);
  const heroImage = isCompactLayout ? null : props.heroImage;

  const getMainBackground = (): OakUiRoleToken | undefined => {
    if (props.backgroundColorLevel) {
      if (isCompactLayout) {
        return `bg-decorative${props.backgroundColorLevel}-very-subdued`;
      } else if (props.useSubduedBackground) {
        return `bg-decorative${props.backgroundColorLevel}-very-subdued`;
      } else {
        return `bg-decorative${props.backgroundColorLevel}-main`;
      }
    }
  };

  const mainBackground = getMainBackground();

  return (
    <OakBox
      $background={mainBackground}
      $ph={["spacing-20", "spacing-40"]}
      $pb={[
        isCompactLayout ? "spacing-32" : "spacing-40",
        isCompactLayout ? "spacing-32" : "spacing-64",
      ]}
      $pt={[
        isCompactLayout ? "spacing-32" : "spacing-40",
        isCompactLayout ? "spacing-40" : "spacing-64",
      ]}
      $color="text-primary"
    >
      <OakGrid
        $cg="spacing-16"
        $maxWidth="spacing-1280"
        $mh="auto"
        $rg={["spacing-32", isCompactLayout ? "spacing-32" : "spacing-48"]}
      >
        {headerSlot && (
          <OakGridArea $colSpan={12} $order={1}>
            {headerSlot}
          </OakGridArea>
        )}
        {/* Content area: 7 columns on desktop for large layout, full width on mobile and compact layout*/}
        <OakGridArea $colSpan={[12, isCompactLayout ? 12 : 7]} $order={[3, 2]}>
          <OakFlex $gap={"spacing-32"} $height={"100%"}>
            <CompactHeaderSubjectIcon display={["none", "block"]} {...props} />
            <OakFlex
              $textWrap="balance"
              $flexDirection="column"
              $justifyContent="center"
              $gap="spacing-24"
            >
              <CompactHeaderSubjectIcon display={["flex", "none"]} {...props} />
              <CompactHeaderTags {...props} display={["none", "flex"]} />
              <OakHeading
                tag={"h1"}
                $font={[
                  isCompactLayout ? "heading-5" : "heading-4",
                  isCompactLayout ? "heading-4" : "heading-1",
                ]}
              >
                {heading}
              </OakHeading>
              <OakTypography $font="body-2">{summary}</OakTypography>
              {bullets && bullets.length > 0 && (
                <OakUL
                  $reset
                  $display="flex"
                  $flexDirection="column"
                  $gap="spacing-12"
                >
                  {bullets.map((bullet) => (
                    <OakLI
                      key={bullet}
                      $display="flex"
                      $alignItems="center"
                      $gap="spacing-8"
                    >
                      <OakIcon
                        iconName="tick"
                        $width="spacing-20"
                        $height="spacing-20"
                        $colorFilter="icon-brand"
                      />
                      {bullet}
                    </OakLI>
                  ))}
                </OakUL>
              )}
            </OakFlex>
          </OakFlex>
        </OakGridArea>
        {footerSlot && (
          <OakGridArea
            $colSpan={[12, 12, 7]}
            $order={4}
            $flexDirection="column"
          >
            {footerSlot}
          </OakGridArea>
        )}
        {/* Image area: 5 columns on desktop, full width on mobile */}
        <OakGridArea
          $colSpan={[12, 5]}
          $rowSpan={[1, 1, footerSlot ? 2 : 1]}
          $order={[2, 3]}
          $flexDirection="column"
          $alignItems={["center", "flex-start"]}
          $justifyContent="center"
          $display={isCompactLayout ? "none" : "flex"}
        >
          {heroImage && (
            <OakImage
              data-testid="hero-image"
              src={heroImage}
              // alt is empty because the image is decorative and does not need to be described to screen readers
              alt=""
              $width="100%"
              $height="100%"
              $minHeight={["spacing-240", "spacing-360"]}
              $objectFit="contain"
              placeholder="empty"
              unoptimized
            />
          )}
        </OakGridArea>
      </OakGrid>
    </OakBox>
  );
};

const CompactHeaderSubjectIcon = ({
  display,
  ...props
}: {
  display: OakBoxProps["$display"];
} & (CompactHeaderProps | LargeHeaderProps)) => {
  const isCompactLayout = isCompactHeaderProps(props);
  const iconName = isCompactLayout ? props.subjectIcon : undefined;
  const iconBackground = isCompactLayout
    ? (`bg-decorative${props.backgroundColorLevel}-main` as OakUiRoleToken)
    : undefined;

  return iconName ? (
    <OakFlex
      $width={["max-content", "spacing-80"]}
      $height={["auto", "spacing-80"]}
      $display={display}
      $gap={"spacing-24"}
    >
      <OakHandDrawnCardWithIcon
        iconName={iconName}
        fill={iconBackground}
        $width={["auto", "100%"]}
        $height={["auto", "100%"]}
        iconWidth={["spacing-56", "spacing-80"]}
        iconHeight={["spacing-56", "spacing-80"]}
        $pa={"spacing-8"}
      />
      <CompactHeaderTags {...props} display={["flex", "none"]} />
    </OakFlex>
  ) : null;
};

const CompactHeaderTags = ({
  display,
  ...props
}: {
  display: OakBoxProps["$display"];
} & (CompactHeaderProps | LargeHeaderProps)) => {
  const isCompactLayout = isCompactHeaderProps(props);
  const tags = isCompactLayout ? props.tags : undefined;

  return tags ? (
    <OakFlex $display={display} $gap={"spacing-8"} $flexWrap={"wrap"}>
      {tags.map((tag) => (
        <OakTagFunctional
          label={tag}
          key={tag}
          $background="bg-neutral"
          $height={"max-content"}
        />
      ))}
    </OakFlex>
  ) : null;
};
