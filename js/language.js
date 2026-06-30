const languages = [
            { name: "English", flag: "assets/images/flags/usa.png" },
            { name: "Hindi", flag: "assets/images/flags/india.png" },
            { name: "French", flag: "assets/images/flags/france.png" },
            { name: "Spanish", flag: "assets/images/flags/spain.png" },
            { name: "German", flag: "assets/images/flags/germany.png" },
            { name: "Japanese", flag: "assets/images/flags/japan.png" },
            { name: "Korean", flag: "assets/images/flags/korea.png" },
            { name: "Chinese", flag: "assets/images/flags/china.png" },
            { name: "Arabic", flag: "assets/images/flags/saudi-arabia.png" },
        ];

        const animals = [
            {
                name: "Bear",
                image: "assets/images/language-images/teddy.png",
            },
            {
                name: "Elephant",
                image: "assets/images/language-images/elephant.png",
            },
            {
                name: "Rabbit",
                image: "assets/images/language-images/rabbit.png",
            },
        ];

        let startIndex = 0;
        let selectedLanguage = null;

        const cardsWrapper = document.getElementById("cardsWrapper");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        const continueBtn = document.getElementById("continueBtn");

        const lionBox = document.getElementById("lionBox");
        const lionImg = document.getElementById("lionImg");
        const lionImages = {
            cute: "assets/images/language-images/cute-line.png",
            happy: "assets/images/language-images/happy-line.png",
        };

        const selectedAnimalBox = document.getElementById("selectedAnimalBox");
        const selectedAnimalImg = document.getElementById("selectedAnimalImg");
        const animalBubble = document.getElementById("animalBubble");

        function getViewportSize() {
            const viewport = window.visualViewport;
            const fallbackWidth =
                window.innerWidth ||
                document.documentElement.clientWidth ||
                viewport?.width;

            const fallbackHeight =
                window.innerHeight ||
                document.documentElement.clientHeight ||
                viewport?.height;

            return {
                width: fallbackWidth,
                height: fallbackHeight,
            };
        }

        function updateMobileLayout() {
            const { width, height } = getViewportSize();
            const shortSide = Math.min(width, height);
            const longSide = Math.max(width, height);
            const isMobileLandscapeLayout = shortSide <= 767 && longSide <= 1024;
            const visibleWidth = isMobileLandscapeLayout ? shortSide : width;
            const visibleHeight = isMobileLandscapeLayout ? longSide : height;

            document.documentElement.style.setProperty("--visible-width", `${visibleWidth}px`);
            document.documentElement.style.setProperty("--visible-height", `${visibleHeight}px`);

            document.body.classList.toggle(
                "mobile-landscape-layout",
                isMobileLandscapeLayout
            );

            document.body.classList.toggle(
                "mobile-portrait-rotate",
                isMobileLandscapeLayout && height > width
            );
        }

        function renderCards() {
            cardsWrapper.innerHTML = "";

            const visibleLanguages = languages.slice(startIndex, startIndex + 3);

            visibleLanguages.forEach((language, index) => {
                const animal = animals[index];

                const card = document.createElement("div");
                card.className = "language-card";

                if (selectedLanguage && selectedLanguage.name === language.name) {
                    card.classList.add("selected");
                }

                card.innerHTML = `
                    <div class="tick">&check;</div>
                    <div class="flag">
                        <img src="${language.flag}" alt="${language.name}">
                    </div>
                                       
                    <img class="card-animal" src="${animal.image}" alt="${animal.name}">
                    <div class="language-name">${language.name}</div>
                `;

                card.addEventListener("click", () => {
                    selectLanguage(language, animal, card);
                });

                cardsWrapper.appendChild(card);
            });

            prevBtn.style.display = startIndex === 0 ? "none" : "block";
            nextBtn.style.display =
                startIndex + 3 >= languages.length ? "none" : "block";
        }

        function selectLanguage(language, animal, card) {
            selectedLanguage = language;

            document.querySelectorAll(".language-card").forEach((item) => {
                item.classList.remove("selected");
            });

            card.classList.add("selected");

            continueBtn.disabled = false;
            continueBtn.classList.add("active");

            animalBubble.textContent = `Let's Learn ${language.name}!`;
            selectedAnimalImg.src = animal.image;

            playSelectionAnimations(card);
        }

        function setLionMood(isHappy) {
            lionImg.src = isHappy ? lionImages.happy : lionImages.cute;
            lionImg.alt = isHappy ? "Happy Lion" : "Cute Lion";
        }

        function playSelectionAnimations(card) {
            lionBox.classList.remove("show");
            selectedAnimalBox.classList.remove("show");

            void lionBox.offsetWidth;
            void selectedAnimalBox.offsetWidth;

            setLionMood(true);

            lionBox.classList.add("show");
            selectedAnimalBox.classList.add("show");

            createSparkles(card);
        }

        function createSparkles(card) {
            const rect = card.getBoundingClientRect();

            for (let i = 0; i < 18; i++) {
                const sparkle = document.createElement("div");
                sparkle.className = "sparkle";

                sparkle.style.left = rect.left + Math.random() * rect.width + "px";
                sparkle.style.top = rect.top + Math.random() * rect.height + "px";

                document.body.appendChild(sparkle);

                setTimeout(() => {
                    sparkle.remove();
                }, 900);
            }
        }

        let lastNavigationTap = 0;

        function canHandleNavigationTap() {
            const now = Date.now();

            if (now - lastNavigationTap < 260) {
                return false;
            }

            lastNavigationTap = now;
            return true;
        }

        function showNextLanguages() {
            if (startIndex + 3 < languages.length) {
                startIndex += 3;
                selectedLanguage = null;
                resetSelection();
                renderCards();
            }
        }

        function showPreviousLanguages() {
            if (startIndex - 3 >= 0) {
                startIndex -= 3;
                selectedLanguage = null;
                resetSelection();
                renderCards();
            }
        }

        nextBtn.addEventListener("click", () => {
            if (!canHandleNavigationTap()) {
                return;
            }

            showNextLanguages();
        });

        prevBtn.addEventListener("click", () => {
            if (!canHandleNavigationTap()) {
                return;
            }

            showPreviousLanguages();
        });

        nextBtn.addEventListener("pointerup", (event) => {
            if (!canHandleNavigationTap()) {
                return;
            }

            event.preventDefault();
            showNextLanguages();
        });

        prevBtn.addEventListener("pointerup", (event) => {
            if (!canHandleNavigationTap()) {
                return;
            }

            event.preventDefault();
            showPreviousLanguages();
        });

        continueBtn.addEventListener("click", () => {
            if (!selectedLanguage) return;

            localStorage.setItem("selectedLanguage", selectedLanguage.name);

            window.location.href = "kindergarten.html";
        });

        function resetSelection() {
            continueBtn.disabled = true;
            continueBtn.classList.remove("active");

            lionBox.classList.remove("show");
            selectedAnimalBox.classList.remove("show");

            setLionMood(false);
        }

        window.addEventListener("resize", updateMobileLayout);
        window.addEventListener("orientationchange", updateMobileLayout);
        window.visualViewport?.addEventListener("resize", updateMobileLayout);

        updateMobileLayout();
        setLionMood(false);
        renderCards();
