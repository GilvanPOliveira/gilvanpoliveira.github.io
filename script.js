const buttons = document.querySelectorAll(".card-buttons button");
const sections = document.querySelectorAll(".card-section");
const card = document.querySelector(".card");
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let canvasWidth, canvasHeight;
let bgColor = "#87B5CE";
const animations = [];

const colorPicker = (() => {
  const colors = ["#182738", "#283E4F", "#43647A", "#698EA4", "#95B3C7", "#C6DBE9"];
  let index = 0;
  return {
    next: () => {
      index = (index + 1) % colors.length;
      return colors[index];
    },
    current: () => colors[index],
  };
})();

class Circle {
  constructor(options) {
    Object.assign(this, options);
  }

  draw() {
    ctx.globalAlpha = this.opacity ?? 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);

    if (this.stroke) {
      ctx.strokeStyle = this.stroke.color;
      ctx.lineWidth = this.stroke.width;
      ctx.stroke();
    }

    if (this.fill) {
      ctx.fillStyle = this.fill;
      ctx.fill();
    }

    ctx.closePath();
    ctx.globalAlpha = 1;
  }
}

const removeAnimation = (animation) => {
  const index = animations.indexOf(animation);
  if (index > -1) animations.splice(index, 1);
};

const calcPageFillRadius = (x, y) => {
  const l = Math.max(x, canvasWidth - x);
  const h = Math.max(y, canvasHeight - y);
  return Math.sqrt(l ** 2 + h ** 2);
};

const resizeCanvas = () => {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth * devicePixelRatio;
  canvas.height = canvasHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
};

const handleEvent = (e) => {
  if (e.touches && window.innerWidth >= 380) {
    e.preventDefault();
    e = e.touches[0];
  }

  const currentColor = colorPicker.current();
  const nextColor = colorPicker.next();
  const targetR = calcPageFillRadius(e.pageX, e.pageY);
  const rippleSize = Math.min(200, canvasWidth * 0.4);
  const minCoverDuration = 750;

  const pageFill = new Circle({
    x: e.pageX,
    y: e.pageY,
    r: 0,
    fill: nextColor,
  });

  const fillAnimation = anime({
    targets: pageFill,
    r: targetR,
    duration: Math.max(targetR / 2, minCoverDuration),
    easing: "easeOutQuart",
    complete: () => {
      bgColor = pageFill.fill;
      removeAnimation(fillAnimation);
    },
  });

  const ripple = new Circle({
    x: e.pageX,
    y: e.pageY,
    r: 0,
    fill: currentColor,
    stroke: { width: 3, color: currentColor },
    opacity: 1,
  });

  const rippleAnimation = anime({
    targets: ripple,
    r: rippleSize,
    opacity: 0,
    easing: "easeOutExpo",
    duration: 900,
    complete: () => removeAnimation(rippleAnimation),
  });

  const particles = Array.from({ length: 32 }, () => new Circle({
    x: e.pageX,
    y: e.pageY,
    fill: currentColor,
    r: anime.random(24, 48),
  }));

  const particlesAnimation = anime({
    targets: particles,
    x: (p) => p.x + anime.random(-rippleSize, rippleSize),
    y: (p) => p.y + anime.random(-rippleSize * 1.15, rippleSize * 1.15),
    r: 0,
    easing: "easeOutExpo",
    duration: anime.random(1000, 1300),
    complete: () => removeAnimation(particlesAnimation),
  });

  animations.push(fillAnimation, rippleAnimation, particlesAnimation);
};

const addClickListeners = () => {
  document.addEventListener("mousedown", handleEvent);
  document.addEventListener("touchstart", handleEvent);
};

const animate = anime({
  duration: Infinity,
  update: () => {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    animations.forEach((anim) => {
      anim.animatables.forEach(({ target }) => target.draw());
    });
  },
});

const fauxClick = (x, y) => {
  const event = new Event("mousedown");
  event.pageX = x;
  event.pageY = y;
  document.dispatchEvent(event);
};

const startFauxClicking = () => {
  setTimeout(() => {
    fauxClick(anime.random(canvasWidth * 0.2, canvasWidth * 0.8), anime.random(canvasHeight * 0.2, canvasHeight * 0.8));
    startFauxClicking();
  }, anime.random(200, 900));
};

const handleInactiveUser = () => {
  const timeout = setTimeout(() => fauxClick(canvasWidth / 2, canvasHeight / 2), 2000);
  const clear = () => {
    clearTimeout(timeout);
    document.removeEventListener("mousedown", clear);
    document.removeEventListener("touchstart", clear);
  };

  document.addEventListener("mousedown", clear);
  document.addEventListener("touchstart", clear);
};

// Troca entre seções
const handleButtonClick = (e) => {
  const targetSection = e.target.getAttribute("data-section");
  const section = document.querySelector(targetSection);

  if (targetSection !== "#about" && targetSection !== "#contact") {
    card.classList.add("is-active");
  } else {
    card.classList.remove("is-active");
  }

  if (window.innerWidth <= 320) {
    if (
      ["#about", "#contact", "#experience", "#project"].includes(targetSection)
    ) {
      card.classList.remove("is-active");
    } else {
      card.classList.add("is-active");
    }
  }

  sections.forEach((s) => s.classList.remove("is-active"));
  buttons.forEach((b) => b.classList.remove("is-active"));

  e.target.classList.add("is-active");
  section.classList.add("is-active");

  // Acessibilidade
  buttons.forEach((btn) => btn.setAttribute("aria-selected", "false"));
  e.target.setAttribute("aria-selected", "true");
};

// MODO ESCURO
const toggleThemeButton = document.getElementById("toggle-theme");
const body = document.body;

const applyTheme = (theme) => {
  if (theme === "dark") {
    body.classList.add("dark-mode");
    toggleThemeButton.textContent = "Modo Claro";
  } else {
    body.classList.remove("dark-mode");
    toggleThemeButton.textContent = "Modo Escuro";
  }
};

const toggleTheme = () => {
  const isDark = body.classList.toggle("dark-mode");
  const newTheme = isDark ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  toggleThemeButton.textContent = isDark ? "Modo Claro" : "Modo Escuro";
};

toggleThemeButton.addEventListener("click", toggleTheme);

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
});

// Inicialização
(() => {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  addClickListeners();
  if (window.location.pathname.includes("fullcpgrid")) {
    startFauxClicking();
  }
  handleInactiveUser();
  buttons.forEach((btn) => btn.addEventListener("click", handleButtonClick));
})();
