import {
  OakFlex,
  TileItem,
  isTileItem,
  OakRadioTile,
} from "@oaknational/oak-components";

export type LearningTheme = {
  themeSlug?: string | null;
  themeTitle?: string | null;
};

export type UnitsLearningThemeFiltersProps = {
  labelledBy: string;
  selectedThemeSlug: string;
  learningThemes: LearningTheme[] | null;
  idSuffix: "desktop" | "mobile";
  setTheme: (theme: string | undefined) => void;
};

const UnitsLearningThemeFilters = ({
  learningThemes = [],
  selectedThemeSlug,
  idSuffix,
  setTheme,
}: UnitsLearningThemeFiltersProps) => {
  const themeTileItems: Array<TileItem> = learningThemes
    ? learningThemes
        .map((learningTheme) => {
          return {
            label: learningTheme?.themeTitle,
            id: learningTheme?.themeSlug,
          };
        })
        .filter(isTileItem)
        .sort((a, b) => {
          if (a.id === "no-theme") {
            return 0;
          } else if (b.id === "no-theme") {
            return -1;
          } else {
            return 0;
          }
        })
    : [];

  return (
    <OakFlex $flexDirection={"column"}>
      <OakFlex
        $flexDirection="column"
        $gap="space-between-ssx"
        role="radiogroup"
        $pb="inner-padding-xl2"
      >
        {[{ id: "all", label: "All" }, ...themeTileItems].map(
          (theme, index) => {
            const isChecked = theme.id === selectedThemeSlug;
            return (
              <OakRadioTile
                tileItem={theme}
                key={`${theme.id}-${index}`}
                isChecked={isChecked}
                onChange={(theme) => setTheme(theme.id)}
                id={`${theme.id}-${idSuffix}`}
              />
            );
          },
        )}
      </OakFlex>
    </OakFlex>
  );
};

export default UnitsLearningThemeFilters;
