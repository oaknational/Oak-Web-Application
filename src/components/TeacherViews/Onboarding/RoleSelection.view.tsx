import {
  oakDefaultTheme,
  OakFlex,
  OakMaxWidth,
  OakP,
  OakThemeProvider,
} from "@oaknational/oak-components";

export const RoleSelectionView = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakMaxWidth>
        <OakFlex
          $flexDirection="column"
          $width="all-spacing-21"
          $gap="space-between-m"
        >
          <OakP>Role selection</OakP>
        </OakFlex>
      </OakMaxWidth>
    </OakThemeProvider>
  );
};

export default RoleSelectionView;
