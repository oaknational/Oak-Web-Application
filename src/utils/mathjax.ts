import { mathjax } from "mathjax-full/js/mathjax";
import { TeX } from "mathjax-full/js/input/tex";
import { SVG } from "mathjax-full/js/output/svg";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html";
import { SerializedMmlVisitor } from "mathjax-full/js/core/MmlTree/SerializedMmlVisitor";
import { STATE } from "mathjax-full/js/core/MathItem";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const mathjaxDocument = mathjax.document("", {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new SVG({ fontCache: "local" }),
});

const visitor = new SerializedMmlVisitor();
const toMathML = (node: ReturnType<typeof mathjaxDocument.convert>) =>
  visitor.visitTree(node);

type ConvertToMmlOptions = {
  math: string;
  em?: number;
  ex?: number;
};
export default function convertToMml({
  math,
  em = 8,
  ex = 16,
}: ConvertToMmlOptions) {
  const mathML = math.replace(/^\$\$|\$\$$/g, "");

  // MathML conversion
  const mathMlOutput = toMathML(
    mathjaxDocument.convert(mathML, {
      em,
      ex,
      end: STATE.CONVERT,
      display: true,
    }),
  );

  // Image conversion
  const svg = adaptor.innerHTML(mathjaxDocument.convert(mathML, { em, ex }));

  // The <span/> is for screenreader and the <svg/> is for rendering
  // This copies the same method the client MathJax library uses
  return `<span style="display: inline-block; position: relative;">
    <span style="position: absolute; top: 0; left: 0; clip: rect(1px, 1px, 1px, 1px); user-select: none;">${mathMlOutput}</span>
    ${svg}
  </span>`;
}
