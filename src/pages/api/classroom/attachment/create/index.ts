import { NextApiRequest, NextApiResponse } from "next";
import { classroom } from "@googleapis/classroom";
import * as z from "zod";

import { getGoogleAuthClient } from "@/node-lib/classroom/google-auth";

const createAttachmentSchema = z.object({
  itemId: z.string(),
  courseId: z.string(),
  addOnToken: z.string(),
  loginHint: z.string(),
  title: z.string(),
  teacherViewUri: z.string(),
  studentViewUri: z.string(),
  studentWorkReviewUri: z.string().optional(),
  maxPoints: z.number().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authClient = getGoogleAuthClient(req.headers.authorization);

  const classroomApi = classroom({
    version: "v1",
    auth: authClient,
  });

  try {
    createAttachmentSchema.parse(JSON.parse(req.body));
  } catch (error) {
    res.status(500).send({ message: "Request body is invalid", error });
  }

  const body = JSON.parse(req.body);

  const {
    itemId,
    courseId,
    addOnToken,
    // loginHint, // will use this in non-spike to handle any needed refreshes
    title,
    teacherViewUri,
    studentViewUri,
    studentWorkReviewUri,
    maxPoints,
  } = body;

  classroomApi.courses.courseWork.addOnAttachments.create({
    itemId,
    courseId,
    addOnToken,
    requestBody: {
      title,
      maxPoints,
      teacherViewUri: { uri: `${process.env.NEXTAUTH_URL}${teacherViewUri}` },
      studentViewUri: { uri: `${process.env.NEXTAUTH_URL}${studentViewUri}` },
      studentWorkReviewUri: studentWorkReviewUri && {
        uri: `${process.env.NEXTAUTH_URL}${studentWorkReviewUri}`,
      },
    },
  });
}
