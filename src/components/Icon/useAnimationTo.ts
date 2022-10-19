import { useEffect, useState } from "react";

type AnimationStage =
  // 'pre' is before any animation takes place
  | "pre"
  // 'in' is when the animation as started, but the original icon is still displayed
  | "in"
  // 'out' is when the animation is ongoing, but the 'animateTo' icon is displayed
  | "out";
const ANIMATION_TRANSFORM_SCALE: Record<AnimationStage, string> = {
  pre: "scale(1)",
  in: "scale(0.5)",
  out: "scale(1)",
};
const ANIMATION_TRANSFORM_ROTATE: Record<AnimationStage, string> = {
  pre: "rotate(0)",
  in: "rotate(720deg)",
  out: "rotate(1440deg)",
};

type UseAnimateToProps = {
  shouldAnimate: boolean;
};
/**
 * useAnimationTo handles animation state for an icon when the 'animateTo' prop
 * is passed.
 */
const useAnimationTo = (props: UseAnimateToProps) => {
  const { shouldAnimate } = props;
  const [stage, setStage] = useState<AnimationStage>("pre");
  useEffect(() => {
    if (shouldAnimate) {
      setStage("in");
      const outTimerId = setTimeout(() => {
        setStage("out");
      }, 400);
      const backTimerId = setTimeout(() => {
        setStage("pre");
      }, 3400);
      return () => {
        clearTimeout(outTimerId);
        clearTimeout(backTimerId);
      };
    }
  }, [shouldAnimate]);
  return {
    rotate: ANIMATION_TRANSFORM_ROTATE[stage],
    scale: ANIMATION_TRANSFORM_SCALE[stage],
    stage,
  };
};

export default useAnimationTo;
