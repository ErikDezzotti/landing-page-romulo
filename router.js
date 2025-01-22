// Sistema de Roteamento Simplificado
const routes = {
  "/": "/index.html",
  "/captura": "/captura.html",
  "/obrigado": "/obrigado.html",
};

// Função principal de navegação
function navegarPara(pagina) {
  const destinos = {
    captura: "/captura",
    obrigado: "/obrigado",
    home: "/",
  };

  const destino = destinos[pagina];
  if (destino) {
    window.location.href = destino;
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  // Limpa URLs com .html
  const path = window.location.pathname;
  if (path.endsWith(".html")) {
    const newPath = path.replace(".html", "");
    window.history.replaceState({}, "", newPath);
  }

  // Intercepta cliques em links
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (href && href.startsWith("/")) {
      e.preventDefault();
      window.location.href = href;
    }
  });

  // Atualiza links existentes
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.endsWith(".html")) {
      link.setAttribute("href", href.replace(".html", ""));
    }
  });
});
