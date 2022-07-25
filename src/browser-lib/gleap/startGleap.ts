import Gleap from "gleap";

declare global {
  interface Window {
    Gleap?: typeof Gleap;
  }
}

type GleapConfig = {
  widgetUrl: string;
  apiUrl: string;
  widgetId: string;
};
const startGleap = ({ widgetUrl, apiUrl, widgetId }: GleapConfig) => {
  window.Gleap = Gleap;
  window.Gleap.setWidgetUrl(widgetUrl);
  window.Gleap.setApiUrl(apiUrl);
  window.Gleap.initialize(widgetId);
};

export default startGleap;
