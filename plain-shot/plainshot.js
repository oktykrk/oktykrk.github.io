(() => {
  "use strict";
  const hero = document.querySelector("#hero-demo");
  const motion = document.querySelector("#motion-toggle");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const steps = ["capture", "annotate", "pixelate", "keep"];
  const descriptions = [
    "Drag a region, click a window, or select your desktop.",
    "Point to a detail, then add a little context.",
    "Pixelate the part you don’t want in the finished image.",
    "Finish with a PNG in local history. Copy or save it wherever you choose.",
  ];
  let current = 0;
  let playing = !reduced.matches;
  let visible = false;
  let timer = null;
  function renderStep(index) {
    current = index;
    hero.dataset.step = steps[index];
    document.querySelectorAll("[data-step-choice]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.stepChoice === steps[index]),
      );
    });
    document.querySelector("#step-description").textContent =
      descriptions[index];
  }
  function syncPlayback() {
    clearTimeout(timer);
    const running = playing && visible && !document.hidden;
    hero.dataset.running = String(running);
    motion.textContent = playing ? "Pause Ⅱ" : "Play ↗";
    motion.setAttribute(
      "aria-label",
      playing ? "Pause walkthrough" : "Play walkthrough",
    );
    if (running)
      timer = setTimeout(
        () => {
          renderStep((current + 1) % steps.length);
          syncPlayback();
        },
        current === 3 ? 4000 : 3400,
      );
  }
  motion.addEventListener("click", () => {
    playing = !playing;
    hero.dataset.manual = "false";
    syncPlayback();
  });
  document.querySelectorAll("[data-step-choice]").forEach((button, index) => {
    button.addEventListener("click", () => {
      playing = false;
      hero.dataset.manual = "true";
      renderStep(index);
      syncPlayback();
    });
  });
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    },
    { threshold: 0.15 },
  ).observe(hero);
  document.addEventListener("visibilitychange", syncPlayback);
  reduced.addEventListener("change", () => {
    if (reduced.matches) playing = false;
    syncPlayback();
  });
  syncPlayback();

  const tools = {
    select: [
      "Select & move",
      "V",
      "Grab an annotation to move it. Resize with the handles, or nudge with the arrow keys. Hold Shift for bigger steps.",
    ],
    arrow: [
      "Arrow",
      "A",
      "Point right at it. Drag either endpoint to change direction and length; scale the arrow from the toolbar.",
    ],
    line: [
      "Line",
      "L",
      "Connect two ideas, underline a detail, or add a clean divider. Adjust either endpoint and choose your stroke width.",
    ],
    text: [
      "Text",
      "T",
      "Add the missing context. Choose your color and text size. Double-click to edit; Shift + Return adds a new line.",
    ],
    rectangle: [
      "Rectangle",
      "R",
      "Put a frame around what matters. Drag the edges and handles to move or resize it, then adjust the stroke.",
    ],
    ellipse: [
      "Ellipse",
      "O",
      "Circle the detail that deserves a closer look. Change its color, thickness, and size directly on the capture.",
    ],
    draw: [
      "Draw",
      "D",
      "A quick sketch, a loose underline, a handwritten mark. Draw freely, then move or resize the stroke.",
    ],
    highlighter: [
      "Highlighter",
      "H",
      "Bring a phrase into focus without covering it up. Add a translucent stroke in your chosen color and width.",
    ],
    pixelate: [
      "Pixelate",
      "P",
      "Cover a selected area with pixelation before you copy or save. Resize the region to cover the detail you want to obscure.",
    ],
    number: [
      "Number",
      "N",
      "Turn a screenshot into a sequence. Place numbered markers, resize them, and double-click a marker to edit its value.",
    ],
  };
  const picker = document.querySelector(".tool-picker");
  const buttons = [...picker.querySelectorAll("button")];
  function selectTool(button) {
    const key = button.dataset.tool;
    const [name, shortcut, description] = tools[key];
    buttons.forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
    document.querySelector(".tool-preview").dataset.activeTool = key;
    document.querySelector("#tool-name").textContent = name;
    document.querySelector("#tool-key").textContent = shortcut;
    document.querySelector("#tool-description").textContent = description;
    document.querySelector("#tool-index").textContent =
      `${String(buttons.indexOf(button) + 1).padStart(2, "0")} / 10`;
  }
  buttons.forEach((button) =>
    button.addEventListener("click", () => selectTool(button)),
  );
  // Shortcuts are scoped to the focused tool picker; browser commands remain untouched.
  picker.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const shortcut = buttons.find(
      (button) =>
        tools[button.dataset.tool][1].toLowerCase() === event.key.toLowerCase(),
    );
    let target = shortcut;
    const index = buttons.indexOf(document.activeElement);
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      target = buttons[(index + 1) % buttons.length];
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      target = buttons[(index - 1 + buttons.length) % buttons.length];
    if (event.key === "Home") target = buttons[0];
    if (event.key === "End") target = buttons.at(-1);
    if (target) {
      event.preventDefault();
      target.focus();
      selectTool(target);
    }
  });
})();
