const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const cursorGlow = document.querySelector(".cursor-glow");
const year = document.querySelector("#year");

year.textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const opened = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", opened ? "true" : "false");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const target = entry.target;
      const finalNumber = Number(target.dataset.count);
      const duration = 1200;
      const start = performance.now();

      function animate(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        target.textContent = Math.round(finalNumber * eased);
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
      countObserver.unobserve(target);
    });
  },
  { threshold: 0.55 }
);

document.querySelectorAll("[data-count]").forEach((element) => {
  countObserver.observe(element);
});

document.querySelectorAll(".accordion-button").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const content = button.nextElementSibling;

    document.querySelectorAll(".accordion-button").forEach((otherButton) => {
      if (otherButton === button) return;
      otherButton.setAttribute("aria-expanded", "false");
      otherButton.nextElementSibling.style.maxHeight = 0;
    });

    button.setAttribute("aria-expanded", String(!expanded));
    content.style.maxHeight = expanded ? 0 : `${content.scrollHeight}px`;
  });
});

const magneticElements = document.querySelectorAll(".magnetic");

magneticElements.forEach((element) => {
  element.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    element.style.transform = `translate(${x * 0.08}px, ${y * 0.14}px)`;
  });

  element.addEventListener("mouseleave", () => {
    element.style.transform = "";
  });
});

window.addEventListener("pointermove", (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.opacity = "1";
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

window.addEventListener("pointerleave", () => {
  if (!cursorGlow) return;
  cursorGlow.style.opacity = "0";
});

const canvas = document.querySelector("#auroraCanvas");
const ctx = canvas.getContext("2d");
let width;
let height;
let particles = [];
let animationFrame;

function setupCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.width = Math.floor(window.innerWidth * dpr);
  height = canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = window.innerWidth < 760 ? 34 : 62;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 2.6 + 0.8,
    speedX: (Math.random() - 0.5) * 0.28,
    speedY: (Math.random() - 0.5) * 0.28,
    alpha: Math.random() * 0.38 + 0.1
  }));
}

function drawAurora() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const gradientOne = ctx.createRadialGradient(
    window.innerWidth * 0.22,
    window.innerHeight * 0.18,
    0,
    window.innerWidth * 0.22,
    window.innerHeight * 0.18,
    window.innerWidth * 0.64
  );
  gradientOne.addColorStop(0, "rgba(255,157,187,0.11)");
  gradientOne.addColorStop(1, "rgba(255,157,187,0)");

  const gradientTwo = ctx.createRadialGradient(
    window.innerWidth * 0.82,
    window.innerHeight * 0.36,
    0,
    window.innerWidth * 0.82,
    window.innerHeight * 0.36,
    window.innerWidth * 0.58
  );
  gradientTwo.addColorStop(0, "rgba(201,167,255,0.105)");
  gradientTwo.addColorStop(1, "rgba(201,167,255,0)");

  ctx.fillStyle = gradientOne;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = gradientTwo;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < -10) particle.x = window.innerWidth + 10;
    if (particle.x > window.innerWidth + 10) particle.x = -10;
    if (particle.y < -10) particle.y = window.innerHeight + 10;
    if (particle.y > window.innerHeight + 10) particle.y = -10;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,248,239,${particle.alpha})`;
    ctx.fill();
  });

  animationFrame = requestAnimationFrame(drawAurora);
}

setupCanvas();
drawAurora();

window.addEventListener("resize", () => {
  cancelAnimationFrame(animationFrame);
  setupCanvas();
  drawAurora();
});
