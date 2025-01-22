// Função para navegar entre páginas
function navegarPara(pagina) {
  const paginas = {
    captura: "/captura",
    obrigado: "/obrigado",
    home: "/",
  };

  if (paginas[pagina]) {
    window.location.href = paginas[pagina];
  }
}

// Intercepta cliques em links
document.addEventListener("click", function (e) {
  const link = e.target.closest("a");
  if (link) {
    const href = link.getAttribute("href");
    if (href.startsWith("/")) {
      e.preventDefault();
      window.location.href = href;
    }
  }
});
