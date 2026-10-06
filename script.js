/* ===== SETTINGS: change your roles here ===== */
const ROLES = ["BSIT Student", "Web Developer", "Backend Developer"];

/* ===== SETTINGS: your skills (edit this list) =====
   Each item is [label, icon path from the Devicon library, optional "invert"].
   Browse icon names at devicon.dev. Use "invert" for black icons on dark backgrounds. */
const TECH = [
  {
    title: "Programming Languages",
    dot: "#ff7a1a",
    dur: 38, // seconds for one loop: bigger = slower
    items: [
      ["Java", "java/java-original"],
      ["C#", "csharp/csharp-original"],
      ["PHP", "php/php-original"],
      ["JavaScript", "javascript/javascript-original"],
      ["HTML", "html5/html5-original"],
      ["CSS", "css3/css3-original"],
    ],
  },
  {
    title: "Frameworks & Libraries",
    dot: "#00b4ff",
    dur: 42,
    items: [
      ["Spring Boot", "spring/spring-original"],
      ["Laravel", "laravel/laravel-original"],
      ["ASP.NET Core", "dotnetcore/dotnetcore-original"],
      ["Maven", "maven/maven-original"],
    ],
  },
  {
    title: "Databases & DevOps",
    dot: "#8b5cf6",
    dur: 36,
    items: [
      ["PostgreSQL", "postgresql/postgresql-original"],
      ["MySQL", "mysql/mysql-original"],
      ["Docker", "docker/docker-original"],
      ["Git", "git/git-original"],
      ["GitHub", "github/github-original", "invert"],
    ],
  },
  {
    title: "Tools",
    dot: "#22c55e",
    dur: 44,
    items: [
      ["VS Code", "vscode/vscode-original"],
      ["Postman", "postman/postman-original"],
      ["Figma", "figma/figma-original"],
      ["Git", "git/git-original"],
    ],
  },
];

/* ---------- 1. Typing effect ---------- */
// Types a role letter by letter, waits, deletes it, then moves to the next role.
function initTyping() {
  const el = document.getElementById("typing");
  let role = 0,
    char = 0,
    deleting = false;

  function tick() {
    const word = ROLES[role];
    char += deleting ? -1 : 1;
    el.textContent = word.slice(0, char);

    let delay = deleting ? 50 : 110;
    if (!deleting && char === word.length) {
      deleting = true;
      delay = 1400;
    } // pause at full word
    else if (deleting && char === 0) {
      deleting = false;
      role = (role + 1) % ROLES.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  }
  tick();
}

/* ---------- 2. Three.js 3D background ---------- */
// A glowing wireframe shape plus floating particles. They follow the mouse.
// The shape fades and drifts aside as you scroll, so it does not clash with the skills.
function initThree() {
  if (typeof THREE === "undefined") return; // CDN failed: site still works without it

  const canvas = document.getElementById("bg");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  camera.position.z = 6;

  // Read the accent color from CSS so the theme stays in one place
  const accent =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim() || "#00e5ff";

  // Rotating wireframe shape
  const shape = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2, 1),
    new THREE.MeshBasicMaterial({
      color: accent,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    }),
  );
  scene.add(shape);

  // Floating particles
  const COUNT = window.innerWidth < 700 ? 400 : 900;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < positions.length; i++)
    positions[i] = (Math.random() - 0.5) * 20;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: accent,
      size: 0.03,
      transparent: true,
      opacity: 0.8,
    }),
  );
  scene.add(particles);

  // Mouse position, from -1 to 1
  const mouse = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // Keep the scene sharp when the window changes size
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    // 0 at the top of the page, 1 once you have scrolled about one screen
    const scroll = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);

    shape.rotation.x += 0.003;
    shape.rotation.y += 0.004;
    shape.material.opacity = 0.35 - 0.3 * scroll; // fades from 0.35 to 0.05
    shape.position.x = scroll * 3; // drifts to the right
    particles.rotation.y += 0.0006;

    // Ease the camera toward the mouse for a smooth parallax feel
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.y * 0.8 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

/* ---------- 3. Scroll reveal ---------- */
// Adds the .show class when an element enters the screen.
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // animate only once
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ---------- 4. Mobile menu ---------- */
// Opens and closes the hamburger menu. Closes after a link is tapped.
function initMobileMenu() {
  const btn = document.getElementById("hamburger");
  const links = document.getElementById("navLinks");

  function toggle(open) {
    btn.classList.toggle("open", open);
    links.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open);
  }
  btn.addEventListener("click", () =>
    toggle(!links.classList.contains("open")),
  );
  links
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", () => toggle(false)));
}

/* ---------- 5. Card tilt ---------- */
// Rotates a card toward the mouse using perspective + rotateX/rotateY.
function initTilt() {
  if (!window.matchMedia("(hover: hover)").matches) return; // skip on touch screens
  const MAX = 12; // maximum tilt in degrees

  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * MAX}deg) rotateY(${x * MAX}deg) scale(1.03)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ---------- 6. Contact form + footer year ---------- */
// No server needed: opens the visitor's email app with the message filled in.
function initContact() {
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const msg = document.getElementById("message").value;
    const body = encodeURIComponent(`${msg}\n\nFrom: ${name} (${email})`);
    window.location.href = `mailto:aldredrecana0915@gmail.com?subject=Portfolio%20message%20from%20${encodeURIComponent(name)}&body=${body}`;
  });
}

/* ---------- 7. Skills marquee ---------- */
// Builds the moving rows of tech tiles from the TECH list at the top.
function initTechMarquee() {
  const wrap = document.getElementById("techRows");
  if (!wrap) return; // section missing from the HTML: do nothing

  const icon = (path) =>
    `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${path}.svg`;

  wrap.innerHTML = TECH.map((row, i) => {
    // Repeat the items until one half is wide enough, then double it.
    // Moving the track by -50% then loops with no visible jump.
    const reps = Math.ceil(14 / row.items.length);
    const half = Array.from({ length: reps }, () => row.items).flat();
    const tiles = [...half, ...half]
      .map(
        ([name, path, cls]) =>
          `<div class="tile"><img class="${cls || ""}" src="${icon(path)}" alt="" loading="lazy"><span>${name}</span></div>`,
      )
      .join("");

    // Every second row scrolls the other way
    return `<div class="tech-row ${i % 2 ? "reverse" : ""}" style="--dot:${row.dot};--dur:${row.dur}s">
      <div class="tech-label">${row.title}</div>
      <div class="tech-window"><div class="tech-track">${tiles}</div></div>
    </div>`;
  }).join("");
}

/* ---------- Start everything ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initTyping();
  initThree();
  initReveal();
  initMobileMenu();
  initTilt();
  initContact();
  initTechMarquee();
});
