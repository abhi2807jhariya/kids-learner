(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;

  function getViewportSize() {
    const viewport = window.visualViewport;

    return {
      width: Math.round(viewport ? viewport.width : window.innerWidth),
      height: Math.round(viewport ? viewport.height : window.innerHeight),
    };
  }

  function updateMobileLayout() {
    const { width, height } = getViewportSize();

    root.style.setProperty("--visible-width", `${width}px`);
    root.style.setProperty("--visible-height", `${height}px`);

    /*
      This does not rotate a phone physically. It rotates the complete page
      whenever the visible mobile viewport is portrait and 767px or narrower.
    */
    const shouldRotate = width <= 767 && height > width;
    body.classList.toggle("mobile-portrait-rotate", shouldRotate);
  }

  function initialiseCards() {
    document.querySelectorAll(".category-card").forEach((card) => {
      card.addEventListener("pointerdown", () => card.classList.add("clicked"));

      const clearPressedState = () => card.classList.remove("clicked");
      card.addEventListener("pointerup", clearPressedState);
      card.addEventListener("pointercancel", clearPressedState);
      card.addEventListener("pointerleave", clearPressedState);
    });
  }

  updateMobileLayout();
  initialiseCards();

  window.addEventListener("resize", updateMobileLayout, { passive: true });
  window.addEventListener("orientationchange", updateMobileLayout, { passive: true });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateMobileLayout, { passive: true });
  }
})();
