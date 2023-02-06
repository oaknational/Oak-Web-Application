import { KeyStageKeypadProps } from "../../components/KeyStageKeypad/KeyStageKeypad";
import teachersHomePageFixture from "../../node-lib/curriculum-api/fixtures/teachersHomePage.fixture";

const keyStageKeypad: KeyStageKeypadProps = {
  keyStages: teachersHomePageFixture().keyStages,
  years: [
    { title: "Year 1", shortCode: "1", slug: "/" },
    { title: "Year 2", shortCode: "2", slug: "/" },
    { title: "Year 3", shortCode: "3", slug: "/" },
    { title: "Year 4", shortCode: "4", slug: "/" },
    { title: "Year 5", shortCode: "5", slug: "/" },
    { title: "Year 6", shortCode: "6", slug: "/" },
    { title: "Year 7", shortCode: "7", slug: "/" },
    { title: "Year 8", shortCode: "8", slug: "/" },
    { title: "Year 9", shortCode: "9", slug: "/" },
    { title: "Year 10", shortCode: "10", slug: "/" },
    { title: "Year 11", shortCode: "11", slug: "/" },
  ],
};

export default keyStageKeypad;
