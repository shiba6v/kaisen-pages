const choices = document.querySelectorAll("[data-screen]");
const preview = document.getElementById("preview");
for (const choice of choices) {
  choice.addEventListener("click", () => {
    for (const button of choices) button.setAttribute("aria-pressed", String(button === choice));
    preview.src = "assets/" + choice.dataset.screen + ".webp";
    preview.alt = choice.querySelector("span").textContent + "画面";
  });
}
