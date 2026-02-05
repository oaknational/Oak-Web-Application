import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await params;
  const webViewLink = `https://drive.google.com/file/d/${fileId}/view`;
  return NextResponse.redirect(webViewLink);
}
