const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const navigationMenus = [
  {
    label: "About",
    image: "assets/projects/maramer-hq.jpg",
    imageAlt: "Maramer headquarters with the company sign",
    links: [
      ["Company overview", "#about"],
      ["Vision, mission & values", "#about"],
      ["History & milestones", "#milestones"],
      ["Leadership", "#about"],
      ["Geographic presence", "#top"],
      ["Certifications & downloads", "#about"],
    ],
  },
  {
    label: "Capabilities",
    image: "assets/projects/maramer-high-rise.png",
    imageAlt: "Maramer high-rise superstructure project",
    links: [
      ["Superstructure", "#capabilities"],
      ["Infrastructure", "#capabilities"],
      ["Landscape & Green Maramer", "#sustainability"],
      ["Industrial projects", "#capabilities"],
      ["Modular & prefab", "#capabilities"],
    ],
  },
  {
    label: "Projects",
    image: "assets/projects/maramer-masterplan.png",
    imageAlt: "Aerial view of a Maramer integrated development project",
    links: [
      ["Projects listing", "#projects"],
      ["Project detail", "#projects"],
      ["Superstructure projects", "#projects"],
      ["Infrastructure projects", "#projects"],
      ["Landscape projects", "#projects"],
      ["Industrial projects", "#projects"],
      ["Modular & prefab projects", "#projects"],
    ],
  },
  {
    label: "Sustainability",
    image: "assets/projects/green-maramer.jpg",
    imageAlt: "Landscaped public realm delivered by Maramer",
    links: [
      ["Saudi Green Initiative", "#sustainability"],
      ["Quality", "#sustainability"],
      ["Health & safety", "#sustainability"],
      ["Environmental management", "#sustainability"],
    ],
  },
  {
    label: "Media & Insights",
    image: "assets/projects/project-office.jpg",
    imageAlt: "Contemporary project office interior",
    links: [
      ["Gallery", "#media"],
      ["News & updates", "#media"],
    ],
  },
  {
    label: "Contact Us",
    image: "assets/projects/maramer-hq.jpg",
    imageAlt: "Maramer headquarters exterior",
    links: [
      ["Request a quote", "#contact"],
      ["Tender & procurement", "#contact"],
      ["General enquiries", "mailto:info@maramer.sa"],
      ["Office locations", "#careers"],
    ],
  },
];

const populateNavigation = (nav, idPrefix) => {
  if (!nav) return;

  navigationMenus.forEach((menu, index) => {
    if (menu.label === "Contact Us") return;
    const item = document.createElement("div");
    item.className = "nav-item";
    item.dataset.navItem = "";

    const trigger = document.createElement("button");
    trigger.className = "nav-trigger";
    trigger.type = "button";
    trigger.dataset.navDropdownTrigger = "";
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", `${idPrefix}-dropdown-${index + 1}`);
    trigger.append(document.createTextNode(menu.label));
    const chevron = document.createElement("span");
    chevron.className = "nav-chevron";
    chevron.setAttribute("aria-hidden", "true");
    trigger.append(chevron);

    const dropdown = document.createElement("div");
    dropdown.className = "nav-dropdown";
    dropdown.id = `${idPrefix}-dropdown-${index + 1}`;
    dropdown.setAttribute("aria-label", `${menu.label} links`);

    const dropdownInner = document.createElement("div");
    dropdownInner.className = "nav-dropdown-inner";

    const dropdownHeading = document.createElement("div");
    dropdownHeading.className = "nav-dropdown-heading";
    dropdownHeading.append(document.createTextNode(menu.label));

    const dropdownLinks = document.createElement("div");
    dropdownLinks.className = "nav-dropdown-links";
    const linkSplit = Math.ceil(menu.links.length / 2);
    [menu.links.slice(0, linkSplit), menu.links.slice(linkSplit)].forEach((linkGroup) => {
      if (!linkGroup.length) return;
      const column = document.createElement("div");
      column.className = "nav-dropdown-link-column";
      linkGroup.forEach(([label, href]) => {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = label;
        column.append(link);
      });
      dropdownLinks.append(column);
    });

    const dropdownMedia = document.createElement("div");
    dropdownMedia.className = "nav-dropdown-media";
    const dropdownImage = document.createElement("img");
    dropdownImage.src = menu.image;
    dropdownImage.alt = menu.imageAlt;
    dropdownImage.loading = "lazy";
    dropdownMedia.append(dropdownImage);

    dropdownInner.append(dropdownHeading, dropdownLinks, dropdownMedia);
    dropdown.append(dropdownInner);

    item.append(trigger, dropdown);
    nav.append(item);
  });
};

const primaryNav = document.querySelector("[data-nav]");
const mobileNavList = document.querySelector("[data-mobile-nav-list]");
populateNavigation(primaryNav, "primary");
populateNavigation(mobileNavList, "mobile");

const closeDropdowns = (restoreFocus = false) => {
  document.querySelectorAll("[data-nav-item].is-open").forEach((item) => {
    item.classList.remove("is-open");
    item.querySelector("[data-nav-dropdown-trigger]")?.setAttribute("aria-expanded", "false");
    if (restoreFocus) item.querySelector("[data-nav-dropdown-trigger]")?.focus();
  });
};

document.querySelectorAll("[data-nav-dropdown-trigger]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest("[data-nav-item]");
    const shouldOpen = !item.classList.contains("is-open");
    closeDropdowns();
    if (!shouldOpen) return;
    item.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  });
});

[primaryNav, mobileNavList].forEach((nav) => {
  nav?.addEventListener("focusout", () => {
    window.setTimeout(() => {
      const openItem = nav.querySelector("[data-nav-item].is-open");
      if (openItem && !openItem.contains(document.activeElement)) {
        openItem.classList.remove("is-open");
        openItem.querySelector("[data-nav-dropdown-trigger]")?.setAttribute("aria-expanded", "false");
      }
    }, 0);
  });
});

document.addEventListener("pointerdown", (event) => {
  if (!event.target.closest("[data-nav-item]")) closeDropdowns();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const focusedItem = document.activeElement?.closest("[data-nav-item].is-open");
  if (document.querySelector("[data-nav-item].is-open")) {
    closeDropdowns(Boolean(focusedItem));
    return;
  }
  if (menuToggle?.getAttribute("aria-expanded") === "true") {
    menuToggle.setAttribute("aria-expanded", "false");
    mobileNav?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle.focus();
  }
});

document.querySelectorAll(".button").forEach((button) => {
  if (button.querySelector(".button-hover-layer")) return;
  const hoverLayer = document.createElement("span");
  hoverLayer.className = "button-hover-layer";
  hoverLayer.setAttribute("aria-hidden", "true");
  hoverLayer.innerHTML = [...button.children]
    .filter((child) => child.classList.contains("button-label") || child.classList.contains("button-arrow"))
    .map((child) => child.outerHTML)
    .join("");
  button.appendChild(hoverLayer);
});

const pageLoader = document.querySelector("[data-page-loader]");
const hero = document.querySelector(".hero");
const pageLoaderRows = pageLoader ? [...pageLoader.querySelectorAll(".page-loader-row")] : [];
let pageLoaderFirstVisit = true;
let pageLoaderReleased = false;

if (pageLoader) {
  try {
    pageLoaderFirstVisit = !sessionStorage.getItem("maramer-website-visited");
    sessionStorage.setItem("maramer-website-visited", "true");
  } catch (error) {
    pageLoaderFirstVisit = true;
  }

  pageLoaderRows.forEach((row, rowIndex) => {
    const blocks = [...row.querySelectorAll(".page-loader-panel")];
    const staggerStep = 0.8 / Math.max(1, blocks.length - 1);
    blocks.forEach((block, blockIndex) => {
      const staggerIndex = rowIndex % 2 === 0 ? blocks.length - 1 - blockIndex : blockIndex;
      block.style.setProperty("--page-loader-full-delay", `${1 + staggerIndex * (0.45 / Math.max(1, blocks.length - 1))}s`);
      block.style.setProperty("--page-loader-fast-delay", `${0.15 + staggerIndex * staggerStep}s`);
    });
  });

  if (!pageLoaderFirstVisit) pageLoader.classList.add("is-fast");
}

const releasePageLoader = () => {
  if (!pageLoader || pageLoaderReleased) return;
  pageLoaderReleased = true;
  if (reduceMotion || window.innerWidth <= 991) {
    pageLoader.classList.add("is-hidden");
    document.documentElement.classList.remove("is-loading");
    hero?.classList.add("is-revealing");
    hero?.classList.add("is-content-revealing");
    header?.classList.add("is-revealing");
    return;
  }
  document.documentElement.classList.add("is-loaded");
  document.documentElement.classList.remove("is-loading");
  pageLoader.classList.add("is-opening");
  window.setTimeout(() => {
    pageLoader.classList.add("is-hidden");
    hero?.classList.add("is-revealing", "is-content-revealing");
    header?.classList.add("is-revealing");
  }, pageLoaderFirstVisit ? 3020 : 2080);
};

if (pageLoader) {
  window.addEventListener("load", () => window.setTimeout(releasePageLoader, 180), { once: true });
  window.setTimeout(releasePageLoader, pageLoaderFirstVisit ? 5200 : 2700);
}

let scrollFramePending = false;

const parallaxItems = [...document.querySelectorAll("[data-parallax]")];

const updateScrollEffects = () => {
  const currentScrollY = window.scrollY;

  if (header) {
    header.classList.toggle("is-scrolled", currentScrollY > 24);
    header.classList.remove("is-hidden");
  }

  if (!reduceMotion) {
    parallaxItems.forEach((item) => {
      const bounds = item.getBoundingClientRect();
      if (bounds.bottom < -120 || bounds.top > window.innerHeight + 120) return;

      const centerOffset = bounds.top + bounds.height / 2 - window.innerHeight / 2;
      const travel = Math.max(window.innerHeight, bounds.height);
      const y = clamp((centerOffset / travel) * -28, -28, 28);
      item.style.setProperty("--parallax-y", `${y}px`);
    });
  }

  scrollFramePending = false;
};

const requestScrollEffects = () => {
  if (scrollFramePending) return;
  scrollFramePending = true;
  window.requestAnimationFrame(updateScrollEffects);
};

updateScrollEffects();
window.addEventListener("scroll", requestScrollEffects, { passive: true });
window.addEventListener("resize", requestScrollEffects, { passive: true });

if (header) {
  header.addEventListener("focusin", () => header.classList.remove("is-hidden"));
}

mobileNav?.querySelectorAll(':scope > nav > .button .button-label-text').forEach((label) => {
  label.textContent = "Contact Us";
});

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) closeDropdowns();
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mobileNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
    if (!isOpen && header) header.classList.remove("is-hidden");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeDropdowns();
      menuToggle.setAttribute("aria-expanded", "false");
      mobileNav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    });
  });
}

const revealItems = [...document.querySelectorAll(".reveal")];

revealItems.forEach((item) => {
  const hasExplicitDelay = [...item.classList].some((className) => className.startsWith("reveal-delay-"));
  if (hasExplicitDelay || !item.parentElement) return;

  const siblings = [...item.parentElement.children].filter((child) => child.classList.contains("reveal"));
  const siblingIndex = Math.max(0, siblings.indexOf(item));
  item.style.setProperty("--reveal-delay", `${Math.min(siblingIndex, 8) * 0.1}s`);
});

const animateStatValues = (showcase) => {
  const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
  showcase.querySelectorAll("[data-stat-target]").forEach((value) => {
    const target = Number(value.dataset.statTarget);
    const textNode = value.firstChild;
    const card = value.closest(".stats-card");
    if (!Number.isFinite(target) || !textNode || !card) return;

    const delay = Number.parseFloat(getComputedStyle(card).getPropertyValue("--stats-delay")) || 0;
    const formatValue = value.dataset.statFormat === "plain"
      ? (number) => String(number)
      : (number) => numberFormat.format(number);
    const startedAt = performance.now() + delay;
    textNode.nodeValue = formatValue(0);

    const countFrame = (now) => {
      const progress = Math.min(Math.max((now - startedAt) / 1100, 0), 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      textNode.nodeValue = formatValue(Math.round(target * easedProgress));
      if (progress < 1) window.requestAnimationFrame(countFrame);
      else textNode.nodeValue = formatValue(target);
    };
    window.requestAnimationFrame(countFrame);
  });
};

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      if (entry.target.matches(".stats-showcase")) {
        window.setTimeout(() => animateStatValues(entry.target), 260);
      }
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.01, rootMargin: "0px 0px -8%" },
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionLoadItems = [...document.querySelectorAll("main > section:not(.hero):not(.cta-section)")];
sectionLoadItems.forEach((section, index) => {
  section.classList.add("section-load");
  section.style.setProperty("--section-load-delay", `${Math.min(index, 4) * 0.1}s`);
});

const sectionLoadObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.01, rootMargin: "0px 0px -8%" },
);

sectionLoadItems.forEach((section) => {
  if (reduceMotion) section.classList.add("is-visible");
  sectionLoadObserver.observe(section);
});

const enableRailDrag = (rail) => {
  if (!rail || reduceMotion) return;

  let pointerId = null;
  let startX = 0;
  let startScrollLeft = 0;
  let lastX = 0;
  let velocity = 0;
  let momentumFrame = 0;
  let moved = false;
  let suppressClick = false;

  const stopMomentum = () => {
    if (!momentumFrame) return;
    cancelAnimationFrame(momentumFrame);
    momentumFrame = 0;
  };

  const finishMomentum = () => {
    momentumFrame = 0;
    rail.classList.remove("is-dragging");
  };

  const runMomentum = () => {
    velocity *= 0.93;
    if (Math.abs(velocity) < 0.08) {
      finishMomentum();
      return;
    }

    rail.scrollLeft -= velocity;
    momentumFrame = requestAnimationFrame(runMomentum);
  };

  const finishDrag = (event) => {
    if (pointerId === null || event.pointerId !== pointerId) return;

    if (moved) {
      suppressClick = true;
      window.setTimeout(() => { suppressClick = false; }, 0);
    }

    rail.releasePointerCapture?.(pointerId);
    pointerId = null;

    if (Math.abs(velocity) > 0.5) {
      momentumFrame = requestAnimationFrame(runMomentum);
    } else {
      finishMomentum();
    }
  };

  rail.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    stopMomentum();
    pointerId = event.pointerId;
    startX = lastX = event.clientX;
    startScrollLeft = rail.scrollLeft;
    velocity = 0;
    moved = false;
    rail.classList.add("is-dragging");
    rail.setPointerCapture?.(pointerId);
  });

  rail.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;

    const deltaX = event.clientX - lastX;
    if (Math.abs(event.clientX - startX) > 6) moved = true;
    rail.scrollLeft = startScrollLeft - (event.clientX - startX);
    velocity = deltaX;
    lastX = event.clientX;
    if (moved) event.preventDefault();
  }, { passive: false });

  rail.addEventListener("pointerup", finishDrag);
  rail.addEventListener("pointercancel", finishDrag);
  rail.addEventListener("dragstart", (event) => event.preventDefault());
  rail.addEventListener("click", (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }, true);
};

[document.querySelector(".capabilities-rail"), document.querySelector(".news-grid")].forEach(enableRailDrag);

const capabilitiesRail = document.querySelector(".capabilities-rail");
if (capabilitiesRail) {
  const capabilitySlides = [...capabilitiesRail.querySelectorAll(".capability-slide")];
  let capabilityRailFramePending = false;
  let activeCapabilityIndex = 0;
  let capabilityScrollSyncTimer;

  const getCapabilityScrollLeft = (slide) => Math.max(0, Math.round(slide.offsetLeft - capabilitiesRail.offsetLeft));

  const getNearestCapabilityIndex = () => capabilitySlides.reduce((closestIndex, slide, index) => {
    const closestDistance = Math.abs(getCapabilityScrollLeft(capabilitySlides[closestIndex]) - capabilitiesRail.scrollLeft);
    const slideDistance = Math.abs(getCapabilityScrollLeft(slide) - capabilitiesRail.scrollLeft);
    return slideDistance < closestDistance ? index : closestIndex;
  }, 0);

  const syncActiveCapability = () => {
    activeCapabilityIndex = getNearestCapabilityIndex();
  };

  const updateCapabilitiesParallax = () => {
    capabilityRailFramePending = false;
    if (reduceMotion) return;

    const railBounds = capabilitiesRail.getBoundingClientRect();
    const railCenter = railBounds.left + railBounds.width / 2;
    capabilitySlides.forEach((slide) => {
      const image = slide.querySelector("img");
      if (!image) return;
      const slideBounds = slide.getBoundingClientRect();
      const distance = (slideBounds.left + slideBounds.width / 2 - railCenter) / Math.max(1, railBounds.width);
      image.style.setProperty("--capability-image-x", `${clamp(distance * -22, -22, 22)}px`);
    });
  };

  const requestCapabilitiesParallax = () => {
    if (capabilityRailFramePending) return;
    capabilityRailFramePending = true;
    window.requestAnimationFrame(updateCapabilitiesParallax);

    window.clearTimeout(capabilityScrollSyncTimer);
    capabilityScrollSyncTimer = window.setTimeout(syncActiveCapability, 120);
  };

  const moveCapability = (direction) => {
    activeCapabilityIndex = (activeCapabilityIndex + direction + capabilitySlides.length) % capabilitySlides.length;
    const nextSlide = capabilitySlides[activeCapabilityIndex];
    capabilitiesRail.scrollTo({ left: getCapabilityScrollLeft(nextSlide), behavior: "smooth" });
  };

  document.querySelector("[data-capabilities-prev]")?.addEventListener("click", () => moveCapability(-1));
  document.querySelector("[data-capabilities-next]")?.addEventListener("click", () => moveCapability(1));

  capabilitiesRail.addEventListener("scrollend", syncActiveCapability, { passive: true });
  updateCapabilitiesParallax();
  syncActiveCapability();
  capabilitiesRail.addEventListener("scroll", requestCapabilitiesParallax, { passive: true });
}

const confidenceShowcase = document.querySelector("[data-confidence-showcase]");
if (confidenceShowcase) {
  const confidencePanel = confidenceShowcase.querySelector("[data-confidence-panel]");
  const confidenceImage = confidenceShowcase.querySelector("[data-confidence-image]");
  const confidenceNumber = confidenceShowcase.querySelector("[data-confidence-number]");
  const confidenceName = confidenceShowcase.querySelector(".confidence-active-name");
  const confidenceDescription = confidenceShowcase.querySelector(".confidence-active-description");
  const confidenceCopy = confidenceShowcase.querySelector(".confidence-active-copy");
  const confidenceTabs = [...confidenceShowcase.querySelectorAll("[data-confidence-tab]")];
  const confidenceSection = confidenceShowcase.closest(".confidence-section");
  let activeConfidenceIndex = 0;
  let confidenceImageTimer;
  let confidenceAutoplayTimer;
  let confidenceScrollFramePending = false;

  const setConfidenceState = (index, animate = true) => {
    const tab = confidenceTabs[index];
    if (!tab) return;

    activeConfidenceIndex = index;
    const panelBounds = confidencePanel?.getBoundingClientRect();
    const activeTabBounds = tab.getBoundingClientRect();
    if (panelBounds) confidenceShowcase.style.setProperty("--confidence-copy-left", `${activeTabBounds.left - panelBounds.left}px`);
    confidenceTabs.forEach((item, itemIndex) => {
      const isActive = itemIndex === index;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    confidenceNumber.textContent = String(index + 1).padStart(2, "0");
    confidenceName.textContent = tab.dataset.confidenceName || "";
    confidenceDescription.textContent = tab.dataset.confidenceDescription || "";

    const nextImage = tab.dataset.confidenceImage;
    if (confidenceImage && nextImage && confidenceImage.getAttribute("src") !== nextImage) {
      window.clearTimeout(confidenceImageTimer);
      if (animate) {
        confidenceCopy.classList.add("is-changing");
        confidenceImage.classList.add("is-changing");
      }
      confidenceImageTimer = window.setTimeout(() => {
        confidenceImage.src = nextImage;
        confidenceImage.alt = tab.dataset.confidenceAlt || "";
        const revealImage = () => {
          confidenceImage.classList.remove("is-changing");
          confidenceCopy.classList.remove("is-changing");
          confidenceImage.removeEventListener("load", revealImage);
        };
        confidenceImage.addEventListener("load", revealImage);
        window.setTimeout(revealImage, 700);
      }, animate ? 220 : 0);
    }

    confidencePanel.classList.add("is-ready");
  };

  const stopConfidenceAutoplay = () => window.clearInterval(confidenceAutoplayTimer);
  const startConfidenceAutoplay = () => {
    if (reduceMotion || window.matchMedia("(min-width: 821px)").matches) return;
    stopConfidenceAutoplay();
    confidenceAutoplayTimer = window.setInterval(() => {
      setConfidenceState((activeConfidenceIndex + 1) % confidenceTabs.length);
    }, 5200);
  };

  confidenceTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      setConfidenceState(index);
      startConfidenceAutoplay();
    });
  });

  confidenceShowcase.addEventListener("mouseenter", stopConfidenceAutoplay);
  confidenceShowcase.addEventListener("mouseleave", startConfidenceAutoplay);
  confidenceShowcase.addEventListener("focusin", stopConfidenceAutoplay);
  confidenceShowcase.addEventListener("focusout", (event) => {
    if (!confidenceShowcase.contains(event.relatedTarget)) startConfidenceAutoplay();
  });

  setConfidenceState(0, false);
  startConfidenceAutoplay();

  if (confidenceSection) {
    const syncConfidenceToScroll = () => {
      confidenceScrollFramePending = false;
      if (!window.matchMedia("(min-width: 821px)").matches) return;

      const bounds = confidenceSection.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;

      const travel = Math.max(1, confidenceSection.offsetHeight - window.innerHeight);
      const progress = clamp(-bounds.top / travel, 0, 1);
      const index = Math.min(confidenceTabs.length - 1, Math.floor(progress * confidenceTabs.length));
      if (index !== activeConfidenceIndex) setConfidenceState(index);
    };

    const requestConfidenceSync = () => {
      if (confidenceScrollFramePending) return;
      confidenceScrollFramePending = true;
      window.requestAnimationFrame(syncConfidenceToScroll);
    };

    requestConfidenceSync();
    window.addEventListener("scroll", requestConfidenceSync, { passive: true });
    window.addEventListener("resize", () => {
      stopConfidenceAutoplay();
      startConfidenceAutoplay();
      requestConfidenceSync();
    }, { passive: true });
  }
}

const processSection = document.querySelector(".process-section");
const processDetail = document.querySelector("#process-detail");
const processBackground = document.querySelector(".process-background");
const processSteps = [...document.querySelectorAll(".process-step[role='tab']")];

if (processSection && processDetail && processBackground && processSteps.length) {
  const processGrid = processSteps[0].closest(".process-approach-grid");
  const processCardStack = document.createElement("div");
  processCardStack.className = "process-card-stack";
  processGrid?.appendChild(processCardStack);

  const processIconMarkup = [
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6" /><path d="m14.25 14.25 5.75 5.75" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="5.5" width="15" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5" /><path d="M8 3.5v4M16 3.5v4M4.5 9.5h15M8 13h.01M12 13h.01M16 13h.01M8 16.5h.01M12 16.5h.01M16 16.5h.01" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /><circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="1.6" /></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 19 6.5v5.25c0 4.2-2.55 7.2-7 8.75-4.45-1.55-7-4.55-7-8.75V6.5l7-3Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" /><path d="m8.5 12 2.25 2.25L15.75 9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6" /><path d="m8 12.25 2.65 2.65L16.5 9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>',
  ];

  const createProcessCard = (step, index, background, detail) => {
    const card = document.createElement("article");
    card.className = "process-card";
    card.dataset.processCard = String(index);
    card.id = `process-card-${index + 1}`;

    const imagePath = step.dataset.processImage || "";
    background.dataset.processImage = imagePath;
    background.style.backgroundImage = `url("${imagePath}")`;
    background.setAttribute("aria-label", step.dataset.processAlt || "");
    background.classList.remove("is-changing");
    background.querySelector(".process-image-number")?.remove();
    background.querySelector(".process-image-tag")?.remove();

    detail.removeAttribute("id");
    detail.removeAttribute("aria-live");
    detail.classList.remove("reveal", "reveal-delay-1", "is-changing");
    const name = detail.querySelector("[data-process-name]");
    const number = detail.querySelector("[data-process-number]");
    const icon = detail.querySelector(".process-detail-icon");
    const title = detail.querySelector("[data-process-title]");
    const description = detail.querySelector("[data-process-description]");
    if (number) number.textContent = String(index + 1).padStart(2, "0");
    if (icon) icon.innerHTML = processIconMarkup[index] || processIconMarkup[0];
    if (name) name.textContent = step.dataset.processName || "";
    if (title) title.textContent = step.dataset.processTitle || step.dataset.processName || "";
    if (description) description.textContent = step.dataset.processDescription || "";

    card.append(background, detail);
    processCardStack.appendChild(card);
    step.setAttribute("aria-controls", card.id);
    return card;
  };

  const backgroundTemplate = processBackground.cloneNode(true);
  const detailTemplate = processDetail.cloneNode(true);
  processBackground.remove();
  processDetail.remove();

  const processCards = processSteps.map((step, index) => createProcessCard(
    step,
    index,
    index === 0 ? processBackground : backgroundTemplate.cloneNode(true),
    index === 0 ? processDetail : detailTemplate.cloneNode(true),
  ));

  let activeProcessIndex = 0;
  const setProcessState = (index) => {
    activeProcessIndex = index;
    processSteps.forEach((item, itemIndex) => {
      const isActive = itemIndex === index;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });
    processCards.forEach((card, cardIndex) => card.classList.toggle("is-current", cardIndex === index));
  };

  processSteps.forEach((step, index) => {
    step.addEventListener("click", () => {
      const card = processCards[index];
      if (!card) return;
      card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      setProcessState(index);
    });
  });

  let processSyncFrame = 0;
  const syncProcessState = () => {
    if (processSyncFrame) return;
    processSyncFrame = window.requestAnimationFrame(() => {
      processSyncFrame = 0;
      const viewportCenter = window.innerHeight / 2;
      const closestCard = processCards.reduce((closest, card) => {
        const bounds = card.getBoundingClientRect();
        const distance = Math.abs(bounds.top + bounds.height / 2 - viewportCenter);
        return !closest || distance < closest.distance ? { card, distance } : closest;
      }, null);
      if (closestCard) setProcessState(Number(closestCard.card.dataset.processCard));
    });
  };

  window.addEventListener("scroll", syncProcessState, { passive: true });
  window.addEventListener("resize", syncProcessState);
  syncProcessState();
  setProcessState(activeProcessIndex);
}

const ctaGallery = document.querySelector("[data-cta-gallery]");
if (ctaGallery) {
  const ctaStrips = [...ctaGallery.querySelectorAll("[data-cta-strip]")];

  ctaStrips.forEach((strip, stripIndex) => {
    const track = strip.querySelector(".cta-media-track");
    const cards = track ? [...track.querySelectorAll("[data-cta-card]")] : [];
    if (!track || cards.length < 2 || reduceMotion) return;

    cards.forEach((card) => track.append(card.cloneNode(true)));
    track.style.setProperty("--cta-strip-duration", `${38 + stripIndex * 8}s`);
  });

  const stopCtaGallery = () => ctaStrips.forEach((strip) => strip.classList.add("is-paused"));
  const startCtaGallery = () => {
    if (reduceMotion) return;
    ctaStrips.forEach((strip) => strip.classList.remove("is-paused"));
  };

  ctaGallery.addEventListener("mouseenter", stopCtaGallery);
  ctaGallery.addEventListener("mouseleave", startCtaGallery);
  ctaGallery.addEventListener("focusin", stopCtaGallery);
  ctaGallery.addEventListener("focusout", (event) => {
    if (!ctaGallery.contains(event.relatedTarget)) startCtaGallery();
  });

  const ctaGalleryObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) startCtaGallery();
      else stopCtaGallery();
    },
    { threshold: 0.08 },
  );
  ctaGalleryObserver.observe(ctaGallery);
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
});
