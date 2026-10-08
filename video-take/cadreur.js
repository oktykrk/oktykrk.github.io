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
  const previewVideo = document.querySelector(".creator-video");
  const previewPhoto = document.querySelector(".creator-photo");
  const soundButton = document.querySelector(".preview-sound");
  const previewDescription = document.querySelector(".preview-description");
  const timer = document.querySelector(".camera-timer");
  const videoSource = previewVideo.dataset.src;
  let videoReady = false;
  let videoRequested = false;
  let playbackRequest = 0;
  let wantsToPlay = !motion.matches;
  let sceneVisible = false;
  let frame = 0;
  let previousTime = null;
  let elapsed = 0;
  function updatePreviewLabel() {
    const type = videoReady ? "video" : "animated preview";
    const label =
      language === "tr"
        ? wantsToPlay
          ? videoReady
            ? "Videoyu duraklat"
            : "Hareketli önizlemeyi duraklat"
          : videoReady
            ? "Videoyu oynat"
            : "Hareketli önizlemeyi oynat"
        : wantsToPlay
          ? `Pause ${type}`
          : `Play ${type}`;
    previewButton.setAttribute("aria-label", label);
    previewButton.setAttribute("aria-pressed", String(wantsToPlay));
    previewButton.title = label;
    soundButton.hidden = !videoReady;
    soundButton.textContent =
      language === "tr"
        ? previewVideo.muted
          ? "Sesi aç"
          : "Sessize al"
        : previewVideo.muted
          ? "Hear her story"
          : "Mute";
    soundButton.setAttribute(
      "aria-label",
      language === "tr"
        ? previewVideo.muted
          ? "Videonun sesini aç"
          : "Videonun sesini kapat"
        : previewVideo.muted
          ? "Turn video sound on"
          : "Mute video",
    );
    soundButton.setAttribute("aria-pressed", String(!previewVideo.muted));
    scene.setAttribute(
      "aria-label",
      language === "tr"
        ? videoReady
          ? "Teleprompter ile çekim: İngilizce örnek video"
          : "Teleprompter ile çekimin hareketli temsili"
        : videoReady
          ? "Teleprompter recording: English sample video"
          : "Animated illustration of recording with a teleprompter",
    );
    previewDescription.textContent = videoReady
      ? language === "tr"
        ? "Örnek video · İngilizce"
        : "Sample video · English"
      : language === "tr"
        ? window.CADREUR_TR.illustratedPreview
        : english.illustratedPreview;
    document
      .querySelector(".teleprompter")
      .setAttribute("aria-hidden", String(!videoReady));
  }
  function tick(time) {
    if (videoReady) elapsed = previewVideo.currentTime * 1000;
    else if (previousTime !== null)
      elapsed += Math.min(time - previousTime, 100);
    previousTime = time;
    const seconds = Math.floor(elapsed / 1000);
    timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    const cycle =
      videoReady &&
      Number.isFinite(previewVideo.duration) &&
      previewVideo.duration > 0
        ? previewVideo.duration * 1000
        : 9000;
    scene.style.setProperty(
      "--prompt-progress",
      `${Math.min(((elapsed % cycle) / (cycle * 0.67)) * 100, 100)}%`,
    );
    frame = requestAnimationFrame(tick);
  }
  function syncPlayback() {
    const request = ++playbackRequest;
    cancelAnimationFrame(frame);
    previousTime = null;
    const running = wantsToPlay && sceneVisible && !document.hidden;
    if (running && videoSource && !videoRequested) {
      videoRequested = true;
      previewVideo.src = videoSource;
      previewVideo.load();
    }
    scene.dataset.playing = String(running);
    if (videoReady) {
      if (running) {
        previewVideo.play().catch(() => {
          if (request !== playbackRequest) return;
          wantsToPlay = false;
          syncPlayback();
        });
      } else previewVideo.pause();
    }
    if (running) frame = requestAnimationFrame(tick);
    updatePreviewLabel();
  }
  previewButton.addEventListener("click", () => {
    wantsToPlay = !wantsToPlay;
    syncPlayback();
  });
  previewVideo.addEventListener("loadeddata", () => {
    videoReady = true;
    previewVideo.hidden = false;
    previewPhoto.hidden = true;
    scene.dataset.video = "true";
    syncPlayback();
  });
  previewVideo.addEventListener("error", () => {
    videoReady = false;
    previewVideo.hidden = true;
    previewPhoto.hidden = false;
    previewVideo.muted = true;
    scene.dataset.video = "false";
    elapsed = 0;
    syncPlayback();
  });
  previewVideo.addEventListener("volumechange", updatePreviewLabel);
  soundButton.addEventListener("click", () => {
    if (previewVideo.muted) {
      previewVideo.currentTime = 0;
      previewVideo.muted = false;
      wantsToPlay = true;
      syncPlayback();
    } else previewVideo.muted = true;
    updatePreviewLabel();
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
