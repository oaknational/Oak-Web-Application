/* eslint-disable  @typescript-eslint/no-explicit-any */
// too complex to add type for POC

const buildPrinciple = (principle: string) => {
  return {
    type: "element",
    name: "w:p",
    attributes: {
      "w14:paraId": "12930AB2",
      "w14:textId": "07BCE10B",
      "w:rsidR": "00AF348A",
      "w:rsidRDefault": "00B207DC",
    },
    elements: [
      {
        type: "element",
        name: "w:pPr",
        elements: [
          { type: "element", name: "w:ind", attributes: { "w:left": "0" } },
          {
            type: "element",
            name: "w:rPr",
            elements: [
              {
                type: "element",
                name: "w:color",
                attributes: { "w:val": "222222" },
              },
            ],
          },
        ],
      },
      {
        type: "element",
        name: "w:r",
        elements: [
          {
            type: "element",
            name: "w:rPr",
            elements: [
              { type: "element", name: "w:noProof" },
              {
                type: "element",
                name: "w:color",
                attributes: { "w:val": "222222" },
              },
            ],
          },
          // // This is the image element - Can't get this to work at the moment.
          // {
          //   type: "element",
          //   name: "w:drawing",
          //   elements: [
          //     {
          //       type: "element",
          //       name: "wp:anchor",
          //       attributes: {
          //         distT: "114300",
          //         distB: "114300",
          //         distL: "114300",
          //         distR: "114300",
          //         simplePos: "0",
          //         relativeHeight: "251681792",
          //         behindDoc: "1",
          //         locked: "0",
          //         layoutInCell: "1",
          //         hidden: "0",
          //         allowOverlap: "1",
          //         "wp14:anchorId": "6C8A2577",
          //         "wp14:editId": "0ACC446A",
          //       },
          //       elements: [
          //         {
          //           type: "element",
          //           name: "wp:simplePos",
          //           attributes: { x: "0", y: "0" },
          //         },
          //         {
          //           type: "element",
          //           name: "wp:positionH",
          //           attributes: { relativeFrom: "page" },
          //           elements: [
          //             {
          //               type: "element",
          //               name: "wp:posOffset",
          //               elements: [{ type: "text", text: "454250" }],
          //             },
          //           ],
          //         },
          //         {
          //           type: "element",
          //           name: "wp:positionV",
          //           attributes: { relativeFrom: "paragraph" },
          //           elements: [
          //             {
          //               type: "element",
          //               name: "wp:posOffset",
          //               elements: [{ type: "text", text: "-50165" }],
          //             },
          //           ],
          //         },
          //         {
          //           type: "element",
          //           name: "wp:extent",
          //           attributes: { cx: "399600", cy: "374400" },
          //         },
          //         {
          //           type: "element",
          //           name: "wp:effectExtent",
          //           attributes: { l: "0", t: "0", r: "0", b: "0" },
          //         },
          //         { type: "element", name: "wp:wrapNone" },
          //         {
          //           type: "element",
          //           name: "wp:docPr",
          //           attributes: { id: "49", name: "image6.png" },
          //           elements: [
          //             {
          //               type: "element",
          //               name: "a:extLst",
          //               attributes: {
          //                 "xmlns:a":
          //                   "http://schemas.openxmlformats.org/drawingml/2006/main",
          //               },
          //               elements: [
          //                 {
          //                   type: "element",
          //                   name: "a:ext",
          //                   attributes: {
          //                     uri: "{C183D7F6-B498-43B3-948B-1728B52AA6E4}",
          //                   },
          //                   elements: [
          //                     {
          //                       type: "element",
          //                       name: "adec:decorative",
          //                       attributes: {
          //                         "xmlns:adec":
          //                           "http://schemas.microsoft.com/office/drawing/2017/decorative",
          //                         val: "1",
          //                       },
          //                     },
          //                   ],
          //                 },
          //               ],
          //             },
          //           ],
          //         },
          //         { type: "element", name: "wp:cNvGraphicFramePr" },
          //         {
          //           type: "element",
          //           name: "a:graphic",
          //           attributes: {
          //             "xmlns:a":
          //               "http://schemas.openxmlformats.org/drawingml/2006/main",
          //           },
          //           elements: [
          //             {
          //               type: "element",
          //               name: "a:graphicData",
          //               attributes: {
          //                 uri: "http://schemas.openxmlformats.org/drawingml/2006/picture",
          //               },
          //               elements: [
          //                 {
          //                   type: "element",
          //                   name: "pic:pic",
          //                   attributes: {
          //                     "xmlns:pic":
          //                       "http://schemas.openxmlformats.org/drawingml/2006/picture",
          //                   },
          //                   elements: [
          //                     {
          //                       type: "element",
          //                       name: "pic:nvPicPr",
          //                       elements: [
          //                         {
          //                           type: "element",
          //                           name: "pic:cNvPr",
          //                           attributes: {
          //                             id: "49",
          //                             name: "image6.png",
          //                           },
          //                           elements: [
          //                             {
          //                               type: "element",
          //                               name: "a:extLst",
          //                               elements: [
          //                                 {
          //                                   type: "element",
          //                                   name: "a:ext",
          //                                   attributes: {
          //                                     uri: "{C183D7F6-B498-43B3-948B-1728B52AA6E4}",
          //                                   },
          //                                   elements: [
          //                                     {
          //                                       type: "element",
          //                                       name: "adec:decorative",
          //                                       attributes: {
          //                                         "xmlns:adec":
          //                                           "http://schemas.microsoft.com/office/drawing/2017/decorative",
          //                                         val: "1",
          //                                       },
          //                                     },
          //                                   ],
          //                                 },
          //                               ],
          //                             },
          //                           ],
          //                         },
          //                         {
          //                           type: "element",
          //                           name: "pic:cNvPicPr",
          //                           attributes: { preferRelativeResize: "0" },
          //                         },
          //                       ],
          //                     },
          //                     {
          //                       type: "element",
          //                       name: "pic:blipFill",
          //                       elements: [
          //                         {
          //                           type: "element",
          //                           name: "a:blip",
          //                           attributes: { "r:embed": "rId24" },
          //                         },
          //                         { type: "element", name: "a:srcRect" },
          //                         {
          //                           type: "element",
          //                           name: "a:stretch",
          //                           elements: [
          //                             { type: "element", name: "a:fillRect" },
          //                           ],
          //                         },
          //                       ],
          //                     },
          //                     {
          //                       type: "element",
          //                       name: "pic:spPr",
          //                       elements: [
          //                         {
          //                           type: "element",
          //                           name: "a:xfrm",
          //                           elements: [
          //                             {
          //                               type: "element",
          //                               name: "a:off",
          //                               attributes: { x: "0", y: "0" },
          //                             },
          //                             {
          //                               type: "element",
          //                               name: "a:ext",
          //                               attributes: {
          //                                 cx: "399600",
          //                                 cy: "374400",
          //                               },
          //                             },
          //                           ],
          //                         },
          //                         {
          //                           type: "element",
          //                           name: "a:prstGeom",
          //                           attributes: { prst: "rect" },
          //                           elements: [
          //                             { type: "element", name: "a:avLst" },
          //                           ],
          //                         },
          //                         { type: "element", name: "a:ln" },
          //                       ],
          //                     },
          //                   ],
          //                 },
          //               ],
          //             },
          //           ],
          //         },
          //         {
          //           type: "element",
          //           name: "wp14:sizeRelH",
          //           attributes: { relativeFrom: "margin" },
          //           elements: [
          //             {
          //               type: "element",
          //               name: "wp14:pctWidth",
          //               elements: [{ type: "text", text: "0" }],
          //             },
          //           ],
          //         },
          //         {
          //           type: "element",
          //           name: "wp14:sizeRelV",
          //           attributes: { relativeFrom: "margin" },
          //           elements: [
          //             {
          //               type: "element",
          //               name: "wp14:pctHeight",
          //               elements: [{ type: "text", text: "0" }],
          //             },
          //           ],
          //         },
          //       ],
          //     },
          //   ],
          // },
        ],
      },
      {
        type: "element",
        name: "w:r",
        attributes: { "w:rsidR": "00000000" },
        elements: [
          {
            type: "element",
            name: "w:rPr",
            elements: [
              {
                type: "element",
                name: "w:color",
                attributes: { "w:val": "222222" },
              },
            ],
          },
          {
            type: "element",
            name: "w:t",
            elements: [{ type: "text", text: principle }],
          },
        ],
      },
    ],
  };
};

export function subjectPrinciples(principles: string[]) {
  const principleElems: any[] = [];

  principles.forEach((principle) => {
    if (principle.trim() !== "") {
      principleElems.push(buildPrinciple(principle));
    }
  });

  return principleElems;
}
