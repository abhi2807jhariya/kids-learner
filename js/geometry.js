(() => {
  "use strict";

  const BASE = "assets/images/geometry/";

  const shapes = [
    { name: "Circle", file: "circle.png", detail: "circle/corner.png", cardColor: "#9edb24", cardShadow: "#55a716", speech: "A circle has zero straight sides and zero corners.", examples: [["circle/clock.png", "Clock"], ["circle/ball.png", "Ball"], ["circle/plate.png", "Plate"]] },
    { name: "Square", file: "square.png", detail: "square/corner.png", cardColor: "#338fe6", cardShadow: "#1761aa", speech: "A square has four equal sides and four corners.", examples: [["square/window.png", "Window"], ["square/gift-box.png", "Gift Box"], ["square/tile.png", "Tile"]] },
    { name: "Triangle", file: "triangle.png", detail: "triangle/corner.png", cardColor: "#f05f93", cardShadow: "#bd3768", speech: "A triangle has three sides and three corners.", examples: [["triangle/triangle.png", "Triangle"], ["triangle/corner.png", "Corners"], ["triangle.png", "Triangle Shape"]] },
    { name: "Rectangle", file: "rectangle.png", detail: "rectangle/corner.png", cardColor: "#ff9a25", cardShadow: "#d56c0c", speech: "A rectangle has four sides and four corners.", examples: [["rectangle/door.png", "Door"], ["rectangle/book.png", "Book"], ["rectangle/television.png", "Television"]] },
    { name: "Pentagon", file: "pentagon.png", detail: "pentagon/corner.png", cardColor: "#f48a26", cardShadow: "#be5e09", speech: "A pentagon has five sides and five corners.", examples: [["pentagon/home-plate.png", "Home Plate"], ["pentagon/badge.png", "Badge"], ["pentagon/pentagon-sign.png", "Pentagon Sign"]] },
    { name: "Hexagon", file: "hexagon.png", detail: "hexagon/corner.png", cardColor: "#ffd52b", cardShadow: "#d59e00", speech: "A hexagon has six sides and six corners.", examples: [["hexagon/honeycomb.png", "Honeycomb"], ["hexagon/nut.png", "Nut"], ["hexagon/hexagon-tile.png", "Hexagon Tile"]] },
    { name: "Oval", file: "oval.png", detail: "oval/corner.png", cardColor: "#35c8b6", cardShadow: "#159486", speech: "An oval has zero straight sides and zero corners.", examples: [["oval/egg.png", "Egg"], ["oval/watermelon.png", "Watermelon"], ["oval/balloon.png", "Balloon"]] },
    { name: "Star", file: "star.png", detail: "star/corner.png", cardColor: "#8f53e5", cardShadow: "#6234ad", speech: "A star has ten outline sides and ten corners.", examples: [["star/star-cookie.png", "Star Cookie"], ["star/star-wand.png", "Star Wand"], ["star/starfish.png", "Starfish"]] },
    { name: "Diamond", file: "diamond.png", detail: "diamond/corner.png", cardColor: "#2fc090", cardShadow: "#168561", speech: "A diamond has four sides and four corners.", examples: [["diamond/kite.png", "Kite"], ["diamond/gem.png", "Gem"], ["diamond/road-sign.png", "Road Sign"]] },
    { name: "Cube", file: "cube.png", detail: "cube/corner.png", cardColor: "#6fc63c", cardShadow: "#3c8d18", speech: "A cube has six faces, twelve edges, and eight corners.", examples: [["cube/dice.png", "Dice"], ["cube/ice-cube.png", "Ice Cube"], ["cube/toy-block.png", "Toy Block"]] }
  ];

  const root = document.documentElement;
  const body = document.body;
  const screens = [...document.querySelectorAll(".geometry-screen")];
  const shapeGrid = document.getElementById("shapeGrid");
  const objectCards = document.getElementById("objectCards");
  const detailInfographicImage = document.getElementById("detailInfographicImage");
  const objectsPanel = document.getElementById("detailObjectsPanel");

  let currentIndex = 0;
  let preferredVoice = null;
  let speechTimer = null;

  function viewportSize() {
    const viewport = window.visualViewport;
    return {
      width: Math.round(viewport ? viewport.width : window.innerWidth),
      height: Math.round(viewport ? viewport.height : window.innerHeight)
    };
  }

  function updateMobileLayout() {
    const { width, height } = viewportSize();
    root.style.setProperty("--visible-width", `${width}px`);
    root.style.setProperty("--visible-height", `${height}px`);
    body.classList.toggle("mobile-portrait-rotate", width <= 767 && height > width);
  }

  function loadPreferredVoice() {
    if (!("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    preferredVoice = voices.find((voice) =>
      /samantha|zira|female|google us english/i.test(`${voice.name} ${voice.voiceURI} ${voice.lang}`)
    ) || voices.find((voice) => /^en-US$/i.test(voice.lang))
      || voices.find((voice) => /^en/i.test(voice.lang))
      || voices[0]
      || null;
  }

  function speak(text) {
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    utterance.pitch = 1.4;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }

  function clearSpeechTimer() {
    if (speechTimer) window.clearTimeout(speechTimer);
    speechTimer = null;
  }

  const shapeSrc = (shape) => `${BASE}${shape.file}`;
  const detailSrc = (shape) => `${BASE}${shape.detail}`;

  function renderGrid() {
    shapeGrid.innerHTML = shapes.map((shape, index) => `
      <button class="shape-card" type="button" data-index="${index}"
        style="--card-color:${shape.cardColor};--card-shadow:${shape.cardShadow};--card-index:${index}"
        aria-label="Learn ${shape.name}">
        <img src="${shapeSrc(shape)}" alt="${shape.name}" draggable="false">
        <span>${shape.name}</span>
      </button>
    `).join("");

    shapeGrid.addEventListener("click", (event) => {
      const card = event.target.closest(".shape-card");
      if (!card) return;
      currentIndex = Number(card.dataset.index);
      openDetail();
    });
  }

  function renderObjects(shape) {
    document.getElementById("objectsTitle").textContent = `${shape.name} Objects`;
    document.getElementById("objectsSubtitle").textContent = "Tap an object to hear its name.";

    const shapeImage = document.getElementById("objectsShapeImage");
    shapeImage.src = shapeSrc(shape);
    shapeImage.alt = shape.name;

    objectsPanel.classList.remove("is-revealed");
    objectCards.innerHTML = shape.examples.map(([path, name], index) => `
      <button class="object-card" type="button" data-object-name="${name}" style="--delay:${index * 150}ms">
        <img class="object-image" src="${BASE}${path}" alt="${name}" loading="eager" draggable="false">
        <div class="object-name">${name}</div>
      </button>
    `).join("");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => objectsPanel.classList.add("is-revealed"));
    });
  }

  function showScreen(name) {
    const screenId = { grid: "shapeGridScreen", detail: "detailScreen" }[name];
    screens.forEach((screen) => {
      const active = screen.id === screenId;
      screen.hidden = !active;
      screen.classList.toggle("is-active", active);
    });
  }

  function openDetail() {
    clearSpeechTimer();
    window.speechSynthesis?.cancel();

    const shape = shapes[currentIndex];
    document.getElementById("detailTitle").textContent = shape.name;
    document.getElementById("detailSpeech").textContent = shape.speech;

    detailInfographicImage.src = detailSrc(shape);
    detailInfographicImage.alt = shape.speech;
    detailInfographicImage.classList.remove("is-entering");
    void detailInfographicImage.offsetWidth;
    detailInfographicImage.classList.add("is-entering");

    renderObjects(shape);
    showScreen("detail");
    speechTimer = window.setTimeout(() => speak(shape.speech), 350);
  }

  function changeShape(direction) {
    clearSpeechTimer();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    currentIndex =
      (currentIndex + direction + shapes.length) % shapes.length;

    openDetail();
  }

  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (actionButton?.dataset.action === "close") {
      clearSpeechTimer();
      window.speechSynthesis?.cancel();
      showScreen("grid");
      return;
    }

    const objectCard = event.target.closest(".object-card");
    if (objectCard) {
      speak(`${objectCard.dataset.objectName} is shaped like a ${shapes[currentIndex].name}.`);
    }
  });

  document.getElementById("gridSoundButton").addEventListener("click", () => {
    speak("Choose a shape. Tap a shape and discover.");
  });

  document.getElementById("detailSoundButton").addEventListener("click", () => {
    speak(shapes[currentIndex].speech);
  });

  document.getElementById("previousShapeButton").addEventListener("click", () => {
    changeShape(-1);
  });

  document.getElementById("nextShapeButton").addEventListener("click", () => {
    changeShape(1);
  });

  renderGrid();
  loadPreferredVoice();
  if ("speechSynthesis" in window) {
    window.speechSynthesis.addEventListener("voiceschanged", loadPreferredVoice);
  }
  updateMobileLayout();
  showScreen("grid");

  window.addEventListener("resize", updateMobileLayout, { passive: true });
  window.addEventListener("orientationchange", updateMobileLayout, { passive: true });
  window.visualViewport?.addEventListener("resize", updateMobileLayout, { passive: true });
})();
