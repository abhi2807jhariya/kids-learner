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
    const shortSide = Math.min(width, height);
    const longSide = Math.max(width, height);
    const isMobileLandscapeLayout = shortSide <= 767 && longSide <= 1024;
    const visibleWidth = isMobileLandscapeLayout ? shortSide : width;
    const visibleHeight = isMobileLandscapeLayout ? longSide : height;

    root.style.setProperty("--visible-width", `${visibleWidth}px`);
    root.style.setProperty("--visible-height", `${visibleHeight}px`);

    /*
      This does not rotate a phone physically. It rotates the complete page
      whenever the visible mobile viewport is portrait and 767px or narrower.
    */
    const shouldRotate = isMobileLandscapeLayout && height > width;
    body.classList.toggle("mobile-landscape-layout", isMobileLandscapeLayout);
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
