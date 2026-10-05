"use strict";

// This is a product illustration, not a recording. Keep the same windows alive
// across layouts so their contents reflow as their actual bounds change.
const desktop = document.querySelector(".desktop");
const layoutButtons = [...document.querySelectorAll(".layout-button")];
const playButton = document.querySelector(".play-demo");
const playLabel = playButton.querySelector("span");
const playIcon = playButton.querySelector("use");
const demoStatus = document.querySelector("#demo-status");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const layouts = {
  focus: "Everything in its place.",
  split: "Two windows. Side by side.",
  columns: "Three windows. Equal room.",
};
const timeline = [
  { at: 0, phase: "scattered", caption: "Start with a busy desktop." },
  { at: 1200, phase: "drag", caption: "Drag up to reveal Snap Bar." },
  { at: 2600, phase: "target", caption: "Choose a space for your window." },
  { at: 4000, phase: "snap", caption: "Let go. Right into place." },
  { at: 5200, phase: "assist", caption: "Snap Assist fills the next space." },
  { at: 6500, phase: "fill", caption: "One more window. Workspace complete." },
  { at: 8100, phase: "ready", caption: "Everything in its place." },
];
// Hold the completed workspace for two seconds before repeating the sequence.
const cycleDuration = timeline[timeline.length - 1].at + 2000;
let state = "ready";
let elapsed = 0;
let lastFrame = 0;
let frame = 0;
let currentStep = -1;
let inView = false;
let hasInteracted = false;
let hasAutoplayed = false;
let resumeWhenVisible = false;

function updatePlayButton() {
  let label = "See it in action";
  let accessibleLabel = "Play window snapping demo";
  let icon = "play-icon";
  if (reducedMotion.matches) {
    label =
      currentStep >= 0 && currentStep < timeline.length - 1
        ? "Next step"
        : "Step through demo";
    accessibleLabel = label + ": window snapping";
  } else if (state === "running") {
    label = "Pause demo";
    accessibleLabel = label;
    icon = "pause-icon";
  } else if (state === "paused") {
    label = "Resume demo";
    accessibleLabel = label;
  }
  playLabel.textContent = label;
  playButton.setAttribute("aria-label", accessibleLabel);
  playIcon.setAttribute("href", `#${icon}`);
}

function chooseLayout(layout) {
  desktop.dataset.layout = layout;
  layoutButtons.forEach((button) =>
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.layout === layout),
    ),
  );
}

function showStep(index) {
  if (index === currentStep) return;
  currentStep = index;
  desktop.dataset.phase = timeline[index].phase;
  demoStatus.textContent = timeline[index].caption;
}

function stopPlayback() {
  cancelAnimationFrame(frame);
  desktop
    .getAnimations({ subtree: true })
    .forEach((animation) => animation.cancel());
  resumeWhenVisible = false;
  state = "ready";
  elapsed = 0;
  currentStep = -1;
}

function tick(time) {
  if (state !== "running") return;
  elapsed = (elapsed + time - lastFrame) % cycleDuration;
  lastFrame = time;
  let index = 0;
  for (let i = 1; i < timeline.length; i++) {
    if (elapsed >= timeline[i].at) index = i;
  }
  showStep(index);
  frame = requestAnimationFrame(tick);
}

function startPlayback() {
  if (reducedMotion.matches) return;
  if (state !== "paused") {
    stopPlayback();
    chooseLayout("focus");
    showStep(0);
  }
  desktop.getAnimations({ subtree: true }).forEach((animation) => {
    if (animation.playState === "paused") animation.play();
  });
  state = "running";
  lastFrame = performance.now();
  updatePlayButton();
  frame = requestAnimationFrame(tick);
}

function pausePlayback() {
  if (state !== "running") return;
  cancelAnimationFrame(frame);
  state = "paused";
  desktop
    .getAnimations({ subtree: true })
    .forEach((animation) => animation.pause());
  updatePlayButton();
}

layoutButtons.forEach((button) => {
  button.addEventListener("click", () => {
    hasInteracted = true;
    stopPlayback();
    desktop.dataset.phase = "ready";
    chooseLayout(button.dataset.layout);
    demoStatus.textContent = layouts[button.dataset.layout];
    updatePlayButton();
  });
});

playButton.addEventListener("click", () => {
  hasInteracted = true;
  resumeWhenVisible = false;
  if (reducedMotion.matches) {
    chooseLayout("focus");
    showStep((currentStep + 1) % timeline.length);
    updatePlayButton();
  } else if (state === "running") {
    pausePlayback();
  } else {
    startPlayback();
  }
});

function syncVisibility() {
  const visible = inView && !document.hidden;
  if (!visible && state === "running") {
    pausePlayback();
    resumeWhenVisible = true;
  } else if (visible && resumeWhenVisible) {
    resumeWhenVisible = false;
    startPlayback();
  } else if (
    visible &&
    !hasAutoplayed &&
    !hasInteracted &&
    !reducedMotion.matches &&
    !navigator.connection?.saveData
  ) {
    hasAutoplayed = true;
    startPlayback();
  }
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.7;
      syncVisibility();
    },
    { threshold: [0, 0.7] },
  );
  observer.observe(document.querySelector(".workspace"));
}
document.addEventListener("visibilitychange", syncVisibility);
reducedMotion.addEventListener("change", () => {
  stopPlayback();
  desktop.dataset.phase = "ready";
  demoStatus.textContent = layouts[desktop.dataset.layout];
  updatePlayButton();
});
updatePlayButton();

// The visible divider and the native range input operate the same geometry.
// The range provides keyboard and screen-reader support without custom keys.
const range = document.querySelector("#resize-range");
const resizeWindows = document.querySelector(".resize-windows");
const divider = document.querySelector(".resize-divider");
const resizeValue = document.querySelector("#resize-value");

function resize(value) {
  const left = Math.max(30, Math.min(70, Math.round(Number(value))));
  range.value = String(left);
  range.setAttribute(
    "aria-valuetext",
    `Left window ${left}%, right window ${100 - left}%`,
  );
  resizeWindows.style.setProperty("--split", `${left}%`);
  resizeValue.textContent = `${left} / ${100 - left}`;
}
range.addEventListener("input", () => resize(range.value));
let dragging = false;
divider.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  dragging = true;
  divider.setPointerCapture(event.pointerId);
  range.focus({ preventScroll: true });
});
divider.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  const bounds = resizeWindows.getBoundingClientRect();
  resize(((event.clientX - bounds.left - 7) / (bounds.width - 14)) * 100);
});
for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
  divider.addEventListener(type, () => {
    dragging = false;
  });
}
