declare global {
  interface Window {
    Gleap?: typeof import("gleap/index").default;
  }
}

type GleapConfig = {
  apiKey: string;
  apiUrl: string;
  widgetUrl: string;
};
const startGleap = async ({ apiKey, apiUrl, widgetUrl }: GleapConfig) => {
  const Gleap = (await import("gleap")).default;
  window.Gleap = Gleap;
  window.Gleap.setWidgetUrl(widgetUrl);
  window.Gleap.setApiUrl(apiUrl);
  window.Gleap.initialize(apiKey);
};

export const hasLoaded = () => "Gleap" in window;

export default startGleap;
