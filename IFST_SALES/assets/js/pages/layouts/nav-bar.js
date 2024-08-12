document.addEventListener('DOMContentLoaded', function() {
  var sidebar = document.getElementById("sidebar");
  var logoImg = document.querySelector(".logo img");
  var searchBar = document.querySelector(".search-bar");
  var toggleButton = document.querySelector(".open-btn"); // Alterado para seletor de classe

  function updateSidebarState() {
    if (sidebar) {
      if (window.innerWidth > 768) { // Desktop
        if (sidebar.classList.contains("collapsed")) {
          sidebar.style.width = "60px"; // Colapsa o menu
          if (logoImg) logoImg.src = "/images/logo-colapsado.png"; // Logotipo colapsado
          if (searchBar) searchBar.classList.remove("moved-right"); // Barra de pesquisa perto
        } else {
          sidebar.style.width = "250px"; // Expande o menu
          if (logoImg) logoImg.src = "/images/logo.png"; // Logotipo original
          if (searchBar) searchBar.classList.add("moved-right"); // Barra de pesquisa à direita
        }
      } else { // Mobile
        if (sidebar.classList.contains("collapsed")) {
          sidebar.style.width = "0"; // Oculta o menu no mobile se estiver colapsado
        } else {
          sidebar.style.width = "75%"; // Exibe o menu no mobile
        }
      }
    }
  }

  function toggleNav() {
    if (sidebar) {
      if (window.innerWidth > 768) { // Desktop
        if (sidebar.classList.contains("collapsed")) {
          sidebar.classList.remove("collapsed"); // Remove a classe colapsada
          sidebar.style.width = "250px"; // Expande o menu
          if (logoImg) logoImg.src = "/images/logo.png"; // Logotipo original
          if (searchBar) searchBar.classList.add("moved-right"); // Barra de pesquisa à direita
        } else {
          sidebar.classList.add("collapsed"); // Adiciona a classe colapsada
          sidebar.style.width = "60px"; // Colapsa o menu
          if (logoImg) logoImg.src = "/images/logo-colapsado.png"; // Logotipo colapsado
          if (searchBar) searchBar.classList.remove("moved-right"); // Barra de pesquisa perto
        }
      } else { // Mobile
        sidebar.classList.toggle("collapsed"); // Alterna a classe colapsada
        if (sidebar.classList.contains("collapsed")) {
          sidebar.style.width = "0"; // Oculta o menu no mobile
        } else {
          sidebar.style.width = "75%"; // Exibe o menu no mobile
        }
      }
    }
  }

  // Inicializa o estado da barra lateral quando a página carrega
  updateSidebarState();

  // Adiciona um evento de clique para alternar a sidebar se o botão existir
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleNav);
  } else {
    console.error("Elemento com a classe 'open-btn' não encontrado.");
  }

  // Adiciona um evento para atualizar o estado da barra lateral quando a janela for redimensionada
  window.addEventListener('resize', updateSidebarState);
});
