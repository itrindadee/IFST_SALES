document.addEventListener("DOMContentLoaded", function() {
  const sidebarToggle = document.getElementById("sidebarToggle");
  const themeToggle = document.querySelector(".theme-toggle");

  if (sidebarToggle) {
      sidebarToggle.addEventListener("click", function() {
          const sidebar = document.getElementById("sidebar");
          if (sidebar) {
              sidebar.classList.toggle("show");
          }
      });
  }

  if (themeToggle) {
      themeToggle.addEventListener("click", function() {
          toggleTheme();
      });
  }

  function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme');
      const invertedTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-bs-theme', invertedTheme);
      localStorage.setItem("theme", invertedTheme);
  }

  function isLight() {
      return localStorage.getItem("theme") === "light";
  }

  if (isLight()) {
      document.documentElement.setAttribute('data-bs-theme', 'light');
  } else {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
  }
});
