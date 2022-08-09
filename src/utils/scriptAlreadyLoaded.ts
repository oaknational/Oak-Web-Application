const scriptAlreadyLoaded = (domain: string) => {
  const scripts = document.getElementsByTagName("script");
  return (
    Object.values(scripts).filter((scriptInfo) => {
      const src = scriptInfo.src || "";
      return src.match(domain);
    }).length > 0
  );
};

export default scriptAlreadyLoaded;
