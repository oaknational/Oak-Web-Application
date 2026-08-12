type SizeConfig = {
  gridTemplateColumns: string[];
};

export const sizeConfig: Record<"sm" | "md", SizeConfig> = {
  sm: {
    gridTemplateColumns: ["repeat(4, 1fr)", "repeat(7, 1fr)", "repeat(8, 1fr)"],
  },
  md: {
    gridTemplateColumns: ["repeat(3, 1fr)", "repeat(5, 1fr)", "repeat(6, 1fr)"],
  },
};
