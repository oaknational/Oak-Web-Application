"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";

type EyfsLessonGroupContextValue = {
  activeVideoSlug: string | null;
  toggleVideo: (slug: string) => void;
};

const eyfsLessonGroupContext =
  createContext<EyfsLessonGroupContextValue | null>(null);

export const EyfsLessonGroupProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeVideoSlug, setActiveVideoSlug] = useState<string | null>(null);

  const toggleVideo = useCallback((slug: string) => {
    setActiveVideoSlug((current) => (current === slug ? null : slug));
  }, []);

  const value: EyfsLessonGroupContextValue = {
    activeVideoSlug,
    toggleVideo,
  };

  return (
    <eyfsLessonGroupContext.Provider value={value}>
      {children}
    </eyfsLessonGroupContext.Provider>
  );
};

export const useEyfsLessonGroupContext = () => {
  const context = useContext(eyfsLessonGroupContext);

  if (!context) {
    throw new Error(
      "useEyfsLessonGroupContext must be used within EyfsLessonGroupProvider",
    );
  }

  return context;
};
