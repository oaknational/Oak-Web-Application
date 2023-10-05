import { Storage } from "@google-cloud/storage";

export async function getFileFromBucket(bucketName: string, fileName: string) {
  const storage = new Storage();

  try {
    const contents = await storage.bucket(bucketName).file(fileName).download();
    return contents.toString();
  } catch (err) {
    console.error(
      `Error fetching file: ${fileName} from bucket: ${bucketName}. Error: ${err}`,
    );
    return;
  }
}
