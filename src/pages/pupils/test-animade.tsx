import { NextPage } from "next";
import Lottie from "react-lottie-player";

import lottieJson from "../../lotties/lottie.json";

const TestPage: NextPage = () => {
  return (
    <div>
      <Lottie
        loop
        animationData={lottieJson}
        play
        style={{ width: 1000, height: 1000 }}
      />
    </div>
  );
};

export default TestPage;
