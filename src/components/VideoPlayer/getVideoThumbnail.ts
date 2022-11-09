export const getVideoThumbnail = (
  mainImage: string,
  thumbTime?: number | null
) => {
  return `https://image.mux.com/${mainImage}/thumbnail.png?width=400&height=200&fit_mode=smartcrop&time=${
    thumbTime ? thumbTime : 20
  }`;
};
