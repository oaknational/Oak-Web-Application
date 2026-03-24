"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";

type EYFSLessonGroupContextValue = {
  activeVideoSlug: string | null;
  toggleVideo: (slug: string) => void;
};

const eyfsLessonGroupContext =
  createContext<EYFSLessonGroupContextValue | null>(null);

export const EYFSLessonGroupProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeVideoSlug, setActiveVideoSlug] = useState<string | null>(null);

  const toggleVideo = useCallback((slug: string) => {
    setActiveVideoSlug((current) => (current === slug ? null : slug));
  }, []);

  const value = useMemo<EYFSLessonGroupContextValue>(
    () => ({
      activeVideoSlug,
      toggleVideo,
    }),
    [activeVideoSlug, toggleVideo],
  );

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
