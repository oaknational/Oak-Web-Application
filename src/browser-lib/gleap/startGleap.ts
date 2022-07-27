import Gleap from "gleap";

declare global {
  interface Window {
    Gleap?: typeof Gleap;
  }
}

type GleapConfig = {
  apiKey: string;
  apiUrl: string;
  widgetUrl: string;
};
const startGleap = ({ apiKey, apiUrl, widgetUrl }: GleapConfig) => {
  window.Gleap = Gleap;
  window.Gleap.setWidgetUrl(widgetUrl);
  window.Gleap.setApiUrl(apiUrl);
  window.Gleap.initialize(apiKey);
};

export const hasLoaded = () => "Gleap" in window;

export default startGleap;
