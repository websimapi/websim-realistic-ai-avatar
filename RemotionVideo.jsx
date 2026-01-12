import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Face } from "./Face.jsx";
const RemotionVideo = ({ timeline }) => {
  const frame = useCurrentFrame();
  let currentOpenness = 0;
  const currentClip = timeline.find((clip) => frame >= clip.startFrame && frame < clip.startFrame + clip.durationInFrames);
  if (currentClip) {
    const localFrame = frame - currentClip.startFrame;
    const syllable = Math.sin(localFrame * 0.6);
    const chatter = Math.sin(localFrame * 1.5);
    const rawMovement = Math.abs(syllable * 0.6 + chatter * 0.4);
    const isPause = localFrame % 28 < 4;
    currentOpenness = isPause ? 0 : Math.min(0.7, rawMovement);
  } else {
    currentOpenness = Math.sin(frame * 0.05) * 0.02;
  }
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "black" }, children: [
    /* @__PURE__ */ jsxDEV(Face, { openness: currentOpenness }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 24,
      columnNumber: 7
    }),
    timeline.map((clip, i) => /* @__PURE__ */ jsxDEV(Sequence, { from: clip.startFrame, durationInFrames: clip.durationInFrames, children: [
      /* @__PURE__ */ jsxDEV(Audio, { src: clip.audioUrl }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 27,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "flex-end", alignItems: "center", paddingBottom: 150 }, children: /* @__PURE__ */ jsxDEV("div", { style: {
        background: clip.speaker === "user" ? "rgba(59, 130, 246, 0.4)" : "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(12px)",
        padding: "20px 40px",
        borderRadius: "30px",
        maxWidth: "85%",
        border: "1px solid rgba(255,255,255,0.2)",
        textAlign: "center"
      }, children: /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "32px", fontWeight: 600, color: "white", lineHeight: 1.4 }, children: clip.text }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 38,
        columnNumber: 16
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 29,
        columnNumber: 14
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 28,
        columnNumber: 11
      })
    ] }, i, true, {
      fileName: "<stdin>",
      lineNumber: 26,
      columnNumber: 9
    })),
    /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { pointerEvents: "none" }, children: /* @__PURE__ */ jsxDEV("div", { style: { position: "absolute", top: 40, right: 40, display: "flex", alignItems: "center", gap: 15 }, children: [
      /* @__PURE__ */ jsxDEV("div", { style: { width: 15, height: 15, background: "red", borderRadius: "50%", boxShadow: "0 0 10px red" } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 45,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV("span", { style: { color: "white", fontWeight: "bold", fontSize: 24, textTransform: "uppercase" }, children: "Replay" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 46,
        columnNumber: 11
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 44,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 43,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 23,
    columnNumber: 5
  });
};
export {
  RemotionVideo
};
