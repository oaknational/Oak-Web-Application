import { createContext, Dispatch, FC, SetStateAction, useState } from "react";

type CategorySlug = string;
type Categories = {
  slug: CategorySlug;
  title: string;
}[];
type SelectedCategory = CategorySlug | null;
type BlogContext = {
  categories: Categories;
  selectedCategory: SelectedCategory;
  setSelectedCategory: Dispatch<SetStateAction<SelectedCategory>>;
};
export const blogContext = createContext<BlogContext | null>(null);

type BlogProviderProps = {
  categories: Categories;
};
export const BlogProvider: FC<BlogProviderProps> = ({
  children,
  categories,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory>(null);

  const value = {
    categories,
    selectedCategory,
    setSelectedCategory,
  };

  return <blogContext.Provider value={value}>{children}</blogContext.Provider>;
};

export default BlogProvider;
