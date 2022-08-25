export const resolveInternalHref = (
    contentType: string,
    slug?: { current: string }
  ) => {
    let href;
    switch (contentType) {
      case "aboutCorePage":
        href = `/about`;
        break;
      case "planningCorePage":
        href = `/planning`;
        break;
      case "supportCorePage":
        href = `/support`;
        break;
      case "curriculumCorePage":
        href = `/curriculum`;
        break;
      case "webinar":
        if (slug) {
          href = `/webinars/${slug.current}`;
        }
        break;
      case "webinarListingPage":
        href = `/webinars`;
        break;
      case "newsPost":
        if (slug) {
          href = `/blog/${slug.current}`;
        }
        break;
      case "newsListingPage":
        href = `/blog`;
        break;
      case "policyPage":
        if (slug) {
          href = `/legal/${slug.current}`;
        }
        break;
    }
  
    if (!href) {
      throw new Error(`No URL found for content type ${contentType}`);
    }
  
    return href;
  };