import { PortableTextBlock } from "@portabletext/react";

import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";

export const mockPortableTextBlocks: PortableTextBlock[] = [
  {
    _key: "097a68d34883",
    markDefs: [],
    children: [
      {
        marks: [],
        text: "Use this KS3 and KS4 Eduqas English curriculum plan to support sequenced teaching in reading, writing and speaking. Aligned to the Eduqas GCSE specification, this curriculum helps pupils develop fluency in analysis and communication through a wide range of texts and topics.",
        _key: "4e7b5921e9960",
        _type: "span",
      },
    ],
    _type: "block",
    style: "normal",
  },
  {
    style: "normal",
    _key: "e068d634bd8e",
    markDefs: [],
    children: [
      {
        _type: "span",
        marks: [],
        text: "Threads like 'non-fiction reading and writing', 'nineteenth century literature', and 'modern literature: identity and community' help track how core skills develop.",
        _key: "f6065a0d8cca0",
      },
    ],
    _type: "block",
  },
  {
    markDefs: [],
    children: [
      {
        _key: "0a798c4db6810",
        _type: "span",
        marks: [],
        text: "Year 7 English curriculum",
      },
    ],
    level: 1,
    _type: "block",
    style: "normal",
    _key: "8657dc8354f7",
    listItem: "bullet",
  },
  {
    style: "normal",
    _key: "57900e2ccbef",
    listItem: "bullet",
    markDefs: [],
    children: [
      {
        _type: "span",
        marks: [],
        text: "Year 8 English curriculum",
        _key: "28dd9ebf1ff4",
      },
    ],
    level: 1,
    _type: "block",
  },
  {
    style: "normal",
    _key: "f1c99f0c129a",
    listItem: "bullet",
    markDefs: [],
    children: [
      {
        _type: "span",
        marks: [],
        text: "Year 9 English curriculum",
        _key: "f32a71948df4",
      },
    ],
    level: 1,
    _type: "block",
  },
  {
    _key: "f54fec9824b3",
    listItem: "bullet",
    markDefs: [],
    children: [
      {
        text: "Year 10 English curriculum",
        _key: "293500634970",
        _type: "span",
        marks: [],
      },
    ],
    level: 1,
    _type: "block",
    style: "normal",
  },
  {
    style: "normal",
    _key: "c250609382a9",
    listItem: "bullet",
    markDefs: [],
    children: [
      {
        _key: "c3ead58b71c7",
        _type: "span",
        marks: [],
        text: "Year 11 English curriculum",
      },
    ],
    level: 1,
    _type: "block",
  },
  {
    _type: "block",
    style: "normal",
    _key: "128990f60e05",
    markDefs: [],
    children: [
      {
        text: "You can find the full lesson resources for KS3 and KS4 Eduqas English and download all the resources you need for free.",
        _key: "c23fc2e02d180",
        _type: "span",
        marks: [],
      },
    ],
  },
];

export const mockSubject: SubjectPhasePickerData["subjects"][number] = {
  title: "English",
  slug: "english",
  keystages: [{ slug: "ks4", title: "KS4" }],
  phases: [],
  ks4_options: [],
};
