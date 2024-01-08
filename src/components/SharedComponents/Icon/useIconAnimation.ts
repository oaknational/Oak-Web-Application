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
  /**
   * timeIn: time in ms for which the icon is scaling down in size (first icon displayed)
   */
  timeIn?: number;
  /**
   * timeOut: time in ms for which the icon is scaling up in size (second icon displayed)
   */
  timeOut?: number;
  /**
   * timeBack: time in ms before the icon reverts
   */
  timeBack?: number;
};
/**
 * useIconAnimation handles animation state for an icon when the 'animateTo' prop
 * is passed.
 */
const useIconAnimation = (props: UseAnimateToProps) => {
  const { shouldAnimate, timeIn = 400, timeOut = 400, timeBack = 3000 } = props;
  const [stage, setStage] = useState<AnimationStage>("pre");
  useEffect(() => {
    if (shouldAnimate) {
      setStage("in");
      const outTimerId = setTimeout(() => {
        setStage("out");
      }, timeIn);
      const backTimerId = setTimeout(() => {
        setStage("pre");
      }, timeOut + timeBack);
      return () => {
        clearTimeout(outTimerId);
        clearTimeout(backTimerId);
      };
    }
  }, [shouldAnimate, timeIn, timeOut, timeBack]);
  return {
    rotate: ANIMATION_TRANSFORM_ROTATE[stage],
    scale: ANIMATION_TRANSFORM_SCALE[stage],
    stage,
  };
};

export default useIconAnimation;
