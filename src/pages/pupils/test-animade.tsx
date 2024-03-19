import { NextPage } from "next";
import Lottie from "react-lottie-player";
import { Player } from "@lottiefiles/react-lottie-player";
import { OakFlex, OakHeading } from "@oaknational/oak-components";
import { useState } from "react";

import lottieJson from "../../lotties/lottie.json";

const TestPage: NextPage = () => {
  const [width, setWidth] = useState(150);
  const handleIncreaseSize = () => {
    setWidth((prevState) => prevState + 20);
  };
  const handleDecreaseSize = () => {
    setWidth((prevState) => prevState * 0.8);
  };
  return (
    <OakFlex $flexDirection={"column"} $alignItems={"center"}>
      <button type="button" onClick={handleIncreaseSize}>
        Increase size
      </button>
      <button type="button" onClick={handleDecreaseSize}>
        Decrease size
      </button>
      <OakHeading tag="h1">local asset</OakHeading>
      <Lottie loop animationData={lottieJson} play style={{ width }} />
      <OakHeading tag="h1">cloudinary asset loop</OakHeading>
      <Player
        src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/08_Ambient_HeadTilt_du99fc.json"
        className="player"
        loop
        autoplay
        style={{ width }}
      />
      <OakHeading tag="h1">cloudinary asset no loop</OakHeading>
      <Player
        src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/08_Ambient_HeadTilt_du99fc.json"
        className="player"
        autoplay
        style={{ width }}
      />
    </OakFlex>
  );
};

export default TestPage;
