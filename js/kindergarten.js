(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const card = document.querySelector(".kindergarten-card");

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
      The phone itself is not physically rotated. The complete page rotates
      whenever the visible viewport is portrait and 767px or narrower.
    */
    const shouldRotate = isMobileLandscapeLayout && height > width;
    body.classList.toggle("mobile-landscape-layout", isMobileLandscapeLayout);
    body.classList.toggle("mobile-portrait-rotate", shouldRotate);
  }

  function initialiseCard() {
    if (!card) return;

    card.addEventListener("pointerdown", () => card.classList.add("clicked"));

    const clearPressedState = () => card.classList.remove("clicked");
    card.addEventListener("pointerup", clearPressedState);
    card.addEventListener("pointercancel", clearPressedState);
    card.addEventListener("pointerleave", clearPressedState);
  }

  function initialisePage() {
    body.classList.add("page-ready");
    updateMobileLayout();
    initialiseCard();
  }

  initialisePage();

  window.addEventListener("resize", updateMobileLayout, { passive: true });
  window.addEventListener("orientationchange", updateMobileLayout, { passive: true });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateMobileLayout, { passive: true });
  }
})();
