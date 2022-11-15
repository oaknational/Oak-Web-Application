const formatDate = (date: string, options?: Intl.DateTimeFormatOptions) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
    ...options,
  });
};

export default formatDate;
