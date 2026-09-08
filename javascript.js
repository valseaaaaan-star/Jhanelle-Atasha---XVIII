/* =========================================
   ELEMENTS
========================================= */

const scrollScene =
    document.querySelector(".scroll-scene");

const inviteScroll =
    document.getElementById("invite-scroll");


/* =========================================
   SCROLL-OPEN EXPERIENCE
========================================= */

let viewportHeight = window.innerHeight;

window.addEventListener(
    "resize",
    () => {
        viewportHeight = window.innerHeight;
    },
    { passive: true }
);


let targetProgress = 0;
let displayProgress = 0;

function computeTargetProgress() {

    if (!scrollScene) return 0;

    const rect =
        scrollScene.getBoundingClientRect();

    const height =
        scrollScene.offsetHeight;

    const scrollRange =
        height - viewportHeight;

    let progress;

    if (scrollRange > 0) {

        progress = -rect.top / scrollRange;

    } else {

        progress = rect.top < viewportHeight / 2 ? 1 : 0;

    }

    return Math.max(0, Math.min(1, progress));

}


function renderScroll(progress) {

    if (!inviteScroll) return;

    inviteScroll.style.setProperty("--p", progress);

}


function scrollOpenLoop() {

    targetProgress = computeTargetProgress();

    displayProgress +=
        (targetProgress - displayProgress) * .12;

    if (Math.abs(targetProgress - displayProgress) < .0005) {
        displayProgress = targetProgress;
    }

    renderScroll(displayProgress);

    window.requestAnimationFrame(scrollOpenLoop);

}


/* =========================================
   COUNTDOWN
========================================= */

const partyDate =
    new Date("2026-10-25T17:00:00");

const cdDays = document.getElementById("cd-days");
const cdHours = document.getElementById("cd-hours");
const cdMins = document.getElementById("cd-mins");
const cdSecs = document.getElementById("cd-secs");

function pad(n) {
    return String(n).padStart(2, "0");
}

function updateCountdown() {

    if (!cdDays) return;

    const now = new Date();
    const diff = partyDate - now;

    if (diff <= 0) {
        cdDays.textContent = "00";
        cdHours.textContent = "00";
        cdMins.textContent = "00";
        cdSecs.textContent = "00";
        return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(mins);
    cdSecs.textContent = pad(secs);

}

updateCountdown();
setInterval(updateCountdown, 1000);


/* =========================================
   SCROLL REVEALS
========================================= */

const revealElements =
    document.querySelectorAll(
        ".intro-inner, .preview-frame, .event-intro, .details-header, .detail-item, .venue-map-frame, .dress-inner, .wishlist-scroll, .wishlist-item, .book-wrap, .wishes-carousel, .gallery-wrap, .rsvp, .final"
    );


const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        "revealed"
                    );

                }

            });

        },

        {
            threshold: .12,
            rootMargin: "0px 0px -8% 0px"
        }

    );


revealElements.forEach(
    element =>
        revealObserver.observe(element)
);


/* =========================================
   INITIALIZE
========================================= */

scrollOpenLoop();


/* =========================================
   WISHES CAROUSEL
========================================= */

const wishQuotes =
    document.querySelectorAll(".wish-quote");

const wishesDotsContainer =
    document.getElementById("wishes-dots");

let wishIndex = 0;


if (wishQuotes.length && wishesDotsContainer) {

    wishQuotes.forEach((_, i) => {

        const dot = document.createElement("span");

        if (i === 0) dot.classList.add("active");

        dot.addEventListener(
            "click",
            () => showWish(i)
        );

        wishesDotsContainer.appendChild(dot);

    });


    const wishDots =
        wishesDotsContainer.querySelectorAll("span");


    function showWish(i) {

        wishQuotes[wishIndex].classList.remove("active");
        wishDots[wishIndex].classList.remove("active");

        wishIndex = i;

        wishQuotes[wishIndex].classList.add("active");
        wishDots[wishIndex].classList.add("active");

    }


    setInterval(
        () => {

            showWish(
                (wishIndex + 1) % wishQuotes.length
            );

        },
        5000
    );

}


/* =========================================
   DEBUT BOOK
========================================= */

(function initDebutBook() {

    const book =
        document.getElementById("debut-book");

    if (!book) return;

    const pages =
        Array.from(book.querySelectorAll(".book-page"));

    const prevButton =
        document.getElementById("book-prev");

    const nextButton =
        document.getElementById("book-next");

    const dots =
        Array.from(
            document.querySelectorAll(".book-progress-dot")
        );

    let currentIndex = 0;
    let animating = false;

    const TURN_MS = 1000;


    function layout() {

        pages.forEach((page, i) => {

            if (i < currentIndex) {

                page.style.transform = "rotateY(-180deg)";
                page.style.zIndex = String(i);

            } else if (i === currentIndex) {

                page.style.transform = "rotateY(0deg)";
                page.style.zIndex = String(pages.length + 10);

            } else {

                page.style.transform = "rotateY(0deg)";
                page.style.zIndex = String(pages.length - i);

            }

        });

        if (prevButton) prevButton.disabled = currentIndex === 0;
        if (nextButton) nextButton.disabled = currentIndex === pages.length - 1;

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });

    }


    function goToNext() {

        if (animating || currentIndex >= pages.length - 1) return;

        animating = true;

        const leaving = pages[currentIndex];
        leaving.style.zIndex = String(pages.length + 20);
        leaving.style.transform = "rotateY(-180deg)";

        setTimeout(
            () => {
                currentIndex += 1;
                layout();
                animating = false;
            },
            TURN_MS
        );

    }


    function goToPrev() {

        if (animating || currentIndex <= 0) return;

        animating = true;

        const entering = pages[currentIndex - 1];
        entering.style.zIndex = String(pages.length + 20);
        entering.style.transform = "rotateY(0deg)";

        setTimeout(
            () => {
                currentIndex -= 1;
                layout();
                animating = false;
            },
            TURN_MS
        );

    }


    function goTo(index) {

        if (animating || index === currentIndex) return;

        if (index > currentIndex) {

            const step = () => {
                if (currentIndex < index) {
                    goToNext();
                    setTimeout(step, TURN_MS);
                }
            };
            step();

        } else {

            const step = () => {
                if (currentIndex > index) {
                    goToPrev();
                    setTimeout(step, TURN_MS);
                }
            };
            step();

        }

    }


    if (nextButton) nextButton.addEventListener("click", goToNext);
    if (prevButton) prevButton.addEventListener("click", goToPrev);

    dots.forEach((dot, i) => {

        dot.addEventListener("click", () => goTo(i));

        dot.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                goTo(i);
            }
        });

    });

    book.setAttribute("tabindex", "0");

    book.addEventListener("keydown", event => {

        if (event.key === "ArrowRight") {
            event.preventDefault();
            goToNext();
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            goToPrev();
        }

    });

    layout();


    const cover =
        document.getElementById("book-cover");

    let coverOpened = false;

    function openCover() {

        if (coverOpened) return;

        coverOpened = true;

        cover.classList.add("opened");

    }

    if (cover) {

        cover.addEventListener("click", openCover);

        cover.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openCover();
            }
        });

    }

})();


/* =========================================
   PHOTO GALLERY
========================================= */

function initGallery(wrap) {

    const track =
        wrap.querySelector(".gallery-frame-track");

    const prevButton =
        wrap.querySelector(".gallery-nav-prev");

    const nextButton =
        wrap.querySelector(".gallery-nav-next");

    const dotsContainer =
        wrap.parentElement.querySelector(".gallery-dots");

    if (!track || !dotsContainer) return;

    const slides =
        Array.from(track.children);

    let index = 0;
    let isDown = false;
    let dragMoved = false;
    let startX = 0;
    let startScroll = 0;


    slides.forEach((_, i) => {

        const dot = document.createElement("span");

        if (i === 0) dot.classList.add("active");

        dot.addEventListener("click", () => goTo(i));

        dotsContainer.appendChild(dot);

    });

    const dots =
        Array.from(dotsContainer.children);


    function updateControls() {

        if (prevButton) prevButton.disabled = index === 0;
        if (nextButton) nextButton.disabled = index === slides.length - 1;

        dots.forEach(
            (dot, i) => dot.classList.toggle("active", i === index)
        );

    }


    function goTo(i) {

        index = Math.max(0, Math.min(slides.length - 1, i));

        track.scrollTo({
            left: slides[index].offsetLeft,
            behavior: "smooth"
        });

        updateControls();

    }


    if (prevButton) prevButton.addEventListener("click", () => goTo(index - 1));
    if (nextButton) nextButton.addEventListener("click", () => goTo(index + 1));


    let scrollTimer = null;

    track.addEventListener(
        "scroll",
        () => {

            if (scrollTimer) clearTimeout(scrollTimer);

            scrollTimer = setTimeout(
                () => {

                    let closestIndex = 0;
                    let closestDistance = Infinity;

                    slides.forEach((slide, i) => {

                        const distance =
                            Math.abs(slide.offsetLeft - track.scrollLeft);

                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestIndex = i;
                        }

                    });

                    index = closestIndex;
                    updateControls();

                },
                120
            );

        },
        { passive: true }
    );


    track.addEventListener("mousedown", event => {

        isDown = true;
        dragMoved = false;
        track.classList.add("dragging");
        startX = event.pageX;
        startScroll = track.scrollLeft;

    });

    window.addEventListener("mouseup", () => {

        if (!isDown) return;

        isDown = false;
        track.classList.remove("dragging");

        if (dragMoved) goTo(
            Math.round(track.scrollLeft / track.clientWidth)
        );

    });

    window.addEventListener("mousemove", event => {

        if (!isDown) return;

        const delta = event.pageX - startX;

        if (Math.abs(delta) > 5) dragMoved = true;

        track.scrollLeft = startScroll - delta;

    });

    track.addEventListener("click", event => {

        if (dragMoved) {
            event.preventDefault();
            event.stopPropagation();
        }

    });


    track.setAttribute("tabindex", "0");

    track.addEventListener("keydown", event => {

        if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(index + 1);
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(index - 1);
        }

    });


    updateControls();

}

document.querySelectorAll(".gallery-wrap").forEach(initGallery);


/* =========================================
   RSVP BUTTON
========================================= */

const rsvpButton =
    document.querySelector(".rsvp-button");

const rsvpToast =
    document.getElementById("rsvp-toast");


if (rsvpButton && rsvpToast) {

    let toastTimer = null;

    rsvpButton.addEventListener(
        "click",
        () => {

            rsvpToast.classList.add("visible");

            if (toastTimer) clearTimeout(toastTimer);

            toastTimer = setTimeout(
                () => {
                    rsvpToast.classList.remove("visible");
                },
                3600
            );

        }
    );

}


/* =========================================
   MUSIC BUTTON
========================================= */

const musicButton =
    document.getElementById("music-button");

const bgMusic =
    document.getElementById("bg-music");

if (musicButton) {

    musicButton.addEventListener(
        "click",
        () => {

            const isPlaying =
                musicButton.classList.toggle("is-playing");

            musicButton.setAttribute(
                "aria-pressed",
                String(isPlaying)
            );

            musicButton.setAttribute(
                "aria-label",
                isPlaying ? "Pause background music" : "Play background music"
            );

            if (bgMusic) {

                if (isPlaying) {

                    bgMusic.play().catch(() => {
                    });

                } else {

                    bgMusic.pause();

                }

            }

        }
    );

}


/* =========================================
   MODEL SWATCHES — DRESS CODE

   Cycles the man + woman croquis figures in
   the dress-code section through the seven
   palette colors. Both figures share one CSS
   variable (--model-color) on :root, so a
   single click updates them together, and
   each figure's caption line is updated to
   name the currently-selected color.
========================================= */

(function initModelSwatches() {

    const swatches =
        document.querySelectorAll(".model-swatch");

    const labels =
        document.querySelectorAll(".model-figure p");

    if (!swatches.length) return;

    swatches.forEach(swatch => {

        swatch.addEventListener("click", () => {

            const color = swatch.dataset.color;
            const name = swatch.dataset.name;

            document.documentElement.style.setProperty(
                "--model-color",
                color
            );

            swatches.forEach(s => s.classList.remove("active"));
            swatch.classList.add("active");

            labels.forEach(label => {

                const suffix =
                    label.textContent.split("\u00b7")[1] || "";

                label.textContent = `${name} \u00b7${suffix}`;

            });

        });

    });

})();
