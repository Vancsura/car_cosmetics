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
const submitButton = form.querySelector('button[type="submit"]');
const formStartedAt = Date.now();

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const icon = toast.querySelector(".toast-icon");
  const text = toast.querySelector(".toast-text");

  text.textContent = message;
  toast.classList.remove("success", "error");

  if (type === "error") {
    toast.classList.add("error");
    icon.textContent = "✖";
  } else {
    toast.classList.add("success");
    icon.textContent = "✔";
  }

  toast.classList.add("show");

  clearTimeout(toast.hideTimeout);
  toast.hideTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const honeypot = document.getElementById("website");
  const captchaResponse = grecaptcha.getResponse();
  const now = Date.now();
  const lastSent = Number(localStorage.getItem("lastFormSubmitTime") || "0");

  if (honeypot && honeypot.value.trim() !== "") {
    showToast("Spam detected.", "error");
    return;
  }

  if (now - formStartedAt < 4000) {
    showToast("Please wait a moment before sending.", "error");
    return;
  }

  if (now - lastSent < 30000) {
    showToast("Please wait 30 seconds before sending again.", "error");
    return;
  }

  if (!captchaResponse) {
    showToast("Please complete the reCAPTCHA.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  emailjs
    .sendForm("SERVICE_KEY", "TEMPLATE_KEY", form)
    .then(() => {
      localStorage.setItem("lastFormSubmitTime", String(Date.now()));
      showToast("Email sent successfully!", "success");
      form.reset();
      grecaptcha.reset();
    })
    .catch((error) => {
      console.error(error);
      showToast("Failed to send email.", "error");
      grecaptcha.reset();
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = "Send";
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

document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
    body.classList.remove("light-theme");
  } else {
    body.classList.add("light-theme");
    body.classList.remove("dark-theme");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (body.classList.contains("dark-theme")) {
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
        localStorage.setItem("theme", "light");
      } else {
        body.classList.remove("light-theme");
        body.classList.add("dark-theme");
        localStorage.setItem("theme", "dark");
      }
    });
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      mobileMenu.classList.toggle("show");
    });

    document.querySelectorAll("#mobileMenu a").forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("show");
      });
    });

    document.addEventListener("click", function (e) {
      if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileMenu.classList.remove("show");
      }
    });
  }
});
