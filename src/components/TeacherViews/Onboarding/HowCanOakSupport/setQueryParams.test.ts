import { renderHook } from "@testing-library/react";
import { useForm } from "react-hook-form";

import { setQueryParamsInOnboardingForm } from "./setQueryParams";

import { UseOfOakFormProps } from "@/components/TeacherComponents/OnboardingForm/OnboardingForm.schema";

describe("setQueryParams", () => {
  it("should set query params in onboarding form for manual school entry", () => {
    const { result } = renderHook(() => useForm<UseOfOakFormProps>());
    const query = {
      manualSchoolName: "Grange Hill",
      schoolAddress: "Grange Hill",
      newsletterSignUp: "false",
    };
    expect(result.current.getValues()).toEqual({});
    setQueryParamsInOnboardingForm(query, result.current.setValue);
    expect(result.current.getValues()).toEqual({
      manualSchoolName: "Grange Hill",
      newsletterSignUp: false,
      schoolAddress: "Grange Hill",
    });
  });
  it("should set query params in onboarding form for school picker", () => {
    const { result } = renderHook(() => useForm<UseOfOakFormProps>());
    const query = {
      schoolName: "Grange Hill",
      school: "Grange Hill",
      newsletterSignUp: "false",
    };
    expect(result.current.getValues()).toEqual({});
    setQueryParamsInOnboardingForm(query, result.current.setValue);
    expect(result.current.getValues()).toEqual({
      schoolName: "Grange Hill",
      newsletterSignUp: false,
      school: "Grange Hill",
    });
  });
});
