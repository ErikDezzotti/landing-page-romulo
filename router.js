// Router Profissional
class Router {
  constructor() {
    this.routes = {
      "/": "/index.html",
      "/captura": "/captura.html",
      "/obrigado": "/obrigado.html",
    };

    this.init();
  }

  init() {
    // Intercepta todos os cliques em links
    document.addEventListener("click", (e) => this.handleClick(e));

    // Manipula navegação do browser
    window.addEventListener("popstate", (e) => this.handlePopState(e));

    // Inicializa a rota atual
    this.handleRoute(window.location.pathname);
  }

  handleClick(e) {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (href && href.startsWith("/")) {
      e.preventDefault();
      this.navigate(href);
    }
  }

  handlePopState(e) {
    this.handleRoute(window.location.pathname);
  }

  handleRoute(pathname) {
    const route = this.routes[pathname] || this.routes["/"];
    const cleanPath = pathname.replace(".html", "");

    // Atualiza URL se necessário
    if (pathname !== cleanPath) {
      window.history.replaceState({}, "", cleanPath);
    }
  }

  navigate(path) {
    const cleanPath = path.replace(".html", "");
    window.history.pushState({}, "", cleanPath);
    window.location.href = cleanPath;
  }
}

// Função global para navegação
function navegarPara(pagina) {
  const paginas = {
    captura: "/captura",
    obrigado: "/obrigado",
    home: "/",
  };

  if (paginas[pagina]) {
    const router = window.routerInstance;
    router.navigate(paginas[pagina]);
  }
}

// Inicializa o router
window.routerInstance = new Router();
