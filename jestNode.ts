interface JestNodeJson {
  tagName: string; // 第一层 main tagName是dom名称
  event: Record<
    string,
    {
      name: string;
      isMutated: boolean;
      isCapture: boolean;
      isCatch: boolean;
      handler: string;
      id: number;
    }
  >;
  attrs: {
    // 例如 { name: 'class', value: 'custom-class' }
    name: string;
    value: string;
  }[];
  children: JestNodeJson[];
}

// {
//   tagName: "demo-block",
//   event: {
//   },
//   attrs: [
//   ],
//   children: [
//     {
//       tagName: "wx-view",
//       event: {
//       },
//       attrs: [
//         {
//           name: "class",
//           value: "custom-class demo-block smart-clearfix ",
//         },
//       ],
//       children: [
//         {
//           tagName: "smart-slider",
//           event: {
//             change: {
//               name: "change",
//               isMutated: false,
//               isCapture: false,
//               isCatch: false,
//               handler: "onChange",
//               id: 0,
//             },
//           },
//           attrs: [
//             {
//               name: "customClass",
//               value: "slider",
//             },
//           ],
//           children: [
//             {
//               tagName: "wx-view",
//               event: {
//                 tap: {
//                   name: "tap",
//                   isMutated: false,
//                   isCapture: false,
//                   isCatch: false,
//                   handler: "onClick",
//                   id: 3,
//                 },
//               },
//               attrs: [
//                 {
//                   name: "class",
//                   value: "custom-class smart-slider",
//                 },
//                 {
//                   name: "style",
//                   value: "\n          background: ;\n          height: ;\n        ",
//                 },
//               ],
//               children: [
//                 {
//                   tagName: "wx-view",
//                   event: {
//                   },
//                   attrs: [
//                     {
//                       name: "class",
//                       value: "smart-slider__bar",
//                     },
//                     {
//                       name: "style",
//                       value: "\n          width: 50%;\n          left: 0%;\n          top: 0;\n          \n        ; ",
//                     },
//                   ],
//                   children: [
//                     {
//                       tagName: "wx-view",
//                       event: {
//                         touchcancel: {
//                           name: "touchcancel",
//                           isMutated: false,
//                           isCapture: false,
//                           isCatch: false,
//                           handler: "onTouchEnd",
//                           id: 3,
//                         },
//                         touchend: {
//                           name: "touchend",
//                           isMutated: false,
//                           isCapture: false,
//                           isCatch: false,
//                           handler: "onTouchEnd",
//                           id: 3,
//                         },
//                         touchstart: {
//                           name: "touchstart",
//                           isMutated: false,
//                           isCapture: false,
//                           isCatch: false,
//                           handler: "onTouchStart",
//                           id: 3,
//                         },
//                         touchmove: {
//                           name: "touchmove",
//                           isMutated: false,
//                           isCapture: false,
//                           isCatch: true,
//                           handler: "onTouchMove",
//                           id: 3,
//                         },
//                       },
//                       attrs: [
//                         {
//                           name: "class",
//                           value: "smart-slider__button-wrapper-left",
//                         },
//                         {
//                           name: "data-index",
//                           value: 0,
//                         },
//                       ],
//                       children: [
//                         {
//                           tagName: "wx-view",
//                           event: {
//                           },
//                           attrs: [
//                             {
//                               name: "class",
//                               value: "smart-slider__button",
//                             },
//                           ],
//                           children: [
//                           ],
//                         },
//                       ],
//                     },
//                     {
//                       tagName: "wx-view",
//                       event: {
//                         touchcancel: {
//                           name: "touchcancel",
//                           isMutated: false,
//                           isCapture: false,
//                           isCatch: false,
//                           handler: "onTouchEnd",
//                           id: 3,
//                         },
//                         touchend: {
//                           name: "touchend",
//                           isMutated: false,
//                           isCapture: false,
//                           isCatch: false,
//                           handler: "onTouchEnd",
//                           id: 3,
//                         },
//                         touchstart: {
//                           name: "touchstart",
//                           isMutated: false,
//                           isCapture: false,
//                           isCatch: false,
//                           handler: "onTouchStart",
//                           id: 3,
//                         },
//                         touchmove: {
//                           name: "touchmove",
//                           isMutated: false,
//                           isCapture: false,
//                           isCatch: true,
//                           handler: "onTouchMove",
//                           id: 3,
//                         },
//                       },
//                       attrs: [
//                         {
//                           name: "class",
//                           value: "smart-slider__button-wrapper-right",
//                         },
//                         {
//                           name: "data-index",
//                           value: 1,
//                         },
//                       ],
//                       children: [
//                         {
//                           tagName: "wx-view",
//                           event: {
//                           },
//                           attrs: [
//                             {
//                               name: "class",
//                               value: "smart-slider__button",
//                             },
//                           ],
//                           children: [
//                           ],
//                         },
//                       ],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// }
