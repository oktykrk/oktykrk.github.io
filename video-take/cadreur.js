(() => {
  "use strict";
  const root = document.documentElement;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const narrow = matchMedia("(max-width: 640px)");
  const translated = [...document.querySelectorAll("[data-i18n]")];
  const english = Object.fromEntries(
    translated.map((el) => [el.dataset.i18n, el.innerHTML]),
  );
  const languageButton = document.querySelector(".language-toggle");
  const accessibleAttributes = [
    ...document.querySelectorAll("[alt], [aria-label]"),
  ].flatMap((element) =>
    ["alt", "aria-label"]
      .filter((attribute) => element.getAttribute(attribute))
      .map((attribute) => ({
        element,
        attribute,
        original: element.getAttribute(attribute),
      })),
  );
  const appScreens = [...document.querySelectorAll(".app-phone img")].map(
    (image) => ({ image, original: image.getAttribute("src") }),
  );
  let language = "en";

  // Store only a language preference. The site uses no analytics or external scripts.
  function setLanguage(next, remember = false) {
    language = next === "tr" && window.CADREUR_TR ? "tr" : "en";
    root.lang = language;
    const dictionary = language === "tr" ? window.CADREUR_TR : english;
    translated.forEach((el) => {
      el.innerHTML = dictionary[el.dataset.i18n] || english[el.dataset.i18n];
    });
    accessibleAttributes.forEach(({ element, attribute, original }) => {
      element.setAttribute(
        attribute,
        language === "tr"
          ? window.CADREUR_TR_ATTRIBUTES?.[original] || original
          : original,
      );
    });
    appScreens.forEach(({ image, original }) => {
      image.setAttribute(
        "src",
        language === "tr" ? original.replace(".webp", "-tr.webp") : original,
      );
    });
    languageButton.innerHTML = `${language === "tr" ? "EN" : "TR"} <span aria-hidden="true">↗</span>`;
    languageButton.setAttribute(
      "aria-label",
      language === "tr" ? "İngilizceye geç" : "Türkçeye geç",
    );
    document.title =
      language === "tr"
        ? "Cadreur — Senin hikâyen. Senin ritmin."
        : "Cadreur — Your story. Your pace.";
    document
      .querySelectorAll(".app-store")
      .forEach((link) =>
        link.setAttribute(
          "aria-label",
          language === "tr"
            ? "Cadreur’ü App Store’dan indir"
            : "Download Cadreur on the App Store",
        ),
      );
    document
      .querySelector(".camera-scene")
      .setAttribute(
        "aria-label",
        language === "tr"
          ? "Teleprompter ile çekimin hareketli temsili"
          : "Animated illustration of recording with a teleprompter",
      );
    updatePreviewLabel();
    if (remember) {
      try {
        localStorage.setItem("cadreur-language", language);
      } catch {
        /* Storage can be unavailable in private browsers. */
      }
    }
  }
  languageButton.addEventListener("click", () =>
    setLanguage(language === "en" ? "tr" : "en", true),
  );

  const tabs = [...document.querySelectorAll(".workflow-tab")];
  const tablist = document.querySelector(".workflow-tabs");
  function activateTab(index, focus = false) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden =
        !active;
    });
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(index));
    tab.addEventListener("keydown", (event) => {
      const direction = narrow.matches
        ? ["ArrowLeft", "ArrowRight"]
        : ["ArrowUp", "ArrowDown"];
      let next;
      if (event.key === direction[0])
        next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === direction[1]) next = (index + 1) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        activateTab(next, true);
      }
    });
  });
  function updateTabOrientation() {
    tablist.setAttribute(
      "aria-orientation",
      narrow.matches ? "horizontal" : "vertical",
    );
  }
  narrow.addEventListener("change", updateTabOrientation);
  updateTabOrientation();

  const scene = document.querySelector(".camera-scene");
  const previewButton = document.querySelector(".preview-toggle");
  const timer = document.querySelector(".camera-timer");
  let wantsToPlay = !motion.matches;
  let sceneVisible = false;
  let frame = 0;
  let previousTime = null;
  let elapsed = 0;
  function updatePreviewLabel() {
    const label =
      language === "tr"
        ? wantsToPlay
          ? "Hareketli önizlemeyi duraklat"
          : "Hareketli önizlemeyi oynat"
        : wantsToPlay
          ? "Pause animated preview"
          : "Play animated preview";
    previewButton.setAttribute("aria-label", label);
    previewButton.setAttribute("aria-pressed", String(wantsToPlay));
    previewButton.title = label;
  }
  function tick(time) {
    if (previousTime !== null) elapsed += Math.min(time - previousTime, 100);
    previousTime = time;
    timer.textContent = `00:${String(Math.floor(elapsed / 1000) % 60).padStart(2, "0")}`;
    scene.style.setProperty(
      "--prompt-progress",
      `${Math.min((elapsed % 9000) / 60, 100)}%`,
    );
    frame = requestAnimationFrame(tick);
  }
  function syncPlayback() {
    cancelAnimationFrame(frame);
    previousTime = null;
    const running = wantsToPlay && sceneVisible && !document.hidden;
    scene.dataset.playing = String(running);
    if (running) frame = requestAnimationFrame(tick);
    updatePreviewLabel();
  }
  previewButton.addEventListener("click", () => {
    wantsToPlay = !wantsToPlay;
    syncPlayback();
  });
  document.addEventListener("visibilitychange", syncPlayback);
  const sceneObserver = new IntersectionObserver(
    (entries) => {
      sceneVisible = entries[0].isIntersecting;
      syncPlayback();
    },
    { threshold: 0.12 },
  );
  sceneObserver.observe(scene);

  const revealElements = [...document.querySelectorAll(".reveal")];
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  if (!motion.matches) {
    root.classList.add("motion-enabled");
    revealElements.forEach((el) => revealObserver.observe(el));
  }
  motion.addEventListener("change", () => {
    if (motion.matches) {
      wantsToPlay = false;
      root.classList.remove("motion-enabled");
      revealObserver.disconnect();
    }
    syncPlayback();
  });
  let savedLanguage;
  try {
    savedLanguage = localStorage.getItem("cadreur-language");
  } catch {
    /* Use the browser preference. */
  }
  setLanguage(
    savedLanguage ||
      (navigator.language.toLowerCase().startsWith("tr") ? "tr" : "en"),
  );
  document.getElementById("year").textContent = new Date().getFullYear();
})();
