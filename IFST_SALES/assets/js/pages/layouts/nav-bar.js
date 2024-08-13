// Elementos do DOM
var sidebar = document.getElementById("sidebar");
var logoImg = document.querySelector(".logo img");
var toggleButton = document.querySelector(".open-btn");

// Atualiza o estado da sidebar com base na largura da tela
function updateSidebarState() {
    if (!sidebar) return;

    var isCollapsed = sidebar.classList.contains("collapsed");
    var isDesktop = window.innerWidth > 768;

    if (isDesktop) {
        sidebar.style.width = isCollapsed ? "60px" : "250px";
        if (logoImg) logoImg.src = isCollapsed ? "/images/logo-colapsado.png" : "/images/logo.png";
    } else {
        sidebar.style.width = isCollapsed ? "0" : "75%";
    }
}

// Alterna o estado da sidebar ao clicar no botão
function toggleNav() {
    if (!sidebar) return;

    var isDesktop = window.innerWidth > 768;
    sidebar.classList.toggle("collapsed");

    if (isDesktop) {
        var isCollapsed = sidebar.classList.contains("collapsed");
        sidebar.style.width = isCollapsed ? "60px" : "250px";
        if (logoImg) logoImg.src = isCollapsed ? "/images/logo-colapsado.png" : "/images/logo.png";
    } else {
        sidebar.style.width = sidebar.classList.contains("collapsed") ? "0" : "75%";
    }
}

// Configurações iniciais e eventos
updateSidebarState();

if (toggleButton) {
    toggleButton.addEventListener('click', toggleNav);
} else {
    console.error("Elemento com a classe 'open-btn' não encontrado.");
}

window.addEventListener('resize', updateSidebarState);
