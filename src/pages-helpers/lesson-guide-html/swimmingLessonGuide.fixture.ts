/**
 * A PE lesson guide ("Preparing for swimming") condensed from its
 * word/document.xml, as exported by Google Docs. The tables, merged cells,
 * headings, lists, links, images and text match the export; borders, shading,
 * fonts and spacing are left out. The helpers reproduce the export's quirks:
 * bold paragraph marks, words split across runs, spaces in runs of their own,
 * empty headings in spacer cells and list nesting shown only by indentation.
 */

const NAMESPACES = [
  `xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"`,
  `xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"`,
  `xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"`,
  `xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"`,
  `xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"`,
].join(" ");

const emptyRun = `<w:r><w:rPr><w:rtl w:val="0"/></w:rPr></w:r>`;
const t = (text: string) =>
  `<w:r><w:rPr><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">${text}</w:t></w:r>`;
const b = (text: string) =>
  `<w:r><w:rPr><w:b w:val="1"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">${text}</w:t></w:r>`;
const link = (rId: string, text: string) =>
  `<w:hyperlink r:id="${rId}"><w:r><w:rPr><w:color w:val="1155cc"/><w:u w:val="single"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">${text}</w:t></w:r></w:hyperlink>`;

const image = ({
  id,
  name,
  rId,
  alt,
  anchored = false,
}: {
  id: number;
  name: string;
  rId: string;
  alt?: string;
  anchored?: boolean;
}) => {
  const frame = anchored ? "wp:anchor" : "wp:inline";
  const position = anchored
    ? `<wp:simplePos x="0" y="0"/><wp:positionH relativeFrom="page"><wp:posOffset>9763125</wp:posOffset></wp:positionH><wp:positionV relativeFrom="page"><wp:posOffset>1010250</wp:posOffset></wp:positionV>`
    : "";
  const descr = alt ? ` descr="${alt}"` : "";
  return `<w:r><w:drawing><${frame} distB="114300" distT="114300" distL="114300" distR="114300">${position}<wp:extent cx="280988" cy="280988"/><wp:effectExtent b="0" l="0" r="0" t="0"/>${anchored ? "<wp:wrapNone/>" : ""}<wp:docPr${descr} id="${id}" name="${name}"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr${descr} id="0" name="${name}"/><pic:cNvPicPr preferRelativeResize="0"/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="280988" cy="280988"/></a:xfrm><a:prstGeom prst="rect"/></pic:spPr></pic:pic></a:graphicData></a:graphic></${frame}></w:drawing></w:r>`;
};

const videoIcon = (id: number, alt: string) =>
  image({ id, name: "image4.png", rId: "rId8", alt });
const CYCLE_VIDEO_ALT =
  "Click on this video icon to open the lesson's media page which, includes a video demonstration for the current learning cycle. ";

/** Paragraph marks are often bold in the export; that must not bold the text. */
const p = (...runs: string[]) =>
  `<w:p><w:pPr><w:widowControl w:val="0"/><w:rPr><w:b w:val="1"/><w:color w:val="222222"/></w:rPr></w:pPr>${runs.join("")}${emptyRun}</w:p>`;
const empty = `<w:p><w:pPr><w:rPr><w:sz w:val="2"/><w:szCs w:val="2"/></w:rPr></w:pPr>${emptyRun}</w:p>`;
const pageBreak = `<w:p><w:r><w:br w:type="page"/></w:r>${emptyRun}</w:p>`;

const heading = (level: 2 | 3, text: string, ...extraRuns: string[]) =>
  `<w:p><w:pPr><w:pStyle w:val="Heading${level}"/><w:spacing w:after="0" w:before="0" w:line="240" w:lineRule="auto"/><w:rPr><w:b w:val="1"/></w:rPr></w:pPr><w:bookmarkStart w:colFirst="0" w:colLast="0" w:name="_bookmark" w:id="0"/><w:bookmarkEnd w:id="0"/>${text ? b(text) : emptyRun}${extraRuns.join("")}</w:p>`;

const item = (numId: number, indent: number, ...runs: string[]) =>
  `<w:p><w:pPr><w:widowControl w:val="0"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="${numId}"/></w:numPr><w:ind w:left="${indent}" w:hanging="360"/><w:rPr><w:u w:val="none"/></w:rPr></w:pPr>${runs.join("")}</w:p>`;
const items = (numId: number, indent: number, texts: string[]) =>
  texts.map((text) => item(numId, indent, t(text))).join("");

const tc = (
  props: { span?: number; vMerge?: "restart" | "continue" },
  ...content: string[]
) => {
  const span = props.span ? `<w:gridSpan w:val="${props.span}"/>` : "";
  const vMerge = props.vMerge ? `<w:vMerge w:val="${props.vMerge}"/>` : "";
  return `<w:tc><w:tcPr>${span}${vMerge}<w:shd w:fill="auto" w:val="clear"/><w:vAlign w:val="top"/></w:tcPr>${content.join("") || empty}</w:tc>`;
};
const tr = (...cells: string[]) =>
  `<w:tr><w:trPr><w:cantSplit w:val="0"/><w:tblHeader w:val="0"/></w:trPr>${cells.join("")}</w:tr>`;
const tbl = (gridCols: number[], ...rows: string[]) =>
  `<w:tbl><w:tblPr><w:tblW w:w="15420.0" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblLook w:val="0600"/></w:tblPr><w:tblGrid>${gridCols.map((w) => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>${rows.join("")}</w:tbl>`;

/** The coloured stripe and empty heading at the left of each section. */
const sectionEdge = [tc({}), tc({}, heading(2, ""))];
const sectionEdgeStart = [
  tc({ vMerge: "restart" }),
  tc({ vMerge: "restart" }, heading(3, "")),
];
const sectionEdgeContinue = [
  tc({ vMerge: "continue" }),
  tc({ vMerge: "continue" }),
];
const sectionEdgeEnd = [tc({}), tc({}, heading(3, ""))];

const pageIcons = `<w:p><w:pPr><w:pStyle w:val="Heading3"/><w:rPr><w:sz w:val="2"/></w:rPr></w:pPr>${image({ id: 6, name: "image2.png", rId: "rId6", anchored: true })}${image({ id: 11, name: "image6.png", rId: "rId7", anchored: true })}${image({ id: 3, name: "image4.png", rId: "rId8", anchored: true })}${emptyRun}</w:p>`;

const overview = tbl(
  [7305, 3900, 990, 3165],
  tr(
    tc(
      { span: 2 },
      heading(3, "Lesson outcome"),
      p(
        t(
          "I can explain the whistle code and demonstrate safe entries and exits, how to",
        ),
        t(
          " regain footing to understand ground rules and key safety information before my first swimming les",
        ),
        t("son."),
      ),
    ),
    tc(
      { span: 2, vMerge: "restart" },
      p(
        b(" "),
        image({ id: 1, name: "image9.png", rId: "rId9", anchored: true }),
      ),
      heading(3, "Demo videos"),
      p(link("rId10", "oak.link/swi-3hsg")),
      heading(
        3,
        "",
        image({ id: 7, name: "image10.png", rId: "rId11", anchored: true }),
      ),
      heading(3, "Further guidance"),
      p(
        t("Refer to the"),
        t(" "),
        link("rId12", "C-STEP principles"),
        t(" "),
        t("for lesson adaptations."),
      ),
      p(
        emptyRun,
        image({ id: 8, name: "image3.png", rId: "rId13", anchored: true }),
      ),
      heading(3, "Risk assessment "),
      p(
        t("Carry out a "),
        link("rId14", "risk assessment"),
        t(" "),
        t(
          "before undertaking this lesson. Further support can be found in the afPE resource 'Safe Practice: in ",
        ),
        t("PESSPA"),
        t("’."),
      ),
    ),
  ),
  tr(
    tc(
      { span: 2 },
      heading(3, "Key learning points"),
      items(5, 357.1653543307087, [
        "Move: performing safe entry and exits, and regaining footing requires control and balance. ",
        "Move: front paddle arm action involves stretching the hand forwards. ",
        "Think: ensuring you have packed the correct equipment is key for swimming lessons. ",
        "Feel: always working hard and trying your best demonstrates self-motivation.",
        "Connect: swimming activities are important life skills requiring us to respect others as we increase water confidence.",
      ]),
    ),
    tc({ span: 2, vMerge: "continue" }),
  ),
  tr(
    tc(
      {},
      heading(3, "Keywords"),
      p(
        b("entry"),
        t(": a method of carefully and safely getting into the pool"),
        b(" "),
      ),
      p(
        b("expectations"),
        t(": what will happen in the future swimming lessons "),
      ),
      p(
        b("ground rules"),
        t(
          ": what must happen to keep people safe in the water and at the pool ",
        ),
      ),
    ),
    tc(
      {},
      heading(3, "Equipment"),
      items(7, 413.8582677165354, [
        "bench/gymnastics tables",
        "mat ",
        "different swimming kits",
        "bucket filled with water",
        "towel and whistle",
        "additional material",
      ]),
    ),
    tc({ span: 2, vMerge: "continue" }),
  ),
);

const separatorIcon = p(
  image({ id: 12, name: "image7.png", rId: "rId15", anchored: true }),
);

const starterQuizAndWarmUp = tbl(
  [240, 240, 5100, 5235, 3495, 1065],
  tr(
    ...sectionEdge,
    tc({}, heading(2, "Starter quiz")),
    tc({}, p(link("rId16", "How to practically deliver quizzes in PE"))),
    tc({}, heading(2, "Warm up")),
    tc(
      {},
      `<w:p><w:pPr><w:pStyle w:val="Heading2"/><w:jc w:val="right"/></w:pPr>${image(
        {
          id: 15,
          name: "image5.png",
          rId: "rId8",
          alt: "Click on this video icon to open the lesson's media page which, includes a video demonstration for the warm up activity.",
        },
      )}${emptyRun}</w:p>`,
    ),
  ),
  tr(
    tc({}),
    tc({}),
    tc(
      {},
      p(t("1. Who has been swimming"), t(" before?")),
      p(
        t("A. yes "),
        b("✓ "),
        t("  B. no "),
        b("✓"),
        t("   C. don’t k"),
        t("now"),
      ),
      empty,
      p(t("3. What will I need to dry myself after my swimming lesson?")),
      p(t("A. towel "), b("✓ "), t("  B. wet wipes   C. water bottle")),
    ),
    tc(
      {},
      p(t("2. How do we move around on poolside?")),
      p(t("A. fast   B. walking carefully "), b("✓"), t("   C. jumping")),
      empty,
      p(
        t(
          "4. Why is it important to listen carefully to the swimming teacher and follow instructions?",
        ),
      ),
      p(t("A. to win   B. to keep safe "), b("✓ "), t("  C. to be right")),
    ),
    tc(
      { span: 2 },
      p(
        t(
          "Use the warm up to check pupils’ prior knowledge of swimming movements. ",
        ),
        t(
          "Pupils imagine that their body is in the water and they are pulling the “water”. Pupils demonstrate the swimming actions they have done before or seen before.              ",
        ),
      ),
    ),
  ),
);

/**
 * A learning cycle: Explanation with Check for understanding below it,
 * Practice and Feedback beside them, and Adapt along the bottom.
 */
const learningCycle = ({
  gridCols,
  title,
  iconId,
  explanation,
  checkForUnderstanding,
  practice,
  feedback,
  adapt,
}: {
  gridCols: number[];
  title: string;
  iconId: number;
  explanation: string[];
  checkForUnderstanding: string[];
  practice: string[];
  feedback: string[];
  adapt: string[];
}) =>
  tbl(
    gridCols,
    tr(
      ...sectionEdge,
      tc({ span: 3 }, heading(2, title)),
      tc(
        {},
        `<w:p><w:pPr><w:jc w:val="right"/><w:rPr><w:sz w:val="4"/></w:rPr></w:pPr>${videoIcon(iconId, CYCLE_VIDEO_ALT)}${emptyRun}</w:p>`,
      ),
    ),
    tr(
      ...sectionEdgeStart,
      tc({}, heading(3, "Explanation"), empty, ...explanation),
      tc({ vMerge: "restart" }, ...practice),
      tc(
        { span: 2, vMerge: "restart" },
        heading(3, "Feedback"),
        empty,
        ...feedback,
      ),
    ),
    tr(
      ...sectionEdgeContinue,
      tc(
        { vMerge: "restart" },
        heading(3, "Check for understanding "),
        ...checkForUnderstanding,
      ),
      tc({ vMerge: "continue" }),
      tc({ span: 2, vMerge: "continue" }),
    ),
    tr(
      ...sectionEdgeEnd,
      tc({ vMerge: "continue" }),
      tc({ span: 3 }, heading(3, "Adapt"), ...adapt),
    ),
  );

const preparingForTheFirstLesson = learningCycle({
  gridCols: [240, 240, 7575, 5115, 1110, 1140],
  title: "Preparing for the first lesson",
  iconId: 10,
  explanation: [
    p(
      t(
        "Some of us may be new to swimming, so it's important we all know what to bring, what to",
      ),
      b(" expect"),
      t(" in our first lesson, and understand the "),
      b("ground rules"),
      t(". Swimming is fun, but we must also be aware of "),
      b("expectations"),
      t(
        ". Wearing the correct, well-fitting kit is essential, as inappropriate kit can hinder our learning and pose safety risks.",
      ),
    ),
    empty,
    p(
      t(
        "In order to be ready for our upcoming swimming sessions we need to pack our costume, hat, goggles and towel.",
      ),
    ),
    empty,
    p(
      t(
        "Front paddle arm action involves lifting the arm high over the water, stretching the hand forwards, with fingers together and pulling the water backwards.",
      ),
    ),
  ],
  practice: [
    heading(3, "Practice’ Equipment corners’ "),
    empty,
    items(6, 425.1968503937013, [
      "Moving around a sports hall or open space whilst demonstrating front paddle arms action, pupils move to the equipment/items they will need to put into their swimming bag. ",
      "Pupils put different items of clothing into a bucket of water and feel the weight of the clothing. They discuss with a partner why it might be difficult to swim wearing certain items of clothing and why it is important to have the correct kit for swimming. ",
      "Role play; pupils role play with a partner what activities can be done in the water. This role play can be based on prior swimming experience or photos, videos and books they have seen relating to swimming. ",
    ]),
    empty,
  ],
  feedback: [
    p(
      t(
        "Move: pupils can perform quality front paddle arm action by focusing on stretching their hands forwards ",
      ),
    ),
    empty,
    p(
      t(
        "Think: pupils can identify what they need to pack for their swimming lesson. .",
      ),
    ),
  ],
  checkForUnderstanding: [
    p(t("1. What day and times will we be swimming?")),
    p(b("✓"), t(" pupils identify the day and times they will be attending ")),
    empty,
    p(t("2. Show me: front paddle arm action")),
    p(b("✓ "), t("high arm lift/hands stretching forwards/fingers together ")),
  ],
  adapt: [
    p(
      b("↓"),
      t(" "),
      t("p"),
      t("upils move to the "),
      t("items"),
      t(" "),
      t("walking in their normal manner "),
    ),
    p(
      b("↑"),
      t(" "),
      t("p"),
      t("upils move to the "),
      t("items "),
      t(" using a front cr"),
      t("awl arm action "),
    ),
  ],
});

const expectationsAndGroundRules = learningCycle({
  gridCols: [240, 240, 8400, 3900, 1500, 1140],
  title: "Expectations and ground rules",
  iconId: 13,
  explanation: [
    p(
      t("You must be aware of the "),
      b("ground rules "),
      t("and "),
      b("expectations "),
      t(
        "before attending the pool for your first swimming lesson. It is important to know:",
      ),
    ),
    empty,
    item(
      3,
      425.19685039370086,
      t(
        "the whistle code at the pool and how to respond in an emergency situation",
      ),
    ),
    item(
      3,
      425.19685039370086,
      t("to exit the water safely and quickly when you hear the alarm "),
    ),
    item(
      3,
      425.19685039370086,
      t("when it is safe to "),
      b("enter"),
      t(" the pool and how to "),
      b("enter"),
      t(" the pool"),
    ),
    item(
      3,
      425.19685039370086,
      t("to wait until instructed to "),
      b("enter"),
      t(" the water "),
    ),
    item(
      3,
      425.19685039370086,
      t("to follow the instructions of how to safely "),
      b("enter"),
      t(" the water"),
    ),
    items(3, 425.19685039370086, [
      "how to exit the water safely and quickly in an emergency ",
      "when moving on poolside always walk carefully and slowly",
    ]),
    empty,
    p(
      t(
        "It is important to work hard and try your best in all activities within the ",
      ),
      b("ground rules"),
      t(" circuit; this demonstrates self-motivation. "),
    ),
  ],
  practice: [
    heading(3, "Practice ‘Whistle code game’"),
    empty,
    item(
      1,
      720,
      t("Pupils perform the "),
      b("ground rules "),
      t("whistle code game provide"),
      t("d on the ‘additional materials’"),
      t(". "),
    ),
    empty,
    empty,
  ],
  feedback: [
    p(
      t("Move: pupils can perform the correct "),
      b("entry"),
      t(" and exits which will be used during their first swimming lesson.  "),
    ),
    empty,
    p(t("Feel: pupils work hard, demonstrating self-motivation. ")),
    empty,
  ],
  checkForUnderstanding: [
    p(
      t("1. S"),
      t(
        "how me: how you would safely move on poolside and in the changing rooms at the swimming pool. ",
      ),
    ),
    p(b("✓ "), t("w"), t("alking slowly and carefully")),
    empty,
    p(
      t("2. Wh"),
      t("at should you do when you hear the emergency alarm at the pool?"),
    ),
    p(b("✓ "), t("exit the pool safely and quickly")),
  ],
  adapt: [
    p(
      b("↓"),
      t(" "),
      t("push up onto a bench with both hands to simulate an exit"),
    ),
    p(
      b("↑"),
      t(" "),
      t(
        "ask the pupils to use their ideas from gymnastic lessons to land safely after climbing up onto the horse",
      ),
    ),
  ],
});

const entriesExitsAndRegainingStanding = learningCycle({
  gridCols: [240, 240, 7095, 4965, 1740, 1140],
  title: "Entries, exits and regaining standing ",
  iconId: 2,
  explanation: [
    p(
      t(
        "Being able to regain a vertical position when you lose your footing during a swimming lesson is important to ensure that you do not end up face down and unable to stand up during the first lesson. ",
      ),
    ),
    empty,
    p(
      t(
        "Often if you lose your balance in the water on the first swimming lesson, you will try to put your hands down on the floor making regaining a standing position more difficult. It requires control to move from a horizontal position to standing in the water, by lifting the knees up to the chest, putting your head up and pulling back with your hands. ",
      ),
    ),
    empty,
    p(
      t(
        "An adapted burpee can be practised to work on the required motion to stand back up again. Respecting the space and ability of others is important when working in a group to increase water safety confidence. ",
      ),
    ),
  ],
  practice: [
    heading(3, "Practice - ‘Circuit’ "),
    empty,
    item(
      8,
      425.1968503937013,
      t(
        "Set up the room with mats, gymnastics benches and gymnastics tables. ",
      ),
    ),
    item(
      8,
      425.1968503937013,
      t("Use the ‘additional material’ "),
      t("to "),
      t("enable pupils to complete the following circuit activities:"),
    ),
    item(2, 720, t("safe "), b("entry")),
    items(2, 720, ["safe exit ", "kicking"]),
    items(8, 425.1968503937013, [
      "Pupils move around the circuit alternating between the 3 activities. ",
      "Regaining feet/standing from front; repeat this practice 10 times: pupils perform an adapted burpee;",
    ]),
    item(
      9,
      720,
      t("starting in a press up position pupils bend t"),
      t("heir knees under their chest"),
    ),
    items(9, 720, [
      "lift their head ",
      "pull back with their hands ",
      "stand up",
    ]),
    empty,
  ],
  feedback: [
    p(
      t("Move: "),
      t(
        "pupils perform the correct movement for regaining a standing position from a horizontal position on the front with control and balance. ",
      ),
    ),
    empty,
    p(
      t(
        "Connect: pupils show respect whilst working with others to increase their water safety confidence. ",
      ),
    ),
  ],
  checkForUnderstanding: [
    p(
      t("1. "),
      t(
        "Show me: what to do with your knees to regain a standing position from being laid on your front. ",
      ),
    ),
    p(b("✔ "), t("lift t"), t("he knees up")),
    empty,
    p(
      t("2. What do you want to avoid doing with your"),
      t(" hand if you lose balance?"),
    ),
    p(b("✔ "), t("putting them on the swimming pool floor")),
  ],
  adapt: [
    p(b("↓"), t(" "), t("r"), t("educe the number of burpees")),
    p(b("↑"), t(" "), t("i"), t("ncrease the number of burpees ")),
  ],
});

const coolDownAndExitQuiz = tbl(
  [240, 240, 4080, 4830, 5985],
  tr(
    ...sectionEdge,
    tc({}, heading(2, "Cool down")),
    tc({}, heading(2, "Exit quiz")),
    tc({}, heading(2, "")),
  ),
  tr(
    tc({}),
    tc({}),
    tc(
      {},
      p(t("Star float lay on the back on a mat:")),
      items(4, 425.19685039370086, [
        "feet are wide",
        "arms are wide",
        "palms of the hands are down on the mat",
        "relax and picture you are floating in nice warm water ",
      ]),
    ),
    tc(
      {},
      p(
        t("1. "),
        t("What should you do if"),
        t(" you hear 3 short blasts of a "),
        t("whistle in the pool?"),
        t(" "),
      ),
      p(b("✔"), t(" climb out")),
      empty,
      p(
        t("3"),
        t(". "),
        `<w:r><w:rPr><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">Which of the following will not help you regain a standing position if you have fallen in the water?</w:t><w:br w:type="textWrapping"/><w:t xml:space="preserve">A. hands on bottom </w:t></w:r>`,
        b("✔"),
        t("   "),
      ),
      p(t("B. tuck knees up")),
      p(t("C. pull water backwards")),
      empty,
    ),
    tc(
      {},
      p(
        t("2"),
        t(". To "),
        t("where should you move your knees to regain"),
        t(" a "),
        t("standing"),
        t(" "),
        t("position in the pool?"),
      ),
      p(t("A. head    B. chest "), b("✔"), t("   C. side")),
      empty,
      p(t("4. "), t("What is a safe entry to the water called?")),
      p(t("A. safe entry   B. slide entry   C. swivel entry "), b("✔")),
      empty,
    ),
  ),
);

export const swimmingLessonGuideDocumentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document ${NAMESPACES}>
  <w:body>
    ${pageIcons}
    ${overview}
    ${separatorIcon}
    ${starterQuizAndWarmUp}
    ${empty}${empty}${empty}
    ${preparingForTheFirstLesson}
    ${pageBreak}${empty}
    ${expectationsAndGroundRules}
    ${pageBreak}${empty}
    ${entriesExitsAndRegainingStanding}
    ${empty}${empty}
    ${coolDownAndExitQuiz}
    ${empty}
    <w:sectPr>
      <w:pgSz w:h="11909" w:w="16834" w:orient="landscape"/>
      <w:pgMar w:bottom="566.9291338582677" w:top="0" w:left="720.0000000000001" w:right="283.46456692913387" w:header="283.46456692913387" w:footer="170.07874015748033"/>
    </w:sectPr>
  </w:body>
</w:document>`;
