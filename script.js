document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// A kulcsok környezeti változókból érhetők el.
emailjs.init({
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
});

const form = document.getElementById("contact-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  emailjs
    .sendForm(import.meta.env.VITE_SERVICE_KEY, import.meta.env.VITE_TEMPLATE_KEY, form)
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
