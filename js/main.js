// Footer year-keeps the copyright year current
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// This Marks the current page in the main menu (Home on index.html, Contact on contact.html, and so on)

const currentFile = location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".site-header .nav-link").forEach(function (link) {
  const linkFile = link.getAttribute("href").split("#")[0];
  const hasHash = link.getAttribute("href").includes("#");


  if (!hasHash && linkFile === currentFile) {
    link.setAttribute("aria-current", "page");
  }
});

// Mobile menu-close the panel after a link is tapped, so the page is visible again this is needed for Shop and About, which scroll on the same page

const drawer = document.getElementById("mainNav");
if (drawer) {
  drawer.addEventListener("click", function (event) {
    if (event.target.closest("a") && drawer.open) {
      drawer.close();
    }
  });
}

//About section, "Learn more" shows and hides the extra text
const learnMore = document.querySelector(".learn-more");
if (learnMore) {
  const moreText = document.getElementById(learnMore.getAttribute("aria-controls"));

  learnMore.addEventListener("click", function () {
    const isOpen = learnMore.getAttribute("aria-expanded") === "true";

    learnMore.setAttribute("aria-expanded", String(!isOpen));
    moreText.hidden = isOpen;
    learnMore.textContent = isOpen
      ? learnMore.dataset.moreLabel
      : learnMore.dataset.lessLabel;
  });
}
