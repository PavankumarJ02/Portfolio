const nav = document.querySelector(".nav");
const reveals = document.querySelectorAll(".reveal");
const year = document.getElementById("year");
const themeToggle = document.getElementById("theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const homeViewSections = document.querySelectorAll(".home-view-section");
const blogViewSections = document.querySelectorAll(".blog-view-section");
const blogNavLink = document.querySelector('.nav-links a[href="#blog"]');
const storageKey = "portfolio-theme";
const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
const blogHashes = new Set([
  "#blog",
  "#project-blogs",
  "#tracker-project",
  "#music-project",
  "#next-writing",
]);

const applyTheme = (theme) => {
  document.body.setAttribute("data-theme", theme);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
  }

  if (themeMeta) {
    themeMeta.setAttribute("content", theme === "dark" ? "#111313" : "#f5f1e8");
  }
};

const getPreferredTheme = () => {
  const savedTheme = window.localStorage.getItem(storageKey);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return themeMedia.matches ? "dark" : "light";
};

const syncNavState = () => {
  if (!nav) return;
  nav.classList.toggle("is-scrolled", window.scrollY > 16);
};

const isBlogHash = (hash) => blogHashes.has(hash);

const setView = (view) => {
  const showBlog = view === "blog";

  homeViewSections.forEach((section) => {
    section.hidden = showBlog;
  });

  blogViewSections.forEach((section) => {
    section.hidden = !showBlog;
  });

  if (blogNavLink) {
    blogNavLink.classList.toggle("nav-link-current", showBlog);
    if (showBlog) {
      blogNavLink.setAttribute("aria-current", "page");
    } else {
      blogNavLink.removeAttribute("aria-current");
    }
  }
};

const scrollToHashTarget = (hash, behavior = "smooth") => {
  if (!hash || hash === "#top") {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const target = document.querySelector(hash);
  if (target) {
    target.scrollIntoView({ behavior, block: "start" });
  }
};

const syncViewFromHash = () => {
  setView(isBlogHash(window.location.hash) ? "blog" : "home");
};

applyTheme(getPreferredTheme());
syncViewFromHash();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    window.localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  });
}

themeMedia.addEventListener("change", (event) => {
  if (window.localStorage.getItem(storageKey)) return;
  applyTheme(event.matches ? "dark" : "light");
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  reveals.forEach((item) => revealObserver.observe(item));
} else {
  reveals.forEach((item) => item.classList.add("is-visible"));
}

if (year) {
  year.textContent = new Date().getFullYear();
}

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;

  const hash = link.getAttribute("href");
  if (!hash) return;

  event.preventDefault();
  setView(isBlogHash(hash) ? "blog" : "home");

  if (window.location.hash === hash) {
    requestAnimationFrame(() => scrollToHashTarget(hash));
    return;
  }

  window.location.hash = hash;
});

window.addEventListener("hashchange", () => {
  syncViewFromHash();
});

if (window.location.hash) {
  requestAnimationFrame(() => {
    syncViewFromHash();
    scrollToHashTarget(window.location.hash, "auto");
  });
}

syncNavState();

window.addEventListener("scroll", syncNavState, { passive: true });
