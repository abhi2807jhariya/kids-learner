const numbersData = [
  {
    number: 1,
    word: "One",
    color: "red",
    numberImg: "one.png",
    objectImg: "apple.png",
    objectName: "apple",
    objectPlural: "apples",
    count: 1
  },
  {
    number: 2,
    word: "Two",
    color: "orange",
    numberImg: "two.png",
    objectImg: "bird.png",
    objectName: "bird",
    objectPlural: "birds",
    count: 2
  },
  {
    number: 3,
    word: "Three",
    color: "yellow",
    numberImg: "three.png",
    objectImg: "star-object.png",
    objectName: "star",
    objectPlural: "stars",
    count: 3
  },
  {
    number: 4,
    word: "Four",
    color: "green",
    numberImg: "four.png",
    objectImg: "car.png",
    objectName: "car",
    objectPlural: "cars",
    count: 4
  },
  {
    number: 5,
    word: "Five",
    color: "blue",
    numberImg: "five.png",
    objectImg: "butterflies.png",
    objectName: "butterfly",
    objectPlural: "butterflies",
    count: 5
  },
  {
    number: 6,
    word: "Six",
    color: "purple",
    numberImg: "six.png",
    objectImg: "sunflowers.png",
    objectName: "sunflower",
    objectPlural: "sunflowers",
    count: 6
  },
  {
    number: 7,
    word: "Seven",
    color: "red",
    numberImg: "seven.png",
    objectImg: "balloon.png",
    objectName: "balloon",
    objectPlural: "balloons",
    count: 7
  },
  {
    number: 8,
    word: "Eight",
    color: "green",
    numberImg: "eight.png",
    objectImg: "cake.png",
    objectName: "cupcake",
    objectPlural: "cupcakes",
    count: 8
  },
  {
    number: 9,
    word: "Nine",
    color: "blue",
    numberImg: "nine.png",
    objectImg: "ball.png",
    objectName: "ball",
    objectPlural: "balls",
    count: 9
  },
  {
    number: 10,
    word: "Ten",
    color: "purple",
    numberImg: "ten.png",
    objectImg: "pencil.png",
    objectName: "pencil",
    objectPlural: "pencils",
    count: 10
  }
];

const countingWords = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten"
];

const basePath = "assets/images/number/";

/* =========================================
   ELEMENTS
========================================= */

const grid = document.getElementById("numbersGrid");
const root = document.documentElement;
const numbersMain =
  document.querySelector(".numbers-main");

const modal = document.getElementById("numberModal");
const closeBtn = document.getElementById("numberClose");

const previousBtn = document.getElementById("numberPrev");
const nextBtn = document.getElementById("numberNext");

const modalProgress = document.getElementById("modalProgress");

const modalNumberImg = document.getElementById("modalNumberImg");
const numberWord = document.getElementById("numberWord");
const sayNumberWord = document.getElementById("sayNumberWord");

const animatedObjectStage =
  document.getElementById("animatedObjectStage");

const currentCount = document.getElementById("currentCount");
const targetCount = document.getElementById("targetCount");

const countWordDisplay =
  document.getElementById("countWordDisplay");

const activityInstruction =
  document.getElementById("activityInstruction");

const successMessage =
  document.getElementById("successMessage");

const successText =
  document.getElementById("successText");

const celebrationBurst =
  document.getElementById("celebrationBurst");

const replayCountBtn =
  document.getElementById("replayCountBtn");

const soundBtn =
  document.getElementById("numberSoundBtn");



const landscapeButton =
  document.getElementById("landscapeButton");

/* =========================================
   STATE
========================================= */

let currentNumberIndex = 0;
let sequenceId = 0;
let countingInProgress = false;
let celebrationTimer = null;
let selectedVoice = null;

function getViewportSize() {
  const viewport = window.visualViewport;

  return {
    width: Math.round(viewport ? viewport.width : window.innerWidth),
    height: Math.round(viewport ? viewport.height : window.innerHeight)
  };
}

function updateMobileLayout() {
  const { width, height } = getViewportSize();
  const shortSide = Math.min(width, height);
  const longSide = Math.max(width, height);
  const isMobileLandscapeLayout =
    shortSide <= 767 && longSide <= 1024;
  const visibleWidth =
    isMobileLandscapeLayout ? shortSide : width;
  const visibleHeight =
    isMobileLandscapeLayout ? longSide : height;

  root.style.setProperty("--visible-width", `${visibleWidth}px`);
  root.style.setProperty("--visible-height", `${visibleHeight}px`);

  document.body.classList.toggle(
    "mobile-landscape-layout",
    isMobileLandscapeLayout
  );

  document.body.classList.toggle(
    "mobile-portrait-rotate",
    isMobileLandscapeLayout && height > width
  );
}

function enableRotatedTouchScroll(element) {
  if (!element) return;

  let lastX = 0;
  let lastY = 0;

  element.addEventListener(
    "touchstart",
    (event) => {
      if (
        !document.body.classList.contains(
          "mobile-landscape-layout"
        ) ||
        event.touches.length !== 1
      ) {
        return;
      }

      lastX = event.touches[0].clientX;
      lastY = event.touches[0].clientY;
    },
    { passive: true }
  );

  element.addEventListener(
    "touchmove",
    (event) => {
      if (
        !document.body.classList.contains(
          "mobile-landscape-layout"
        ) ||
        event.touches.length !== 1
      ) {
        return;
      }

      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      const deltaX = currentX - lastX;
      const deltaY = lastY - currentY;
      const scrollDelta =
        deltaY + deltaX;

      element.scrollTop += scrollDelta;
      lastX = currentX;
      lastY = currentY;

      event.preventDefault();
    },
    { passive: false }
  );
}

function getRotatedScrollTarget(event) {
  if (!document.body.classList.contains("mobile-landscape-layout")) {
    return null;
  }

  const modalIsOpen =
    modal.classList.contains("show");

  const target = event.target;

  if (
    modalIsOpen &&
    target.closest("#numberModal")
  ) {
    return modal;
  }

  return numbersMain;
}

function enableGlobalRotatedScroll() {
  let lastX = 0;
  let lastY = 0;

  document.addEventListener(
    "touchstart",
    (event) => {
      const scrollTarget =
        getRotatedScrollTarget(event);

      if (
        !scrollTarget ||
        event.touches.length !== 1
      ) {
        return;
      }

      lastX = event.touches[0].clientX;
      lastY = event.touches[0].clientY;
    },
    { passive: true, capture: true }
  );

  document.addEventListener(
    "touchmove",
    (event) => {
      const scrollTarget =
        getRotatedScrollTarget(event);

      if (
        !scrollTarget ||
        event.touches.length !== 1
      ) {
        return;
      }

      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      const deltaX = currentX - lastX;
      const deltaY = lastY - currentY;
      const scrollDelta =
        deltaY + deltaX;

      scrollTarget.scrollTop += scrollDelta;
      lastX = currentX;
      lastY = currentY;

      event.preventDefault();
    },
    { passive: false, capture: true }
  );

  document.addEventListener(
    "wheel",
    (event) => {
      const scrollTarget =
        getRotatedScrollTarget(event);

      if (!scrollTarget) {
        return;
      }

      scrollTarget.scrollTop +=
        event.deltaY + event.deltaX;

      event.preventDefault();
    },
    { passive: false, capture: true }
  );
}

/* =========================================
   CREATE NUMBER CARDS
========================================= */

numbersData.forEach((item, index) => {
  const card = document.createElement("button");

  card.type = "button";
  card.className = `number-card ${item.color}`;

  card.setAttribute(
    "aria-label",
    `Open number ${item.number} lesson`
  );

  const objects = Array.from({ length: item.count })
    .map(() => {
      return `
        <img
          src="${basePath}${item.objectImg}"
          class="object-img"
          alt=""
        >
      `;
    })
    .join("");

  card.innerHTML = `
    <img
      src="${basePath}star.png"
      class="number-star"
      alt=""
    >

    <img
      src="${basePath}${item.numberImg}"
      class="number-img"
      alt="Number ${item.number}"
    >

    <div class="object-grid">
      ${objects}
    </div>
  `;

  card.addEventListener("click", () => {
    openNumber(index);
  });

  grid.appendChild(card);
});

/* =========================================
   OPEN NUMBER MODAL
========================================= */

function openNumber(index) {
  stopCurrentSequence();

  currentNumberIndex = index;

  const item = numbersData[currentNumberIndex];

  modal.dataset.theme = item.color;

  modalProgress.textContent =
    `${currentNumberIndex + 1} / ${numbersData.length}`;

  modalNumberImg.src =
    `${basePath}${item.numberImg}`;

  modalNumberImg.alt =
    `Number ${item.number}`;

  numberWord.textContent = item.word;
  sayNumberWord.textContent = `${item.word}!`;

  targetCount.textContent = item.number;

  activityInstruction.textContent =
    createInstruction(item);

  successText.textContent =
    createSuccessSentence(item);

  resetActivityUI();

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");

  const activeSequence = ++sequenceId;

  window.setTimeout(() => {
    if (activeSequence !== sequenceId) return;

    runCountingSequence(item, activeSequence);
  }, 450);
}

/* =========================================
   COUNTING SEQUENCE
========================================= */

async function runCountingSequence(item, activeSequence) {
  countingInProgress = true;

  replayCountBtn.disabled = false;
  soundBtn.disabled = true;

  setAnimatedObjectSize(item.count);

  cancelSpeech();

  for (
    let objectIndex = 0;
    objectIndex < item.count;
    objectIndex++
  ) {
    if (activeSequence !== sequenceId) {
      return;
    }

    const countValue = objectIndex + 1;

    addAnimatedObject(item, objectIndex);

    currentCount.textContent = countValue;

    countWordDisplay.textContent =
      countingWords[countValue];

    animateCountWord();

    /*
      Sabse important change:
      agla object tab tak nahi aayega jab tak
      current counting voice complete nahi hoti.
    */

    await speakText(
      countingWords[countValue],
      {
        pitch: 1.32,
        rate: 0.72,
        cancelPrevious: false
      }
    );

    if (activeSequence !== sequenceId) {
      return;
    }

    await wait(220);
  }

  if (activeSequence !== sequenceId) {
    return;
  }

  await finishCounting(item, activeSequence);
}

/* =========================================
   ADD OBJECT
========================================= */

function addAnimatedObject(item, objectIndex) {
  const objectImage = document.createElement("img");

  objectImage.src =
    `${basePath}${item.objectImg}`;

  objectImage.alt =
    `${item.objectName} ${objectIndex + 1}`;

  objectImage.className =
    "animated-count-object";

  if (item.number === 5) {
    objectImage.classList.add(
      "butterfly-animation"
    );
  }

  objectImage.style.animationDelay = "0s";

  animatedObjectStage.appendChild(
    objectImage
  );
}

/* =========================================
   OBJECT SIZE
========================================= */

function setAnimatedObjectSize(count) {
  let objectSize = 82;

  if (count === 1) {
    objectSize = 145;
  } else if (count === 2) {
    objectSize = 110;
  } else if (count <= 4) {
    objectSize = 83;
  } else if (count <= 6) {
    objectSize = 67;
  } else if (count <= 8) {
    objectSize = 57;
  } else {
    objectSize = 49;
  }

  const isLandscapeMobile =
    (
      window.innerWidth <= 950 &&
      window.matchMedia(
        "(orientation: landscape)"
      ).matches
    ) ||
    document.body.classList.contains(
      "mobile-landscape-layout"
    );

  if (isLandscapeMobile) {
    if (count === 1) {
      objectSize = 85;
    } else if (count === 2) {
      objectSize = 68;
    } else if (count <= 4) {
      objectSize = 56;
    } else {
      objectSize = 42;
    }
  }

  animatedObjectStage.style.setProperty(
    "--animated-object-size",
    `${objectSize}px`
  );
}

/* =========================================
   COUNT WORD ANIMATION
========================================= */

function animateCountWord() {
  countWordDisplay.classList.remove(
    "count-pop"
  );

  void countWordDisplay.offsetWidth;

  countWordDisplay.classList.add(
    "count-pop"
  );

  window.setTimeout(() => {
    countWordDisplay.classList.remove(
      "count-pop"
    );
  }, 260);
}

/* =========================================
   COUNT COMPLETE
========================================= */

async function finishCounting(
  item,
  activeSequence
) {
  if (activeSequence !== sequenceId) {
    return;
  }

  countingInProgress = false;

  countWordDisplay.textContent =
    `${item.word}!`;

  successMessage.classList.add("show");
  // continueBtn.classList.add("ready");

  soundBtn.disabled = false;

  launchCelebrationBurst();

  await wait(320);

  if (activeSequence !== sequenceId) {
    return;
  }

  const objectLabel =
    item.count === 1
      ? item.objectName
      : item.objectPlural;

  await speakText(
    `Great job! You counted ${item.word} ${objectLabel}.`,
    {
      pitch: 1.18,
      rate: 0.78,
      cancelPrevious: false
    }
  );
}

/* =========================================
   REPLAY COUNTING
========================================= */

function replayCounting() {
  const item =
    numbersData[currentNumberIndex];

  stopCurrentSequence(false);

  resetActivityUI();

  const activeSequence = ++sequenceId;

  window.setTimeout(() => {
    if (activeSequence !== sequenceId) return;

    runCountingSequence(
      item,
      activeSequence
    );
  }, 180);
}

/* =========================================
   RESET ACTIVITY UI
========================================= */

function resetActivityUI() {
  animatedObjectStage.innerHTML = "";
  celebrationBurst.innerHTML = "";

  currentCount.textContent = "0";
  countWordDisplay.textContent = "Ready?";

  countWordDisplay.classList.remove(
    "count-pop"
  );

  successMessage.classList.remove("show");
  // continueBtn.classList.remove("ready");

  soundBtn.disabled = true;
}

/* =========================================
   FIREWORK + CONFETTI CELEBRATION
========================================= */

function launchCelebrationBurst() {
  celebrationBurst.innerHTML = "";

  if (celebrationTimer) {
    window.clearTimeout(celebrationTimer);
  }

  const colors = [
    "#ff4d5a",
    "#ff8f1f",
    "#ffd92e",
    "#59d85d",
    "#35b9ff",
    "#6e5dff",
    "#d95cff",
    "#ff63b1"
  ];

  const isSmallLandscape =
    window.innerHeight <= 500 &&
    window.matchMedia(
      "(orientation: landscape)"
    ).matches;

  const fireworks = isSmallLandscape
    ? [
        {
          left: "25%",
          top: "26%",
          size: "78px",
          delay: 0
        },
        {
          left: "73%",
          top: "24%",
          size: "68px",
          delay: 0.16
        },
        {
          left: "50%",
          top: "42%",
          size: "88px",
          delay: 0.3
        }
      ]
    : [
        {
          left: "23%",
          top: "23%",
          size: "110px",
          delay: 0
        },
        {
          left: "75%",
          top: "22%",
          size: "95px",
          delay: 0.16
        },
        {
          left: "50%",
          top: "40%",
          size: "125px",
          delay: 0.3
        }
      ];

  createFireworks(
    fireworks,
    colors,
    isSmallLandscape
  );

  createConfetti(
    colors,
    isSmallLandscape
  );

  createGoldenStreamers(
    isSmallLandscape
  );

  celebrationTimer = window.setTimeout(() => {
    celebrationBurst.innerHTML = "";
  }, 2600);
}

/* =========================================
   CREATE FIREWORKS
========================================= */

function createFireworks(
  fireworks,
  colors,
  isSmallLandscape
) {
  fireworks.forEach(
    (firework, fireworkIndex) => {
      const flash =
        document.createElement("span");

      flash.className =
        "firework-flash";

      flash.style.setProperty(
        "--fw-left",
        firework.left
      );

      flash.style.setProperty(
        "--fw-top",
        firework.top
      );

      flash.style.setProperty(
        "--fw-size",
        firework.size
      );

      flash.style.setProperty(
        "--fw-delay",
        `${firework.delay}s`
      );

      celebrationBurst.appendChild(
        flash
      );

      const sparkCount =
        isSmallLandscape ? 18 : 26;

      for (
        let index = 0;
        index < sparkCount;
        index++
      ) {
        const spark =
          document.createElement("span");

        spark.className =
          "firework-spark";

        const angle =
          (
            Math.PI *
            2 *
            index /
            sparkCount
          ) +
          (
            Math.random() *
            0.18 -
            0.09
          );

        const minimumDistance =
          isSmallLandscape ? 46 : 68;

        const extraDistance =
          isSmallLandscape ? 28 : 48;

        const distance =
          minimumDistance +
          Math.random() *
          extraDistance;

        const x =
          Math.cos(angle) * distance;

        const y =
          Math.sin(angle) * distance;

        const color =
          colors[
            (
              index +
              fireworkIndex * 2
            ) %
            colors.length
          ];

        spark.style.setProperty(
          "--fw-left",
          firework.left
        );

        spark.style.setProperty(
          "--fw-top",
          firework.top
        );

        spark.style.setProperty(
          "--spark-x",
          `${x}px`
        );

        spark.style.setProperty(
          "--spark-y",
          `${y}px`
        );

        spark.style.setProperty(
          "--spark-size",
          `${4 + Math.random() * 4}px`
        );

        spark.style.setProperty(
          "--spark-color",
          color
        );

        spark.style.setProperty(
          "--spark-delay",
          `${
            firework.delay +
            Math.random() * 0.08
          }s`
        );

        spark.style.setProperty(
          "--spark-duration",
          `${0.9 + Math.random() * 0.45}s`
        );

        celebrationBurst.appendChild(
          spark
        );
      }
    }
  );
}

/* =========================================
   CREATE CONFETTI
========================================= */

function createConfetti(
  colors,
  isSmallLandscape
) {
  const confettiCount =
    isSmallLandscape ? 34 : 55;

  for (
    let index = 0;
    index < confettiCount;
    index++
  ) {
    const confetti =
      document.createElement("span");

    if (index % 9 === 0) {
      confetti.className =
        "confetti-piece star";

      confetti.textContent = "\u2605";

      confetti.style.setProperty(
        "--confetti-font-size",
        `${isSmallLandscape ? 15 : 21}px`
      );
    } else if (index % 4 === 0) {
      confetti.className =
        "confetti-piece circle";
    } else {
      confetti.className =
        "confetti-piece";
    }

    const distanceX =
      (
        Math.random() * 2 - 1
      ) *
      (
        isSmallLandscape ? 200 : 320
      );

    const distanceY =
      (
        Math.random() * 2 - 1
      ) *
      (
        isSmallLandscape ? 125 : 220
      );

    confetti.style.setProperty(
      "--confetti-x",
      `${distanceX}px`
    );

    confetti.style.setProperty(
      "--confetti-y",
      `${distanceY}px`
    );

    confetti.style.setProperty(
      "--confetti-width",
      `${5 + Math.random() * 7}px`
    );

    confetti.style.setProperty(
      "--confetti-height",
      `${8 + Math.random() * 11}px`
    );

    confetti.style.setProperty(
      "--confetti-rotate",
      `${-360 + Math.random() * 720}deg`
    );

    confetti.style.setProperty(
      "--confetti-duration",
      `${1.1 + Math.random() * 0.9}s`
    );

    confetti.style.setProperty(
      "--confetti-delay",
      `${Math.random() * 0.2}s`
    );

    confetti.style.setProperty(
      "--confetti-color",
      colors[index % colors.length]
    );

    celebrationBurst.appendChild(
      confetti
    );
  }
}

/* =========================================
   CREATE GOLDEN STREAMERS
========================================= */

function createGoldenStreamers(
  isSmallLandscape
) {
  const streamerCount =
    isSmallLandscape ? 6 : 10;

  for (
    let index = 0;
    index < streamerCount;
    index++
  ) {
    const streamer =
      document.createElement("span");

    streamer.className =
      "celebration-streamer";

    const x =
      (
        Math.random() * 2 - 1
      ) *
      (
        isSmallLandscape ? 190 : 290
      );

    const y =
      (
        Math.random() * 2 - 1
      ) *
      (
        isSmallLandscape ? 125 : 200
      );

    streamer.style.setProperty(
      "--streamer-x",
      `${x}px`
    );

    streamer.style.setProperty(
      "--streamer-y",
      `${y}px`
    );

    streamer.style.setProperty(
      "--streamer-width",
      `${7 + Math.random() * 5}px`
    );

    streamer.style.setProperty(
      "--streamer-height",
      `${42 + Math.random() * 38}px`
    );

    streamer.style.setProperty(
      "--streamer-rotate",
      `${-360 + Math.random() * 720}deg`
    );

    streamer.style.setProperty(
      "--streamer-duration",
      `${1.1 + Math.random() * 0.75}s`
    );

    streamer.style.setProperty(
      "--streamer-delay",
      `${Math.random() * 0.2}s`
    );

    celebrationBurst.appendChild(
      streamer
    );
  }
}

/* =========================================
   VOICE SYSTEM
========================================= */

function getPreferredVoice(voices) {
  return (
    voices.find(
      (voice) =>
        /samantha|zira|female|google us english/i.test(
          `${voice.name} ${voice.voiceURI} ${voice.lang}`
        )
    ) ||
    voices.find(
      (voice) =>
        /^en-US$/i.test(voice.lang)
    ) ||
    voices.find(
      (voice) =>
        /^en/i.test(voice.lang)
    ) ||
    voices[0] ||
    null
  );
}

async function loadVoices() {
  if (
    !("speechSynthesis" in window)
  ) {
    return [];
  }

  let voices =
    window.speechSynthesis.getVoices();

  if (voices.length > 0) {
    selectedVoice =
      getPreferredVoice(voices);

    return voices;
  }

  return new Promise((resolve) => {
    let completed = false;

    const finish = () => {
      if (completed) return;

      completed = true;

      voices =
        window.speechSynthesis.getVoices();

      selectedVoice =
        getPreferredVoice(voices);

      resolve(voices);
    };

    const timeout =
      window.setTimeout(
        finish,
        1400
      );

    const voiceHandler = () => {
      window.clearTimeout(timeout);

      finish();
    };

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      voiceHandler,
      { once: true }
    );
  });
}

async function speakText(
  text,
  options = {}
) {
  const {
    pitch = 1.2,
    rate = 0.8,
    volume = 1,
    cancelPrevious = false
  } = options;

  if (
    !("speechSynthesis" in window)
  ) {
    await wait(700);

    return;
  }

  const speechEngine =
    window.speechSynthesis;

  if (cancelPrevious) {
    speechEngine.cancel();

    await wait(80);
  }

  await loadVoices();

  return new Promise((resolve) => {
    const speech =
      new SpeechSynthesisUtterance(
        text
      );

    speech.lang = "en-US";
    speech.pitch = pitch;
    speech.rate = rate;
    speech.volume = volume;

    if (selectedVoice) {
      speech.voice = selectedVoice;
    }

    let completed = false;

    const finishSpeech = () => {
      if (completed) return;

      completed = true;

      window.clearTimeout(
        safetyTimer
      );

      resolve();
    };

    speech.onend = finishSpeech;
    speech.onerror = finishSpeech;

    /*
      Kuch mobile browsers onend event nahi dete.
      Isliye safety timer rakha gaya hai.
    */

    const wordCount =
      text.trim().split(/\s+/).length;

    const safetyDuration =
      Math.max(
        2200,
        wordCount * 950
      );

    const safetyTimer =
      window.setTimeout(
        finishSpeech,
        safetyDuration
      );

    speechEngine.resume();
    speechEngine.speak(speech);
  });
}

function cancelSpeech() {
  if (
    "speechSynthesis" in window
  ) {
    window.speechSynthesis.cancel();
  }
}

/* =========================================
   SOUND BUTTON
========================================= */

async function playNumberLesson() {
  if (countingInProgress) {
    return;
  }

  const item =
    numbersData[currentNumberIndex];

  const objectLabel =
    item.count === 1
      ? item.objectName
      : item.objectPlural;

  await speakText(
    `${item.word}. ${item.word} ${objectLabel}.`,
    {
      pitch: 1.25,
      rate: 0.76,
      cancelPrevious: true
    }
  );
}

/* =========================================
   HELPERS
========================================= */

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(
      resolve,
      milliseconds
    );
  });
}

function createInstruction(item) {
  const label =
    item.count === 1
      ? item.objectName
      : item.objectPlural;

  return `Watch the ${label} appear one by one!`;
}

function createSuccessSentence(item) {
  const label =
    item.count === 1
      ? item.objectName
      : item.objectPlural;

  return `You counted ${item.number} ${label}!`;
}

/* =========================================
   PREVIOUS / NEXT
========================================= */

function showPreviousNumber() {
  let newIndex =
    currentNumberIndex - 1;

  if (newIndex < 0) {
    newIndex =
      numbersData.length - 1;
  }

  openNumber(newIndex);
}

function showNextNumber() {
  let newIndex =
    currentNumberIndex + 1;

  if (
    newIndex >=
    numbersData.length
  ) {
    newIndex = 0;
  }

  openNumber(newIndex);
}

/* =========================================
   STOP SEQUENCE
========================================= */

function stopCurrentSequence(
  clearCelebration = true
) {
  sequenceId++;

  countingInProgress = false;

  cancelSpeech();

  if (celebrationTimer) {
    window.clearTimeout(
      celebrationTimer
    );

    celebrationTimer = null;
  }

  if (clearCelebration) {
    celebrationBurst.innerHTML = "";
  }
}

/* =========================================
   CLOSE MODAL
========================================= */

function closeModal() {
  stopCurrentSequence();

  resetActivityUI();

  modal.classList.remove("show");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );
}

/* =========================================
   LANDSCAPE MODE
========================================= */

async function requestLandscapeMode() {
  try {
    if (
      !document.fullscreenElement &&
      document.documentElement
        .requestFullscreen
    ) {
      await document.documentElement
        .requestFullscreen();
    }

    if (
      screen.orientation &&
      screen.orientation.lock
    ) {
      await screen.orientation.lock(
        "landscape"
      );
    }
  } catch (error) {
    console.info(
      "Please rotate the device manually."
    );
  }
}

/* =========================================
   EVENTS
========================================= */

closeBtn.addEventListener(
  "click",
  closeModal
);

previousBtn.addEventListener(
  "click",
  showPreviousNumber
);

nextBtn.addEventListener(
  "click",
  showNextNumber
);

// continueBtn.addEventListener(
//   "click",
//   showNextNumber
// );

replayCountBtn.addEventListener(
  "click",
  replayCounting
);

soundBtn.addEventListener(
  "click",
  playNumberLesson
);

landscapeButton.addEventListener(
  "click",
  requestLandscapeMode
);

modal.addEventListener(
  "click",
  (event) => {
    if (event.target === modal) {
      closeModal();
    }
  }
);

document.addEventListener(
  "keydown",
  (event) => {
    if (
      !modal.classList.contains("show")
    ) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
    }

    if (event.key === "ArrowLeft") {
      showPreviousNumber();
    }

    if (event.key === "ArrowRight") {
      showNextNumber();
    }
  }
);

window.addEventListener(
  "resize",
  () => {
    updateMobileLayout();

    if (
      modal.classList.contains("show")
    ) {
      const item =
        numbersData[
          currentNumberIndex
        ];

      setAnimatedObjectSize(
        item.count
      );
    }
  }
);

window.addEventListener(
  "orientationchange",
  updateMobileLayout,
  { passive: true }
);

if (window.visualViewport) {
  window.visualViewport.addEventListener(
    "resize",
    updateMobileLayout,
    { passive: true }
  );
}

enableRotatedTouchScroll(numbersMain);
enableRotatedTouchScroll(modal);
enableGlobalRotatedScroll();

window.addEventListener(
  "pagehide",
  () => {
    stopCurrentSequence();
  }
);

/* Voice list preload */

if (
  "speechSynthesis" in window
) {
  loadVoices();

  window.speechSynthesis.addEventListener(
    "voiceschanged",
    () => {
      const voices =
        window.speechSynthesis.getVoices();

      selectedVoice =
        getPreferredVoice(voices);
    }
  );
}

updateMobileLayout();
