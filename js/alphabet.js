const alphabetGrid = document.getElementById("alphabetGrid");
const cubeModal = document.getElementById("cubeModal");
const closeBtn = document.getElementById("closeBtn");
const root = document.documentElement;
const body = document.body;

const cubeHeading = document.getElementById("cubeHeading");

const frontImage = document.getElementById("frontImage");
const imageFallback = document.createElement("div");
imageFallback.className = "alphabet-image-fallback";
imageFallback.hidden = true;
frontImage.insertAdjacentElement("afterend", imageFallback);
// const frontImageText = document.getElementById("frontImageText");

const frontLetter = document.getElementById("frontLetter");
const backLetter = document.getElementById("backLetter");

const soundBtn = document.getElementById("soundBtn");

const prevLetterBtn = document.getElementById("prevLetterBtn");
const nextLetterBtn = document.getElementById("nextLetterBtn");

const alphabetData = {
    A: {
        word: "Apple",
        capital: "A",
        small: "a",
        frontImage: "assets/images/alphabet/A/apple.png",
        
    },
    B: {
        word: "Ball",
        capital: "B",
        small: "b",
        frontImage: "assets/images/alphabet/B/ball.png",
        
    },
    C: {
        word: "Cat",
        capital: "C",
        small: "c",
        frontImage: "assets/images/alphabet/C/cat.png",
       
    },
    D: {
        word: "Dog",
        capital: "D",
        small: "d",
        frontImage: "assets/images/alphabet/D/Dog.png",
        
    },
    E: {
        word: "Elephant",
        capital: "E",
        small: "e",
        frontImage: "assets/images/alphabet/E/elephant.png",
        
    },
    F: {
        word: "Fish",
        capital: "F",
        small: "f",
        frontImage: "assets/images/alphabet/F/fish.png",
        
    },
    G: {
        word: "Grapes",
        capital: "G",
        small: "g",
        frontImage: "assets/images/color/green/grapes.png",
       
    },
    H: {
        word: "House",
        capital: "H",
        small: "h",
        frontImage: "assets/images/alphabet/H/house.png",
       
    },
    I: {
        word: "Ice Cube",
        capital: "I",
        small: "i",
        frontImage: "assets/images/geometry/cube/ice-cube.png",
        frontText: "Ice Cube"
    },
    J: {
        word: "Jellyfish",
        capital: "J",
        small: "j",
        frontImage: "assets/images/alphabet/J/jellyfish.png",
        
    },
    K: {
        word: "Kite",
        capital: "K",
        small: "k",
        frontImage: "assets/images/geometry/diamond/kite.png",
        
    },
    L: {
        word: "Lion",
        capital: "L",
        small: "l",
        frontImage: "assets/images/language-images/lion.png",
        
    },
    M: {
        word: "Mango",
        capital: "M",
        small: "m",
        frontImage: "assets/images/alphabet/M/mango.png",
       
    },
    N: {
        word: "Nest",
        capital: "N",
        small: "n",
        frontImage: "assets/images/alphabet/N/nest.png",
        
    },
    O: {
        word: "Orange",
        capital: "O",
        small: "o",
        frontImage: "assets/images/color/orange/orange.png",
        
    },
    P: {
        word: "Pencil",
        capital: "P",
        small: "p",
        frontImage: "assets/images/number/pencil.png",
        
    },
    Q: {
        word: "Queen",
        capital: "Q",
        small: "q",
        frontImage: "assets/images/alphabet/Q/queen.png",
        
    },
    R: {
        word: "Rainbow",
        capital: "R",
        small: "r",
        frontImage: "assets/images/alphabet/R/rainbow.png",
        
    },
    S: {
        word: "Sun",
        capital: "S",
        small: "s",
        frontImage: "assets/images/color/yellow/sun.png",
        frontText: "Sun"
    },
    T: {
        word: "Tree",
        capital: "T",
        small: "t",
        frontImage: "assets/images/alphabet/T/tree.png",
        
    },
    U: {
        word: "Umbrella",
        capital: "U",
        small: "u",
        frontImage: "assets/images/alphabet/U/umbrella.png",
        
    },
    V: {
        word: "Volcano",
        capital: "V",
        small: "v",
        frontImage: "assets/images/alphabet/V/volcano.png",
       
    },
    W: {
        word: "Watermelon",
        capital: "W",
        small: "w",
        frontImage: "assets/images/geometry/oval/watermelon.png",
        
    },
    X: {
        word: "Xylophone",
        capital: "X",
        small: "x",
        frontImage: "assets/images/alphabet/X/xylophone.png",
        
    },
    Y: {
        word: "Yo-Yo",
        capital: "Y",
        small: "y",
        frontImage: "assets/images/alphabet/Y/yo-yo.png",
        
    },
    Z: {
        word: "Zebra",
        capital: "Z",
        small: "z",
        frontImage: "assets/images/alphabet/Z/zebra.png",
        
    }
};

const letters = Object.keys(alphabetData);
let currentLetter = null;
let preferredVoice = null;

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

letters.forEach((letter) => {
    const card = document.createElement("div");
    card.className = "letter-card";
    card.innerHTML = `<span>${letter}</span>`;

    card.addEventListener("click", () => {
        openCube(letter);
    });

    alphabetGrid.appendChild(card);
});

function openCube(letter) {
    currentLetter = letter;

    const data = alphabetData[letter];

    cubeHeading.innerText = `${data.capital} for ${data.word}`;

    imageFallback.hidden = true;
    frontImage.style.display = "none";
    frontImage.src = data.frontImage;
    frontImage.alt = data.word;
    frontImage.onerror = () => {
        showImageFallback(data);
    };
    frontImage.onload = () => {
        imageFallback.hidden = true;
        frontImage.style.display = "block";
    };

    // frontImageText.innerText = data.frontText;

    frontLetter.innerText = data.capital;
    backLetter.innerText = data.small;

    soundBtn.onclick = function () {
        speakText(`${data.capital} for ${data.word}`);
    };

    cubeModal.classList.add("show");
}

function showImageFallback(data) {
    frontImage.style.display = "none";
    imageFallback.innerHTML = `
        <div class="fallback-letter">${data.capital}</div>
        <div class="fallback-word">${data.word}</div>
    `;
    imageFallback.hidden = false;
}

function navigateLetter(direction) {
    const currentIndex = letters.indexOf(currentLetter);

    let newIndex;

    if (direction === "next") {
        newIndex = (currentIndex + 1) % letters.length;
    } else {
        newIndex = (currentIndex - 1 + letters.length) % letters.length;
    }

    openCube(letters[newIndex]);
}

prevLetterBtn.addEventListener("click", () => {
    navigateLetter("prev");
});

nextLetterBtn.addEventListener("click", () => {
    navigateLetter("next");
});

function closeCube() {
    cubeModal.classList.remove("show");
    window.speechSynthesis?.cancel?.();
}

closeBtn.addEventListener("click", closeCube);

cubeModal.addEventListener("click", function (e) {
    if (e.target === cubeModal) {
        closeCube();
    }
});

function speakText(text) {
    if (!("speechSynthesis" in window) || !text) return;

    loadPreferredVoice();

    const speech = new SpeechSynthesisUtterance(text);
    if (preferredVoice) speech.voice = preferredVoice;
    speech.lang = "en-US";
    speech.pitch = 1.4;
    speech.rate = 0.8;
    speech.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
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

loadPreferredVoice();
updateMobileLayout();

if ("speechSynthesis" in window) {
    window.speechSynthesis.addEventListener("voiceschanged", loadPreferredVoice);
}

window.addEventListener("resize", updateMobileLayout, { passive: true });
window.addEventListener("orientationchange", updateMobileLayout, { passive: true });
window.visualViewport?.addEventListener("resize", updateMobileLayout, { passive: true });
