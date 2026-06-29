async function loadComponent(id, file) {
  const target = document.getElementById(id);
  if (!target) return;
  const response = await fetch(file);
  target.innerHTML = await response.text();
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("header", "assets/include/header.html");
  await loadComponent("footer", "assets/include/footer.html");

  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("mobile-menu-open"));
  }
});
