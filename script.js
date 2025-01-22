// Countdown Timer
function updateCountdown() {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0);

  const difference = tomorrow - now;

  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  document.getElementById("hours").textContent = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("minutes").textContent = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("seconds").textContent = seconds
    .toString()
    .padStart(2, "0");
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// CTA Buttons click handlers
const ctaButtons = document.querySelectorAll(".cta-button");
ctaButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Add your enrollment form or payment gateway link here
    alert("Redirecionando para o formulário de inscrição...");
  });
});

// Video placeholder click handler
const videoPlaceholder = document.querySelector(".video-placeholder");
if (videoPlaceholder) {
  videoPlaceholder.addEventListener("click", () => {
    // Add your video player implementation here
    alert("Reproduzindo vídeo...");
  });
}

// Add scroll animation for elements
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for animation
const animatedElements = document.querySelectorAll(
  ".benefit-item, .bonus-item, .testimonial, .step"
);
animatedElements.forEach((element) => {
  observer.observe(element);
});

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
