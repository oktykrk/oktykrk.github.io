"use strict";

// Each illustration plays once on entry. Replay, pause, and direct choices
// belong to the visitor; nothing loops or keeps running outside the viewport.
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const demoControllers = [];
const windowLabels = {
  browser: ["Safari", "A little inspiration.", "◈"],
  finder: ["Finder", "Project files, in place.", "▤"],
  music: ["Music", "Something to focus to.", "♫"],
};
const screenDescriptions = {
  laptop: "Laptop: compact layouts with previews shaped to your display.",
  wide: "Ultrawide: wider previews and room for side-by-side windows.",
  portrait: "Portrait: taller previews and layouts for a vertical workspace.",
};
const demoDescriptions = {
  snap: [
    "Drag a window toward the top to reveal Snap Bar.",
    "Choose a region. Floe previews where your window will land.",
    "Release the window. It snaps into the selected region.",
  ],
  assist: [
    "Choose an open window for the upper-right region.",
    "One region filled. Pick another window for the space below.",
    "Your layout is filled. Everything is within reach.",
  ],
};

document.querySelectorAll("[data-demo]").forEach((story) => {
  const kind = story.dataset.demo;
  const control = story.querySelector(".demo-play");
  const status = story.querySelector(".motion-status");
  const candidates = [...story.querySelectorAll("[data-candidate]")];
  let timer = null;
  let running = false;
  let paused = false;
  let played = false;
  let phase = 0;
  let firstChoice = null;

  function label() {
    const text = motionPreference.matches
      ? "Next step"
      : running ? "Pause demo" : paused ? "Resume demo" : played ? "Replay demo" : "Play demo";
    control.textContent = text;
    control.setAttribute("aria-label", `${text}: ${kind === "screens" ? "display adaptation" : kind === "assist" ? "Snap Assist" : "Snap Bar"}`);
    story.classList.toggle("is-paused", paused);
  }

  function stop(preserve = false) {
    clearTimeout(timer);
    timer = null;
    paused = preserve && running;
    running = false;
    label();
  }

  function step(value, announce = false) {
    story.dataset.step = String(value);
    story.querySelectorAll("[data-story-step]").forEach((item) => {
      if (Number(item.dataset.storyStep) === value) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
    status.setAttribute("aria-live", announce ? "polite" : "off");
    if (kind !== "screens") status.textContent = demoDescriptions[kind][value];
  }

  function screen(value, announce = false) {
    story.dataset.screen = value;
    story.querySelectorAll("[data-screen-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.screenChoice === value));
    });
    story.querySelector(".display-size").textContent = {
      laptop: "16:10 / LAPTOP", wide: "21:9 / ULTRAWIDE", portrait: "9:16 / PORTRAIT",
    }[value];
    status.setAttribute("aria-live", announce ? "polite" : "off");
    status.textContent = screenDescriptions[value];
  }

  function fill(choice, announce = false) {
    const current = Number(story.dataset.step);
    if (current >= 2 || choice === firstChoice) return;
    const hadCandidateFocus = candidates.includes(document.activeElement);
    const [name, title, icon] = windowLabels[choice];
    const result = story.querySelector(current === 0 ? ".assist-result-top" : ".assist-result-bottom");
    result.querySelector(".result-name").textContent = name;
    result.querySelector(".result-title").textContent = title;
    result.querySelector(".placed-art > span").textContent = icon;
    if (current === 0) firstChoice = choice;
    candidates.forEach((button) => {
      button.hidden = button.dataset.candidate === firstChoice;
      button.removeAttribute("data-selected");
      button.setAttribute("aria-label", `Place ${windowLabels[button.dataset.candidate][0]} in the ${current === 0 ? "lower-right" : "next empty"} region`);
    });
    // Keep keyboard focus useful as chosen windows leave the candidate list.
    if (hadCandidateFocus) {
      (current === 1 ? control : candidates.find((button) => !button.hidden))
        .focus({ preventScroll: true });
    }
    step(current + 1, announce);
    story.querySelector(".assist-picker").inert = current === 1;
  }

  function reset() {
    firstChoice = null;
    step(0);
    if (kind === "screens") screen("laptop");
    if (kind === "assist") {
      story.querySelector(".assist-picker").inert = false;
      candidates.forEach((button) => {
        button.hidden = false;
        button.removeAttribute("data-selected");
        button.setAttribute("aria-label", `Place ${windowLabels[button.dataset.candidate][0]} in the upper-right region`);
      });
    }
  }

  const phases = kind === "assist" ? [
    () => reset(),
    () => candidates[0].setAttribute("data-selected", "true"),
    () => fill("browser"),
    () => candidates[1].setAttribute("data-selected", "true"),
    () => fill("finder"),
  ] : kind === "screens" ? [
    () => screen("laptop"), () => screen("wide"), () => screen("portrait"),
  ] : [() => step(0), () => step(1), () => step(2)];
  const delays = kind === "assist" ? [1600, 650, 1900, 650, 900] : [1900, 2300, 1400];

  function advance() {
    if (!running) return;
    if (phase >= phases.length) { stop(); return; }
    phases[phase]();
    const delay = delays[phase++];
    timer = setTimeout(advance, delay);
  }

  function play() {
    if (motionPreference.matches) {
      stop();
      played = true;
      if (kind === "screens") {
        const values = ["laptop", "wide", "portrait"];
        screen(values[(values.indexOf(story.dataset.screen) + 1) % values.length], true);
      } else if (kind === "assist") {
        if (Number(story.dataset.step) === 2) reset();
        else fill(firstChoice === "browser" ? "finder" : "browser", true);
      } else step((Number(story.dataset.step) + 1) % 3, true);
      label();
      return;
    }
    if (running) { stop(true); return; }
    if (!paused) { phase = 0; reset(); }
    played = true;
    paused = false;
    running = true;
    label();
    advance();
  }

  control.addEventListener("click", play);
  story.addEventListener("focusin", (event) => {
    if (event.target.matches("[data-candidate], [data-screen-choice]")) stop();
  });
  story.querySelector(".assist-picker")?.addEventListener("pointerenter", () => {
    if (running) stop();
  });
  candidates.forEach((button) => button.addEventListener("click", () => {
    stop();
    played = true;
    fill(button.dataset.candidate, true);
    label();
  }));
  story.querySelectorAll("[data-screen-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      stop();
      played = true;
      screen(button.dataset.screenChoice, true);
      label();
    });
  });
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) { if (running) stop(true); return; }
    if (!played && !motionPreference.matches && !document.hidden) play();
  }, { threshold: 0.35 });
  observer.observe(story);
  reset();
  label();
  demoControllers.push({ stop, label });
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) demoControllers.forEach((controller) => controller.stop(true));
});
motionPreference.addEventListener("change", () => {
  demoControllers.forEach((controller) => { controller.stop(); controller.label(); });
});
