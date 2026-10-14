(() => {
  "use strict";
  const demo = document.querySelector(".demo");
  if (!demo) return;
  const $ = (selector) => demo.querySelector(selector);
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const frames = [
    {
      phase: "finder",
      step: 0,
      cue: "Start with a folder in Finder.",
      symbol: "↖",
      caption: "Your photos and videos, right where you keep them.",
      duration: 2600,
    },
    {
      phase: "click",
      step: 1,
      cue: "Double-click one photo.",
      symbol: "↖",
      caption: "With MediaRoll set as the default, one double-click opens it.",
      duration: 1600,
    },
    {
      phase: "open",
      step: 1,
      src: "media/viewer-coast.webp",
      alt: "Actual MediaRoll window showing the opened coastal photo and its folder sidebar",
      cue: "The photo opens in MediaRoll.",
      symbol: "✓",
      caption: "One photo opens. The rest of its folder comes along.",
      duration: 2800,
    },
    {
      phase: "browse",
      step: 2,
      src: "media/viewer-lake.webp",
      alt: "Actual MediaRoll window showing the next photo, a lake, in the same folder",
      cue: "Press →. Next photo.",
      symbol: "→",
      caption: "No return to Finder. Just the right arrow, and the next photo.",
      duration: 2800,
    },
    {
      phase: "video",
      step: 2,
      src: "media/viewer-video.webp",
      alt: "Actual MediaRoll window showing the next file, a video, with native playback controls",
      cue: "Press → again. Now a video.",
      symbol: "→",
      caption: "Keep going. Photos and videos, together in the same folder.",
      duration: 3400,
    },
  ];
  const frameButtons = [...demo.querySelectorAll("[data-frame]")];
  const screen = $(".native-screen");
  const playFlow = $(".play-flow");
  let current = 0,
    timer,
    inView = false;
  let flowWanted = !motion.matches;
  let opening = false;
  frames
    .filter((f) => f.src)
    .forEach(({ src }) => {
      const image = new Image();
      image.src = src;
    });
  function show(index, announce = false) {
    current = Math.max(0, Math.min(frames.length - 1, index));
    const frame = frames[current];
    demo.dataset.phase = frame.phase;
    if (frame.src) {
      screen.src = frame.src;
      screen.alt = frame.alt;
    }
    $(".finder-open").tabIndex = current < 2 ? 0 : -1;
    $(".finder-capture").setAttribute("aria-hidden", String(current > 1));
    screen.setAttribute("aria-hidden", String(current < 2));
    $(".cue-text").textContent = frame.cue;
    $(".cue-symbol").textContent = frame.symbol;
    if (!motion.matches && current >= 2) {
      screen.animate(
        current === 2
          ? [
              { opacity: 0, transform: "scale(.93)" },
              { opacity: 1, transform: "scale(1)" },
            ]
          : [{ opacity: 0.5 }, { opacity: 1 }],
        { duration: 500, easing: "ease-out" },
      );
      $(".cue-symbol").animate(
        [
          { transform: "translateX(-6px)", background: "#d9562b" },
          { transform: "translateX(0)", background: "#363c31" },
        ],
        { duration: 700 },
      );
    }
    frameButtons.forEach((button, i) =>
      button.setAttribute("aria-pressed", String(i === frame.step)),
    );
    $("#demo-caption").textContent = frame.caption;
    $(".frame-number").textContent = `0${frame.step + 1} / 03`;
    $('[data-direction="-1"]').disabled = current === 0;
    $('[data-direction="1"]').disabled = current === frames.length - 1;
    if (announce) $("#demo-announcement").textContent = frame.cue;
  }
  function syncFlow() {
    clearTimeout(timer);
    const running = (flowWanted || opening) && inView && !document.hidden;
    demo.dataset.running = String(running);
    playFlow.setAttribute("aria-pressed", String(flowWanted));
    $(".flow-icon").textContent = flowWanted ? "Ⅱ" : "▶";
    $(".flow-label").textContent = flowWanted
      ? "Pause the flow"
      : "Replay the flow";
    if (running)
      timer = setTimeout(() => {
        const next = (current + 1) % frames.length;
        opening = false;
        show(next);
        syncFlow();
      }, frames[current].duration);
  }
  function stopFlow() {
    flowWanted = false;
    opening = false;
    syncFlow();
  }
  function selectFrame(index) {
    stopFlow();
    show(index, true);
    if (current === 1) {
      opening = true;
      syncFlow();
    }
  }
  frameButtons.forEach((button, index) =>
    button.addEventListener("click", () => selectFrame([0, 1, 3][index])),
  );
  $(".finder-open").addEventListener("dblclick", () => selectFrame(1));
  $(".finder-open").addEventListener("click", (event) => {
    stopFlow();
    if (event.detail === 0 || matchMedia("(pointer: coarse)").matches)
      selectFrame(1);
  });
  demo
    .querySelectorAll("[data-direction]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        selectFrame(current + Number(button.dataset.direction)),
      ),
    );
  demo.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      selectFrame(current + (event.key === "ArrowRight" ? 1 : -1));
    } else if (event.key === "Escape") stopFlow();
  });
  demo.addEventListener("focusin", (event) => {
    if (event.target !== playFlow) stopFlow();
  });
  playFlow.addEventListener("click", () => {
    if (flowWanted) stopFlow();
    else {
      show(0);
      flowWanted = true;
      syncFlow();
    }
  });
  new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      syncFlow();
    },
    { threshold: 0.15 },
  ).observe(demo);
  document.addEventListener("visibilitychange", syncFlow);
  motion.addEventListener("change", () => {
    if (motion.matches) stopFlow();
  });
  show(0);
  syncFlow();

  const tools = {
    browse: [
      "MediaRoll’s actual folder browser with thumbnails beside a coastal photograph",
      "Your folder, with a view. Actual MediaRoll interface.",
    ],
    compare: [
      "MediaRoll comparing coastal and alpine photos side by side with linked zoom controls",
      "Two photos. One closer look. Actual MediaRoll interface.",
    ],
    edit: [
      "MediaRoll’s photo editor with crop, straighten, rotate, and flip controls",
      "Find your frame. Actual MediaRoll interface.",
    ],
    export: [
      "MediaRoll’s image export controls for format, size, and quality",
      "A fresh copy, ready to share. Actual MediaRoll interface.",
    ],
  };
  document.querySelectorAll("[data-tool]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.tool;
      document
        .querySelectorAll("[data-tool]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      const image = document.querySelector("#tool-image");
      image.src = `media/app-${key}.webp`;
      image.alt = tools[key][0];
      document.querySelector("#tool-caption").textContent = tools[key][1];
    });
  });
  function openLinkedAnswer() {
    if (location.hash === "#default-viewer")
      document.querySelector("#default-viewer").open = true;
  }
  document
    .querySelector('a[href="#default-viewer"]')
    .addEventListener("click", () => {
      document.querySelector("#default-viewer").open = true;
    });
  window.addEventListener("hashchange", openLinkedAnswer);
  openLinkedAnswer();
})();
