"use strict";
const desktop = document.querySelector(".desktop-demo");
const status = document.querySelector(".demo-status");
const descriptions = {
  focus: "Focus layout — room for your main task, with two windows alongside.",
  columns: "Three columns — three windows, side by side, with equal space.",
  stack: "Stacked layout — two windows above, one wide window below.",
};
document.querySelectorAll("[data-layout].layout-button").forEach((button) => {
  button.addEventListener("click", () => {
    const layout = button.dataset.layout;
    desktop.dataset.layout = layout;
    document.querySelectorAll(".layout-button").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    status.textContent = descriptions[layout];
  });
});
