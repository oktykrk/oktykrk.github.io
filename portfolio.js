(() => {
  const desktop = document.querySelector(".desktop-preview");
  const descriptions = {
    focus: "Floe layout illustration: a large browser beside notes and files",
    split: "Floe layout illustration: browser and notes arranged side by side",
    columns:
      "Floe layout illustration: browser, notes, and files in three columns",
  };

  function selectButton(button) {
    for (const sibling of button.parentElement.querySelectorAll("button")) {
      sibling.setAttribute("aria-pressed", String(sibling === button));
    }
  }

  for (const button of document.querySelectorAll("[data-layout-choice]")) {
    button.addEventListener("click", () => {
      desktop.dataset.layout = button.dataset.layoutChoice;
      desktop.setAttribute(
        "aria-label",
        descriptions[button.dataset.layoutChoice],
      );
      selectButton(button);
    });
  }

  const cadreurScreens = {
    record: {
      src: "/video-take/media/screen-record.webp",
      alt: "Cadreur recording screen with a teleprompter over the camera preview",
      caption: "Find your words.\nKeep your rhythm.",
      number: "01",
    },
    edit: {
      src: "/video-take/media/screen-edit.webp",
      alt: "Cadreur editor with video takes and a timeline",
      caption: "Keep the good takes.\nMake them yours.",
      number: "02",
    },
    captions: {
      src: "/video-take/media/screen-captions.webp",
      alt: "Cadreur caption editor with text styling controls",
      caption: "Give every word\na place on screen.",
      number: "03",
    },
  };
  const padoScreens = {
    tools: {
      src: "/assets/portfolio/pado-tools.webp",
      alt: "Pado PDF tools screen with extract, merge, split, organize, and compress tools",
    },
    merge: {
      src: "/assets/portfolio/pado-merge.webp",
      alt: "Pado PDF merge screen with documents arranged in order for merging",
    },
  };

  function connectScreens(attribute, screens, imageId, onSelect) {
    const img = document.getElementById(imageId);
    for (const button of document.querySelectorAll(`[${attribute}]`)) {
      button.addEventListener("click", () => {
        const screen = screens[button.getAttribute(attribute)];
        img.src = screen.src;
        img.alt = screen.alt;
        selectButton(button);
        onSelect?.(screen);
      });
    }
  }
  connectScreens(
    "data-cadreur-screen",
    cadreurScreens,
    "cadreur-screen",
    (screen) => {
      document.getElementById("cadreur-caption").textContent = screen.caption;
      document.querySelector(".caption-index").textContent = screen.number;
    },
  );
  connectScreens("data-pado-screen", padoScreens, "pado-screen");
})();

// Switch between actual MediaRoll app screenshots.
document.querySelectorAll("[data-mediaroll-screen]").forEach((button) => {
  button.addEventListener("click", () => {
    const isCoast = button.dataset.mediarollScreen === "coast";
    const name = isCoast ? "coast" : "lake";
    const image = document.querySelector("#mr-preview-image");
    image.src = `/media-roll/media/viewer-${name}.webp`;
    image.alt = isCoast
      ? "Actual MediaRoll window with a coastal photo and its folder sidebar"
      : "Actual MediaRoll window showing the next photo, a sailboat on an alpine lake";
    document.querySelectorAll("[data-mediaroll-screen]").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
  });
});

// PlainShot's sample content illustrates two real annotation tools.
document.querySelectorAll("[data-plainshot-preview]").forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.plainshotPreview;
    const scene = document.querySelector(".ps-composition");
    scene.dataset.psPreview = mode;
    scene.querySelector("img").alt =
      mode === "annotate"
        ? "Illustrated project notes with an arrow pointing to a detail"
        : "Illustrated project notes with a pixelated sample email address";
    document.querySelectorAll("[data-plainshot-preview]").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
  });
});
