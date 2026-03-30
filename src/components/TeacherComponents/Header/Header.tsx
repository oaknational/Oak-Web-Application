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
};

export type LargeHeaderProps = {
  layoutVariant: "large";
  /**
   * A hero image for the header;
   */
  heroImage: string | null;
  /**
   * The background color of the header. Defaults to transparent.
   */
  background?: Extract<OakUiRoleToken, `bg-decorative${number}-main`>;
} & HeaderProps;

export type CompactHeaderProps = {
  layoutVariant: "compact";
  /**
   * An optional icon to display alongside the header
   */
  headerIcon?: OakIconName;
  /**
   * The background color of the header. Defaults to transparent.
   */
  background?: Extract<OakUiRoleToken, `bg-decorative${number}-very-subdued`>;
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
  const { heading, summary, bullets, headerSlot, footerSlot, background } =
    props;

  const isCompactLayout = isCompactHeaderProps(props);
  const heroImage = isCompactLayout ? null : props.heroImage;

  return (
    <OakBox
      $background={background}
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-40", "spacing-64"]}
      $color="text-primary"
    >
      <OakGrid
        $cg="spacing-16"
        $maxWidth="spacing-1280"
        $mh="auto"
        $rg={["spacing-32", "spacing-48"]}
      >
        {headerSlot && (
          <OakGridArea $colSpan={12} $order={1}>
            {headerSlot}
          </OakGridArea>
        )}
        {/* Content area: 7 columns on desktop, full width on mobile */}
        <OakGridArea
          $colSpan={[12, 7]}
          $order={[3, 2]}
          $flexDirection="column"
          $justifyContent="center"
          $gap="spacing-24"
          $textWrap="balance"
        >
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
