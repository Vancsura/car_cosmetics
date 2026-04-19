document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// Az email küldéshez a legjobb megoldás backend használata lenne, de jelen esetben a frontend megoldást választottam az egyszerűség kedvéért.
// A változókat nem lehet a jelenlegi környezetben megfelelően importálni, ezért az email küldés most nem működik.
emailjs.init({
  publicKey: "PUBLIC_KEY",
});

const form = document.getElementById("contact-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  emailjs
    .sendForm("SERVICE_KEY", "TEMPLATE_KEY", form)
    .then(() => {
      alert("Message sent successfully!");
      form.reset();
    })
    .catch((error) => {
      alert("Failed to send message.");
      console.error(error);
    });
});

const slider = document.querySelector(".services-slider");
const track = document.querySelector(".services-track");

let currentTranslate = 0;
let targetTranslate = 0;
let animationFrame = null;

function isMobile() {
  return window.innerWidth <= 768;
}

function clampTranslate(value) {
  const sliderWidth = slider.offsetWidth;
  const trackWidth = track.scrollWidth;

  const minTranslate = Math.min(0, sliderWidth - trackWidth);
  const maxTranslate = 0;

  if (value > maxTranslate) return maxTranslate;
  if (value < minTranslate) return minTranslate;
  return value;
}

function setSliderPosition() {
  track.style.transform = `translateX(${currentTranslate}px)`;
}

function animateSlider() {
  const diff = targetTranslate - currentTranslate;

  if (Math.abs(diff) < 0.5) {
    currentTranslate = targetTranslate;
    setSliderPosition();
    animationFrame = null;
    return;
  }

  currentTranslate += diff * 0.08;
  setSliderPosition();

  animationFrame = requestAnimationFrame(animateSlider);
}

slider.addEventListener("mousemove", (e) => {
  if (isMobile()) return;

  const rect = slider.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const percent = mouseX / rect.width;

  const sliderWidth = slider.offsetWidth;
  const trackWidth = track.scrollWidth;
  const maxScroll = Math.max(0, trackWidth - sliderWidth);

  targetTranslate = -(maxScroll * percent);
  targetTranslate = clampTranslate(targetTranslate);

  if (!animationFrame) {
    animationFrame = requestAnimationFrame(animateSlider);
  }
});

slider.addEventListener("mouseleave", () => {
  if (isMobile()) return;

  if (!animationFrame) {
    animationFrame = requestAnimationFrame(animateSlider);
  }
});

window.addEventListener("resize", () => {
  if (isMobile()) {
    currentTranslate = 0;
    targetTranslate = 0;
    track.style.transform = "none";
    return;
  }

  currentTranslate = clampTranslate(currentTranslate);
  targetTranslate = clampTranslate(targetTranslate);
  setSliderPosition();
});

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const item = question.parentElement;
    item.classList.toggle("active");
  });
});

const statNumbers = document.querySelectorAll(".stat-number");
const statsSection = document.querySelector(".stats");

let statsStarted = false;

function animateValue(element, target, duration = 1800) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(start + (target - start) * easedProgress);

    element.textContent = currentValue;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsStarted) {
        statsStarted = true;

        statNumbers.forEach((stat) => {
          const target = Number(stat.dataset.target);
          animateValue(stat, target);
        });

        obs.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.35,
  },
);

if (statsSection) {
  observer.observe(statsSection);
}
