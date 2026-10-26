import { portableTextFromString } from "@/__tests__/__helpers__/cms";

export const basic = {
  title: "Our research team",
  members: [
    {
      name: "Reka Budai",
      bodyRaw: portableTextFromString(
        "Reka is a user researcher with 15+ years' experience, having worked in various education, non-profit and tech organisations in the UK and internationally. She enjoys understanding the day-to-day realities of teachers through qualitative and quantitative research and exploring how we could make our resources and tools more suitable for their needs and their pupils.",
      ),
      image: {
        asset: {
          url: "https://cdn.sanity.io/images/cuvjke51/production/1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422.png",
          _id: "image-1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422-png",
        },
      },
    },
    {
      name: "Laura Benton",
      bodyRaw: portableTextFromString(
        "Laura is a user researcher with an academic background and 15+ years experience conducting qualitative research with teachers and pupils to inform the design of digital education tools. Since joining Oak she has led research around the pupil experience, SEND and AI, and is also responsible for building research collaborations with academic partners.",
      ),
      image: {
        asset: {
          url: "https://cdn.sanity.io/images/cuvjke51/production/1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422.png",
          _id: "image-1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422-png",
        },
      },
    },
  ],
};

export const withThreeMembers = {
  title: "Our research team",
  members: [
    {
      name: "Reka Budai",
      bodyRaw: portableTextFromString(
        "Reka is a user researcher with 15+ years' experience, having worked in various education, non-profit and tech organisations in the UK and internationally. She enjoys understanding the day-to-day realities of teachers through qualitative and quantitative research and exploring how we could make our resources and tools more suitable for their needs and their pupils.",
      ),
      image: {
        asset: {
          url: "https://cdn.sanity.io/images/cuvjke51/production/1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422.png",
          _id: "image-1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422-png",
        },
      },
    },
    {
      name: "Laura Benton",
      bodyRaw: portableTextFromString(
        "Laura is a user researcher with an academic background and 15+ years experience conducting qualitative research with teachers and pupils to inform the design of digital education tools. Since joining Oak she has led research around the pupil experience, SEND and AI, and is also responsible for building research collaborations with academic partners.",
      ),
      image: {
        asset: {
          url: "https://cdn.sanity.io/images/cuvjke51/production/1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422.png",
          _id: "image-1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422-png",
        },
      },
    },
    {
      name: "Benton Laura",
      bodyRaw: portableTextFromString(
        "Laura is a user researcher with an academic background and 15+ years experience conducting qualitative research with teachers and pupils to inform the design of digital education tools. Since joining Oak she has led research around the pupil experience, SEND and AI, and is also responsible for building research collaborations with academic partners.",
      ),
      image: {
        asset: {
          url: "https://cdn.sanity.io/images/cuvjke51/production/1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422.png",
          _id: "image-1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422-png",
        },
      },
    },
  ],
};
