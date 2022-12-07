import Gleap from "gleap";

declare global {
  interface Window {
    Gleap?: typeof Gleap;
  }
}

type GleapConfig = {
  apiKey: string;
  apiUrl: string;
  frameUrl: string;
};
const startGleap = ({ apiKey, apiUrl, frameUrl }: GleapConfig) => {
  window.Gleap = Gleap;
  window.Gleap.setFrameUrl(frameUrl);
  window.Gleap.setApiUrl(apiUrl);
  window.Gleap.initialize(apiKey);
};

export const hasLoaded = () => "Gleap" in window;

export default startGleap;
