import { OakIconName } from "@oaknational/oak-components";

import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

type SubjectIconName = Extract<OakIconName, `subject-${string}`>;
export type SubjectName = SubjectIconName extends `subject-${infer Name}`
  ? Name
  : never;

const subjectHeroAssets = {
  vocabulary:
    "v1768402226/subject-hero-illustrations/vocabulary-hero_x55ugz.svg",
  "understanding-world":
    "v1768402225/subject-hero-illustrations/understanding-world-hero_ue6lwv.svg",
  therapy: "v1768402224/subject-hero-illustrations/therapy-hero_dwgxsz.svg",
  spelling: "v1768402223/subject-hero-illustrations/spelling-hero_wbqu0d.svg",
  spanish: "v1768402222/subject-hero-illustrations/spanish-hero_dfno7c.svg",
  geography: "v1768402221/subject-hero-illustrations/geography-hero_jhette.svg",
  french: "v1768402220/subject-hero-illustrations/french-hero_t0m7yd.svg",
  english: "v1768402219/subject-hero-illustrations/english-hero_rrxdjq.svg",
  drama: "v1768402218/subject-hero-illustrations/drama-hero_bv5bfu.svg",
  "design-and-technology":
    "v1768402218/subject-hero-illustrations/design-and-technology-hero_wddke9.svg",
  computing: "v1768402217/subject-hero-illustrations/computing-hero_tvyuag.svg",
  citizenship:
    "v1768402215/subject-hero-illustrations/citizenship-hero_byazvo.svg",
  chemistry: "v1768402214/subject-hero-illustrations/chemistry-hero_zkcgyo.svg",
  biology: "v1768402213/subject-hero-illustrations/biology-hero_zlipll.svg",
  "art-and-design":
    "v1768402213/subject-hero-illustrations/art-and-design-hero_yqveur.svg",
  writing: "v1768402212/subject-hero-illustrations/writing-hero_jr6uxh.svg",
  RSHE: "v1768402211/subject-hero-illustrations/RSHE-hero_mtmgwj.svg",
  science: "v1768402211/subject-hero-illustrations/science-hero_o6utq6.svg",
  RE: "v1768402210/subject-hero-illustrations/RE-hero_curcwa.svg",
  physics: "v1768402209/subject-hero-illustrations/Physics-hero_v6jbvx.svg",
  "physical-development":
    "v1768402208/subject-hero-illustrations/physical-development-hero_fc0ubx.svg",
  PE: "v1768402207/subject-hero-illustrations/PE-hero_toj7ua.svg",
  oracy: "v1768402207/subject-hero-illustrations/oracy-hero_s6da2t.svg",
  numeracy: "v1768402226/subject-hero-illustrations/numeracy-hero_rr5aoy.svg",
  music: "v1768402225/subject-hero-illustrations/music-hero_oqm4ed.svg",
  maths: "v1768402225/subject-hero-illustrations/maths-hero_zyg7oy.svg",
  "independent-living":
    "v1768402224/subject-hero-illustrations/independent-living-hero_gwd8l1.svg",
  latin: "v1768402224/subject-hero-illustrations/latin-hero_aqdwwu.svg",
  history: "v1768402223/subject-hero-illustrations/history-hero_kcyxc1.svg",
  grammar: "v1768402223/subject-hero-illustrations/grammar-hero_lrcao3.svg",
  german: "v1768402222/subject-hero-illustrations/german-hero_m8xyuy.svg",
} as const;

export const subjectHeroImages: Record<SubjectName, string | null> = {
  art: subjectHeroAssets["art-and-design"],
  biology: subjectHeroAssets["biology"],
  chemistry: subjectHeroAssets["chemistry"],
  citizenship: subjectHeroAssets["citizenship"],
  "gcse-citizenship": subjectHeroAssets["citizenship"],
  "core-citizenship": subjectHeroAssets["citizenship"],
  "combined-science": subjectHeroAssets["science"],
  "communication-and-language": subjectHeroAssets["oracy"],
  computing: subjectHeroAssets["computing"],
  "computer-science": subjectHeroAssets["computing"],
  "core-computing": subjectHeroAssets["computing"],
  "computing-non-gcse": subjectHeroAssets["computing"],
  "cooking-nutrition": subjectHeroAssets["independent-living"],
  "creative-arts": subjectHeroAssets["art-and-design"],
  "design-technology": subjectHeroAssets["design-and-technology"],
  drama: subjectHeroAssets["drama"],
  english: subjectHeroAssets["english"],
  "english-language": subjectHeroAssets["english"],
  "english-grammar": subjectHeroAssets["grammar"],
  "english-handwriting": subjectHeroAssets["writing"],
  "english-reading-for-pleasure": subjectHeroAssets["english"],
  "english-spelling": subjectHeroAssets["spelling"],
  "english-reading-writing-oracy": subjectHeroAssets["oracy"],
  "english-vocabulary": subjectHeroAssets["vocabulary"],
  "expressive-arts-and-design": subjectHeroAssets["art-and-design"],
  "financial-education": subjectHeroAssets["numeracy"],
  french: subjectHeroAssets["french"],
  geography: subjectHeroAssets["geography"],
  german: subjectHeroAssets["german"],
  history: subjectHeroAssets["history"],
  "independent-living": subjectHeroAssets["independent-living"],
  latin: subjectHeroAssets["latin"],
  literacy: subjectHeroAssets["english"],
  maths: subjectHeroAssets["maths"],
  music: subjectHeroAssets["music"],
  numeracy: subjectHeroAssets["numeracy"],
  "personal-social-and-emotional-development": subjectHeroAssets["RSHE"],
  "physical-development": subjectHeroAssets["physical-development"],
  "physical-education": subjectHeroAssets["PE"],
  "core-physical-education": subjectHeroAssets["PE"],
  "gcse-physical-education": subjectHeroAssets["PE"],
  "physical-therapy": subjectHeroAssets["therapy"],
  physics: subjectHeroAssets["physics"],
  "religious-education": subjectHeroAssets["RE"],
  "core-religious-education": subjectHeroAssets["RE"],
  "gcse-religious-education": subjectHeroAssets["RE"],
  "rshe-pshe": subjectHeroAssets["RSHE"],
  rshe: subjectHeroAssets["RSHE"],
  philosophy: subjectHeroAssets["RE"],
  "social-science": subjectHeroAssets["RE"],
  theology: subjectHeroAssets["RE"],
  science: subjectHeroAssets["science"],
  "sensory-integration": subjectHeroAssets["therapy"],
  spanish: subjectHeroAssets["spanish"],
  "speech-and-language-therapy": subjectHeroAssets["therapy"],
  specialist: subjectHeroAssets["therapy"],
  therapy: subjectHeroAssets["therapy"],
  therapies: subjectHeroAssets["therapy"],
  "occupational-therapy": subjectHeroAssets["therapy"],
  "understanding-the-world": subjectHeroAssets["understanding-world"],
};

export type SubjectHeroImageName = keyof typeof subjectHeroImages;

export function getSubjectHeroImageUrl(subject: SubjectName) {
  const imageId = subjectHeroImages[subject];
  if (!imageId) {
    return null;
  }

  return getCloudinaryImageUrl(imageId);
}
