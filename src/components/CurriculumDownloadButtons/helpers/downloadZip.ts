import createAndClickHiddenDownloadLink from "../../DownloadComponents/helpers/createAndClickHiddenDownloadLink";

const downloadZip = async (keyStageNum: string, subject: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-${keyStageNum}-${subject}&tiers=core,higher,foundation`,
  );
  if (res.status >= 200 && res.status < 300) {
    const downloadLink = (await res.json()).data.url;
    createAndClickHiddenDownloadLink(downloadLink);
  } else {
    throw new Error("Resource does not exist");
  }
};

export default downloadZip;
