import { SerializedWebinar } from "../../../pages/webinars/[webinarSlug]";
import { portableTextFromString } from "../../__helpers__/cms";

export const mockWebinar = (webinar?: Partial<SerializedWebinar>) => ({
  title: "Test Webinar",
  slug: "test-webinar",
  date: "2020-04-14T13:00:00.000Z",
  hosts: [
    {
      name: "John Doe",
      id: "258663fa-bd73-4571-acdc-33da8f7d01be",
      image: {
        asset: {
          _id: "image-4a6f77eac16e072438fe3e95bf04ad07cd14600e-512x512-png",
          url: "https://cdn.sanity.io/images/cuvjke51/production/4a6f77eac16e072438fe3e95bf04ad07cd14600e-512x512.png",
        },
        hotspot: null,
      },
    },
  ],
  category: {
    title: "Oak updates",
    slug: "oak-updates",
  },
  summaryPortableText: portableTextFromString("Some info about the webinar"),
  video: {
    title: "Oak is evolving",
    video: {
      asset: {
        assetId: "yHfnlREULGomTLTAcdt3iybOa8kDC005UOXYrLE1qvaU",
        playbackId: "4zX2n02AxYTM4bhm4SvJnA5leiiZVgMMnHM8w4hesP4c",
        thumbTime: 2,
      },
    },
  },
  seo: null,
  id: "cc15a6ad-6a34-4a3f-b4cf-58721bb6b621",
  author: {
    name: "Jane Smith",
    id: "258663fa-bd73-4571-acdc-33da8f7d01be",
    image: {
      asset: {
        _id: "image-4a6f77eac16e072438fe3e95bf04ad07cd14600e-512x512-png",
        url: "https://cdn.sanity.io/images/cuvjke51/production/4a6f77eac16e072438fe3e95bf04ad07cd14600e-512x512.png",
      },
      hotspot: null,
    },
  },
  ...webinar,
});
