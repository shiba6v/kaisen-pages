/*
 * 「契約前の疑問と、確かめられる画面」のタブ切り替え。
 * JS が動かない環境では、すべての画面と説明が縦に並んだまま表示されます。
 * キーボード操作：←→↑↓ で前後の質問、Home / End で最初と最後。
 */
(() => {
  const tablist = document.querySelector("[data-tabs]");
  if (!tablist) return;

  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  if (panels.some((panel) => !panel)) return;

  // タブとして機能させるための属性をパネルに付ける
  panels.forEach((panel, index) => {
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tabs[index].id);
  });

  function select(index, { moveFocus = false } = {}) {
    tabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      panels[i].hidden = !isSelected;
    });
    if (moveFocus) tabs[index].focus();
  }

  function nextIndex(current, key) {
    const last = tabs.length - 1;
    switch (key) {
      case "ArrowRight":
      case "ArrowDown":
        return current === last ? 0 : current + 1;
      case "ArrowLeft":
      case "ArrowUp":
        return current === 0 ? last : current - 1;
      case "Home":
        return 0;
      case "End":
        return last;
      default:
        return null;
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(index));
    tab.addEventListener("keydown", (event) => {
      const next = nextIndex(index, event.key);
      if (next === null) return;
      event.preventDefault();
      select(next, { moveFocus: true });
    });
  });

  // 質問が縦に並ぶ幅と横に並ぶ幅で、支援技術に伝える向きを合わせる
  const horizontal = window.matchMedia("(min-width: 720px) and (max-width: 1079px)");
  function updateOrientation() {
    tablist.setAttribute("aria-orientation", horizontal.matches ? "horizontal" : "vertical");
  }
  horizontal.addEventListener("change", updateOrientation);
  updateOrientation();

  // #panel-guide のようなURLで開いたときは、その画面を表示する
  function selectFromHash() {
    const index = panels.findIndex((panel) => "#" + panel.id === window.location.hash);
    if (index >= 0) select(index);
    return index;
  }
  window.addEventListener("hashchange", selectFromHash);

  if (selectFromHash() < 0) select(0);

  document.documentElement.classList.add("js-tabs");
  tablist.hidden = false;
  document.querySelectorAll("[data-js-only]").forEach((element) => {
    element.hidden = false;
  });
})();
