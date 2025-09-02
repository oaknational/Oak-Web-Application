import { KeyStageKeypadProps } from "../../components/SharedComponents/KeyStageKeypad/KeyStageKeypad";
import keyStagesFixture from "../../node-lib/curriculum-api-2023/fixtures/keyStages.fixture";

const keyStageKeypad: KeyStageKeypadProps = {
  keyStages: keyStagesFixture().keyStages,
  title: "Select key stage",
  trackingOnClick: () => {},
};

export default keyStageKeypad;
