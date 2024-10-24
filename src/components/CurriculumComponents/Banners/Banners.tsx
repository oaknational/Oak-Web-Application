import { isCycleTwoEnabled } from "@/utils/curriculum/features";
import HomePageBanner from "@/components/CurriculumComponents/HomePageBanner";

export default function Banners() {
  const cycleTwoEnabled = isCycleTwoEnabled();

  return (
    <>
      {cycleTwoEnabled ? (
        <HomePageBanner
          background="lemon"
          newText="Subjects added"
          ctaText="See curriculum plans"
          page="curriculum-landing-page"
        />
      ) : null}
    </>
  );
}
