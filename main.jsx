import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { Face } from "./Face.jsx";
import { AudioManager, playSoundEffect } from "./audioManager.js";
import { Player } from "@websim/remotion/player";
import { RemotionVideo } from "./RemotionVideo.jsx";
import { Mic, Play, X, Loader2 } from "lucide-react";
const FPS = 30;
const App = () => {
  const [mode, setMode] = useState("live");
  const [status, setStatus] = useState("idle");
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [lastTranscript, setLastTranscript] = useState("");
  const [timeline, setTimeline] = useState([]);
  const audioManager = useRef(new AudioManager());
  const recognition = useRef(null);
  const animationFrame = useRef(null);
  const currentTimelineFrame = useRef(0);
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const sr = new webkitSpeechRecognition();
      sr.continuous = false;
      sr.interimResults = false;
      sr.lang = "en-US";
      sr.onerror = (e) => {
        console.error("Speech error", e);
        setStatus("idle");
      };
      sr.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setStatus("processing");
          playSoundEffect("beep_end.mp3");
          setLastTranscript(text);
          await handleConversation(text);
        }
      };
      recognition.current = sr;
    }
    const loop = () => {
      if (mode === "live") {
        const vol = audioManager.current.getVolume();
        setMouthOpenness((prev) => prev + (vol - prev) * 0.25);
      }
      animationFrame.current = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationFrame.current);
  }, [mode]);
  const handleConversation = async (userText) => {
    try {
      const userTts = await websim.textToSpeech({ text: userText, voice: "en-male" });
      const getDuration = (url) => new Promise((resolve) => {
        const a = new Audio(url);
        const timeout = setTimeout(() => resolve(2), 2e3);
        a.onloadedmetadata = () => {
          clearTimeout(timeout);
          resolve(a.duration);
        };
      });
      const userDur = await getDuration(userTts.url);
      const userFrames = Math.ceil(userDur * FPS);
      const userEvent = {
        speaker: "user",
        text: userText,
        audioUrl: userTts.url,
        startFrame: currentTimelineFrame.current,
        durationInFrames: userFrames
      };
      setTimeline((prev) => [...prev, userEvent]);
      currentTimelineFrame.current += userFrames + 15;
      const history = timeline.map((t) => ({
        role: t.speaker === "user" ? "user" : "assistant",
        content: t.text
      }));
      const completion = await websim.chat.completions.create({
        messages: [
          { role: "system", content: "You are a realistic digital human. Brief responses only. Max 2 sentences." },
          ...history,
          { role: "user", content: userText }
        ]
      });
      const aiText = completion.content;
      setLastTranscript(aiText);
      const aiTts = await websim.textToSpeech({ text: aiText, voice: "en-female" });
      setStatus("speaking");
      const response = await fetch(aiTts.url);
      const blob = await response.blob();
      await new Promise((resolve) => {
        audioManager.current.playBlob(blob, resolve);
      });
      setStatus("idle");
      const aiDur = await getDuration(aiTts.url);
      const aiFrames = Math.ceil(aiDur * FPS);
      const aiEvent = {
        speaker: "ai",
        text: aiText,
        audioUrl: aiTts.url,
        startFrame: currentTimelineFrame.current,
        durationInFrames: aiFrames
      };
      setTimeline((prev) => [...prev, aiEvent]);
      currentTimelineFrame.current += aiFrames + 15;
    } catch (e) {
      console.error(e);
      setStatus("idle");
    }
  };
  const startListening = useCallback(() => {
    if (status !== "idle") return;
    if (recognition.current) {
      try {
        setStatus("listening");
        playSoundEffect("beep_start.mp3");
        recognition.current.start();
      } catch (e) {
        setStatus("idle");
      }
    }
  }, [status]);
  const stopListening = useCallback(() => {
    if (status === "listening" && recognition.current) {
      try {
        recognition.current.stop();
      } catch (e) {
      }
    }
  }, [status]);
  if (mode === "replay") {
    return /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full bg-black relative flex flex-col", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setMode("live"),
          className: "absolute top-6 left-6 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all",
          children: /* @__PURE__ */ jsxDEV(X, { size: 24 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 158,
            columnNumber: 11
          })
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 154,
          columnNumber: 9
        }
      ),
      /* @__PURE__ */ jsxDEV(
        Player,
        {
          component: RemotionVideo,
          durationInFrames: Math.max(1, currentTimelineFrame.current),
          fps: FPS,
          compositionWidth: 1080,
          compositionHeight: 1920,
          inputProps: { timeline },
          style: { width: "100%", height: "100%" },
          controls: true,
          autoPlay: true,
          loop: true
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 160,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 153,
      columnNumber: 7
    });
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full flex flex-col relative bg-zinc-950", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 left-0 w-full p-6 flex justify-end items-start z-50", children: timeline.length > 0 && status === "idle" && /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: () => setMode("replay"),
        className: "bg-blue-600/90 hover:bg-blue-500 text-white pl-4 pr-5 py-2.5 rounded-full backdrop-blur-md flex items-center gap-2 shadow-lg transition-all",
        children: [
          /* @__PURE__ */ jsxDEV(Play, { size: 18, fill: "currentColor" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 184,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-bold tracking-wide", children: "REPLAY" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 185,
            columnNumber: 13
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 180,
        columnNumber: 11
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 178,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxDEV(Face, { openness: mouthOpenness }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 191,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-12 w-full px-8 text-center pointer-events-none", children: /* @__PURE__ */ jsxDEV("p", { className: "text-white text-xl font-light leading-relaxed drop-shadow-2xl", children: status === "listening" ? "Listening..." : status === "processing" ? "Thinking..." : status === "speaking" ? lastTranscript : lastTranscript || "Hold the mic to speak" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 193,
        columnNumber: 12
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 192,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 190,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "h-44 bg-gradient-to-t from-black to-transparent flex items-center justify-center relative z-40 pb-10", children: /* @__PURE__ */ jsxDEV(
      "button",
      {
        className: `
            w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200
            shadow-2xl border-4 
            ${status === "listening" ? "bg-red-500 border-red-400 scale-110 listening-pulse" : "bg-white border-zinc-300"}
            ${status === "processing" || status === "speaking" ? "opacity-30 scale-90" : ""}
          `,
        onPointerDown: startListening,
        onPointerUp: stopListening,
        onPointerLeave: stopListening,
        disabled: status === "processing" || status === "speaking",
        children: status === "processing" ? /* @__PURE__ */ jsxDEV(Loader2, { className: "animate-spin text-black", size: 40 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 215,
          columnNumber: 38
        }) : /* @__PURE__ */ jsxDEV(Mic, { size: 40, className: status === "listening" ? "text-white" : "text-black" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 215,
          columnNumber: 98
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 203,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 202,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 177,
    columnNumber: 5
  });
};
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 223,
  columnNumber: 13
}));
