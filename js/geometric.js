const shapes = [
  { name: "Circle", className: "circle" },
  { name: "Square", className: "square" },
  { name: "Triangle", className: "triangle" },
  { name: "Rectangle", className: "rectangle" },
  { name: "Oval", className: "oval" },
  { name: "Diamond", className: "diamond" }
];
const shapeGrid = document.getElementById("shapeGrid");
const modal = document.getElementById("shapeModal");
const closeBtn = document.getElementById("shapeClose");
const preview = document.getElementById("shapePreview");
const title = document.getElementById("shapeTitle");
const soundBtn = document.getElementById("shapeSoundBtn");
let preferredVoice = null;

shapes.forEach(shape => {
  const card = document.createElement("button");
  card.className = "shape-card";
  card.innerHTML = `<div class="shape ${shape.className}"></div><div class="shape-name">${shape.name}</div>`;
  card.addEventListener("click", () => openShape(shape));
  shapeGrid.appendChild(card);
});

function openShape(shape) {
  preview.className = `shape ${shape.className}`;
  title.textContent = shape.name;
  soundBtn.onclick = () => speakText(shape.name);
  modal.classList.add("show");
  speakText(shape.name);
}
function closeModal(){ modal.classList.remove("show"); window.speechSynthesis?.cancel?.(); }
closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

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

function speakText(text) {
  if (!("speechSynthesis" in window) || !text) return;
  loadPreferredVoice();
  const speech = new SpeechSynthesisUtterance(text);
  if (preferredVoice) speech.voice = preferredVoice;
  speech.lang = "en-US";
  speech.pitch = 1.4;
  speech.rate = .8;
  speech.volume = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}

loadPreferredVoice();

if ("speechSynthesis" in window) {
  window.speechSynthesis.addEventListener("voiceschanged", loadPreferredVoice);
}
