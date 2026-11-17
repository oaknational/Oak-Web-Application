import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

const TEACHER_JOURNEY_IMAGE_DIRECTORY = "v1788962879/teacher-journey";

export const getTeacherJourneyImageUrl = (imageName: string) =>
  getCloudinaryImageUrl(`${TEACHER_JOURNEY_IMAGE_DIRECTORY}/${imageName}`);
