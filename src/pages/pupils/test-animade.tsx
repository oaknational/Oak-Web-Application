import { NextPage } from "next";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakLabel,
} from "@oaknational/oak-components";
import { useState } from "react";
// import { DotLottiePlayer } from "@dotlottie/react-player";

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
      <Player loop src={lottieJson} autoplay style={{ width }} />
      <OakHeading tag="h1">cloudinary asset loop</OakHeading>
      <Player
        src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/08_Ambient_HeadTilt_du99fc.json"
        className="player"
        loop
        autoplay
        style={{ width }}
        speed={0.25}
        controls={true}
      >
        {/* <Controls visible={true} buttons={["play", "frame"]} /> */}
      </Player>
      <OakHeading tag="h1">cloudinary asset no loop</OakHeading>
      <Player
        src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/08_Ambient_HeadTilt_du99fc.json"
        className="player"
        autoplay
        style={{ width }}
      />

      <OakHeading tag="h1">Json Files</OakHeading>
      <OakGrid>
        <OakGridArea $colSpan={[12, 6, 3]} $mh={"space-between-l"}>
          <OakFlex>
            <Player
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/json-animations/01_Intro_r9f7dr.json"
              className="player"
              loop
              autoplay
              style={{ width }}
              speed={1}
            >
              <Controls visible={true} buttons={["frame"]} />
            </Player>
          </OakFlex>
          <OakLabel>Intro</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <Player
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/json-animations/02_Outro_iahrg4.json"
              className="player"
              loop
              autoplay
              style={{ width }}
              speed={1}
            >
              <Controls visible={true} buttons={["frame"]} />
            </Player>
          </OakFlex>
          <OakLabel>Outro</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <Player
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/json-animations/03_Celebratory_Fanfare_kethqc.json"
              className="player"
              loop
              autoplay
              style={{ width }}
              speed={1}
            >
              <Controls visible={true} buttons={["frame"]} />
            </Player>
          </OakFlex>
          <OakLabel>Celebratory_Fanfare</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <Player
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/json-animations/04_Celebratory_Off_The_Scale_c7q7si.json"
              className="player"
              loop
              autoplay
              style={{ width }}
              speed={1}
            >
              <Controls visible={true} buttons={["frame"]} />
            </Player>
          </OakFlex>
          <OakLabel>Celebratory_Off_The_Scale</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <Player
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/json-animations/05_Something_Wrong_-_Encouraging_u6axt4.json"
              className="player"
              loop
              autoplay
              style={{ width }}
              speed={1}
            >
              <Controls visible={true} buttons={["frame"]} />
            </Player>
          </OakFlex>
          <OakLabel>Something_Wrong_-_Encouraging</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <Player
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/json-animations/06_Explaining_yu7xnx.json"
              className="player"
              loop
              autoplay
              style={{ width }}
              speed={1}
            >
              <Controls visible={true} buttons={["frame"]} />
            </Player>
          </OakFlex>
          <OakLabel>Explaining</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <Player
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/json-animations/07_Exercising_m14hif.json"
              className="player"
              loop
              autoplay
              style={{ width }}
              speed={1}
            >
              <Controls visible={true} buttons={["frame"]} />
            </Player>
          </OakFlex>
          <OakLabel>Exercising</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <Player
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/json-animations/08_Ambient_Head_Tilt_p8b5bl.json"
              className="player"
              loop
              autoplay
              style={{ width }}
              speed={1}
            >
              <Controls visible={true} buttons={["frame"]} />
            </Player>
          </OakFlex>
          <OakLabel>Ambient_Head_Tilt</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <Player
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/json-animations/09_Ambient_Face_k0ptmw.json"
              className="player"
              loop
              autoplay
              style={{ width }}
              speed={1}
            >
              <Controls visible={true} buttons={["frame"]} />
            </Player>
          </OakFlex>
          <OakLabel>Ambient_Face</OakLabel>
        </OakGridArea>
      </OakGrid>

      {/* <OakHeading tag="h1">Lotie Files</OakHeading>
      <OakGrid>
        <OakGridArea $colSpan={[12, 6, 3]} $mh={"space-between-l"}>
          <OakFlex>
            <DotLottiePlayer
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/01_Intro_qk9cya.lottie"
              autoplay
              loop
            />
          </OakFlex>
          <OakLabel>Intro</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <DotLottiePlayer
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/02_Outro_m7kguu.lottie"
              autoplay
              loop
            />
          </OakFlex>
          <OakLabel>Outro</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <DotLottiePlayer
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/03_Celebratory_Fanfare_bkamfs.lottie"
              autoplay
              loop
            />
          </OakFlex>
          <OakLabel>Celebratory_Fanfare</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <DotLottiePlayer
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/04_Celebratory_Off_The_Scale_h4soj0.lottie"
              autoplay
              loop
            />
          </OakFlex>
          <OakLabel>Celebratory_Off_The_Scale</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <DotLottiePlayer
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/05_Something_Wrong_-_Encouraging_v6nryd.lottie"
              autoplay
              loop
            />
          </OakFlex>
          <OakLabel>Something_Wrong_-_Encouraging</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <DotLottiePlayer
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/06_Explaining_zrg5qj.lottie"
              autoplay
              loop
            />
          </OakFlex>
          <OakLabel>Explaining</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <DotLottiePlayer
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/07_Exercising_avpugw.lottie"
              autoplay
              loop
            />
          </OakFlex>
          <OakLabel>Exercising</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <DotLottiePlayer
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/08_Ambient_Head_Tilt_bcefeg.lottie"
              autoplay
              loop
            />
          </OakFlex>
          <OakLabel>Ambient_Head_Tilt</OakLabel>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 6, 3]}>
          <OakFlex>
            <DotLottiePlayer
              src="https://res.cloudinary.com/oak-web-application/raw/upload/v1710780142/lotties/09_Ambient_Face_tiucju.lottie"
              autoplay
              loop
            />
          </OakFlex>
          <OakLabel>Ambient_Face</OakLabel>
        </OakGridArea>
      </OakGrid> */}
    </OakFlex>
  );
};

export default TestPage;
