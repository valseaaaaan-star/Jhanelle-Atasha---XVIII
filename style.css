/* =========================================
   ELEMENTS
========================================= */

const scrollScene =
    document.querySelector(".scroll-scene");

const inviteScroll =
    document.getElementById("invite-scroll");


/* =========================================
   SCROLL-OPEN EXPERIENCE

   The invitation is an actual scroll of parchment, rolled
   shut around two rods and tied with a ribbon + wax seal.
   As the person scrolls through the .scroll-scene section,
   a single progress value (0 = rolled shut, 1 = fully
   unrolled) is written to the --p custom property on the
   .scroll element, and every moving part — the two rods,
   the parchment's reveal, the ribbon, and the wax — reads
   from that one variable via calc() in style.css. This file
   only has to compute and smooth that one number.

   NOTES carried over from the previous envelope version:
   1. `window.innerHeight` is cached and only refreshed on
      resize, since re-reading it on every scroll event made
      the math jitter as mobile browser chrome shows/hides.
   2. There's a guard against `height - viewport` being zero
      or negative (section shorter than the viewport), which
      falls back to a simple open/closed state.
   3. The scroll handler is wrapped in requestAnimationFrame
      so it runs at most once per frame instead of once per
      scroll event.
   4. A continuously-running rAF loop eases the displayed
      progress toward the scroll-derived target each frame
      (a simple lerp), so the open motion stays smooth even
      when the underlying scroll events are choppy.
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

        /* Section is shorter than the viewport — just snap
           open once we've scrolled roughly to it. */
        progress = rect.top < viewportHeight / 2 ? 1 : 0;

    }

    return Math.max(0, Math.min(1, progress));

}


function renderScroll(progress) {

    if (!inviteScroll) return;

    /* every rod, ribbon, wax, and clip-path calculation lives
       in style.css as a function of this one variable */
    inviteScroll.style.setProperty("--p", progress);

}


function scrollOpenLoop() {

    targetProgress = computeTargetProgress();

    /* ease the displayed value toward the target instead of
       snapping straight to it — this is what smooths out
       choppy scroll input into a fluid open/close motion */
    displayProgress +=
        (targetProgress - displayProgress) * .12;

    /* once it's close enough, settle exactly so the rods
       don't hover a fraction of a pixel off fully open or
       fully shut forever */
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

   Slightly earlier trigger (rootMargin) and a lower
   threshold so the fade-in lines up more naturally with
   scroll speed instead of popping in right at the edge —
   the actual "smoother fade" is mostly styling (see the
   scroll-reveal rules in style.css), this just times it
   better.
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
   (18 Roses / 18 Treasures / 18 Blue Bills / 18 Candles)

   Each .book-page is a real two-sided leaf. Turning forward
   rotates the current page to -180deg around its spine edge;
   backface-visibility hides its front once it passes 90deg,
   revealing the next page already sitting flat beneath it.
   Turning backward reverses this, but needs the page being
   restored temporarily raised above the current page in
   z-index so it's the one visible as it sweeps back into
   place — layout() re-applies the correct stacking after
   every move so a stale z-index never lingers.

   A front COVER sits above all of this as its own leaf
   (z-index: 999 in CSS) and opens once, independently of the
   page-turn logic below — see initBookCover().
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

                /* already turned — parked face-down at the back */
                page.style.transform = "rotateY(-180deg)";
                page.style.zIndex = String(i);

            } else if (i === currentIndex) {

                page.style.transform = "rotateY(0deg)";
                page.style.zIndex = String(pages.length + 10);

            } else {

                /* upcoming — stacked in order beneath the active page */
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


    function goToNext(onDone) {

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
                if (onDone) onDone();
            },
            TURN_MS
        );

    }


    function goToPrev(onDone) {

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
                if (onDone) onDone();
            },
            TURN_MS
        );

    }


    function goTo(index) {

        if (animating || index === currentIndex) return;

        /* step through pages one at a time so every leaf in between
           still visibly turns, rather than jump-cutting. Each step
           waits for the previous flip's own completion callback
           (rather than a second, independently-timed setTimeout)
           so the sequence can never race ahead of or fall behind
           the actual animation — a dropped frame or a slightly
           delayed transitionend no longer desyncs the chain. */
        const step = () => {

            if (currentIndex < index) {
                goToNext(step);
            } else if (currentIndex > index) {
                goToPrev(step);
            }

        };

        step();

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

    /* left/right arrow keys turn the page when the book has focus
       or when nothing more specific on the page is focused */
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


    /* -----------------------------------------
       BOOK COVER — opens once, independently of
       the page-turn logic above. Sits on its own
       top layer so it doesn't need to touch
       currentIndex/z-index bookkeeping at all;
       the roses page (index 0) is already
       positioned underneath it.
    ----------------------------------------- */

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
   Each themed gallery page (.gallery-wrap) gets its own
   independent swipeable album: native touch scrolling handles
   mobile swipes (with CSS scroll-snap settling on each frame),
   while mouse users on desktop get click-drag panning plus the
   arrow buttons and dots. All three input paths converge on the
   same goTo()/index bookkeeping so the arrows, dots, and the
   frame currently centered in view never fall out of sync.
   initGallery() is called once per .gallery-wrap found on the
   page, so the red page and the soft page each run their own
   isolated instance.
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


    /* keep index in sync when the user free-scrolls or swipes
       with native touch scrolling, rather than only reacting
       to the arrow/dot clicks above */
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


    /* click-and-drag panning for mouse users on desktop —
       touch devices already get native swipe scrolling above,
       so this only wires up mouse events */
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

    /* swallow the click that follows a drag so it doesn't
       register as an accidental tap on the photo underneath */
    track.addEventListener("click", event => {

        if (dragMoved) {
            event.preventDefault();
            event.stopPropagation();
        }

    });


    /* keyboard support when the gallery has focus */
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

   Replaces the earlier native alert() — a system dialog
   breaks out of the invitation's own voice and look. This
   shows a soft in-page confirmation instead.
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

   Previously purely decorative (an aria-label with no
   behavior behind it). Now toggles play/pause on the
   background <audio> element and reflects state via
   aria-pressed. If no real track has been added yet
   (see the TODO on the <audio> tag in index.html), it
   still toggles state/visuals so the control isn't dead,
   and quietly no-ops the actual playback.
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
                        /* no audio source configured yet, or the
                           browser blocked autoplay — fail silently
                           rather than throwing a console error */
                    });

                } else {

                    bgMusic.pause();

                }

            }

        }
    );

}
