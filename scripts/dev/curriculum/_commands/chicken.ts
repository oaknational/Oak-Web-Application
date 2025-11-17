const pc = (size: number, char: string) => new Array(size).fill(char).join("");

export function buildBubble(lines: string[]) {
  const maxLength = Math.max(...lines.map((line) => line.length));
  const padding = 2;
  const size = maxLength + padding;
  const bubble = [
    ",-" + pc(size, "-") + "-.",
    ...lines.map((line) => {
      return [
        "|",
        pc(padding, " "),
        line,
        pc(maxLength - line.length + padding, " "),
        "|",
      ].join("");
    }),
    "`-" + new Array(size).fill("-").join("") + "-'",
  ];
  return bubble.join("\n");
}

const CHICKEN = `
    /"""/      
  <} O, ┗╗
   ┃    ┏╝
   ┃    ┃
`;

export function buildChicken(input: string) {
  const lines = input.split("\\n");
  const bubbleLines = buildBubble(lines).split("\n");
  const chickenLines = CHICKEN.split("\n");
  const bubbleSize = bubbleLines[0]!.length;

  for (let i = 4; i < bubbleLines.length; i++) {
    chickenLines.unshift("");
  }

  while (bubbleLines.length < chickenLines.length) {
    bubbleLines.push(pc(bubbleSize, " "));
  }

  const prePad = 2;
  const outLines = chickenLines.map((cl, index) => {
    return pc(prePad, " ") + bubbleLines[index] + cl;
  });

  return ["", ...outLines].join("\n");
}
