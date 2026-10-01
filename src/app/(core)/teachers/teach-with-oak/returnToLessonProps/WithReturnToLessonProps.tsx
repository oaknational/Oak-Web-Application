import { ReactNode, Suspense } from "react";

import { useReturnToLessonProps } from "./getReturnToLessonLink";

type ReturnToLessonProps = ReturnType<typeof useReturnToLessonProps>;

type WithReturnToLessonPropsOptions = {
  children: (props: ReturnToLessonProps) => ReactNode;
  fallback?: ReactNode;
};

const ReturnToLessonPropsContent = ({
  children,
}: Pick<WithReturnToLessonPropsOptions, "children">) => {
  const returnToLessonProps = useReturnToLessonProps();
  return children(returnToLessonProps);
};

// `useReturnToLessonProps` reads search params, so it must render under a suspense boundary
export const WithReturnToLessonProps = ({
  children,
  fallback = null,
}: WithReturnToLessonPropsOptions) => (
  <Suspense fallback={fallback}>
    <ReturnToLessonPropsContent>{children}</ReturnToLessonPropsContent>
  </Suspense>
);
