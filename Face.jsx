import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
const Face = ({ openness = 0 }) => {
  const maxJawDrop = 40;
  const jawTransform = openness * maxJawDrop;
  const interiorBrightness = 0.3 + openness * 0.7;
  const interiorScale = 0.85 + openness * 0.15;
  return /* @__PURE__ */ jsxDEV("div", { className: "relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none", children: /* @__PURE__ */ jsxDEV("div", { className: "relative w-full h-full max-w-[600px] flex items-center justify-center", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute z-0 w-[20%] h-[8%] top-[53.5%] left-[40%] pointer-events-none", children: /* @__PURE__ */ jsxDEV(
      "img",
      {
        src: "mouth_interior.png",
        className: "w-full h-full object-cover rounded-full",
        style: {
          filter: `brightness(${interiorBrightness})`,
          transform: `scale(${interiorScale})`
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 21,
        columnNumber: 12
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 20,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 z-10 pointer-events-none", children: /* @__PURE__ */ jsxDEV(
      "img",
      {
        src: "face_base.png",
        className: "w-full h-full object-contain",
        style: {
          clipPath: `polygon(0% 0%, 100% 0%, 100% 55.5%, 0% 55.5%)`
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 33,
        columnNumber: 11
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 32,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: "absolute inset-0 z-10 pointer-events-none will-change-transform",
        style: {
          transform: `translateY(${jawTransform}px)`
        },
        children: /* @__PURE__ */ jsxDEV(
          "img",
          {
            src: "face_base.png",
            className: "w-full h-full object-contain",
            style: {
              clipPath: `polygon(0% 55.5%, 100% 55.5%, 100% 100%, 0% 100%)`
            }
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 49,
            columnNumber: 11
          }
        )
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 43,
        columnNumber: 9
      }
    ),
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: "absolute z-20 w-[25%] h-[12px] top-[55%] left-[37.5%] pointer-events-none",
        style: {
          background: "#000",
          opacity: Math.max(0, 0.4 - openness * 3),
          filter: "blur(5px)"
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 59,
        columnNumber: 9
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 17,
    columnNumber: 7
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 16,
    columnNumber: 5
  });
};
export {
  Face
};
