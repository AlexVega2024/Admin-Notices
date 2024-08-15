import { RouteType } from "./config";
import { NoticiasPage } from "../pages/noticias/NoticiasPage";
import { CategoriasPage } from "../pages/categoria/CategoriasPage";
import { Category, Newspaper } from "@mui/icons-material";

const appRoutes: RouteType[] = [
  {
    index: true,
    path: "/",
    element: <CategoriasPage />,
    state: "categoria",
  },
  {
    path: "/admin-categoria",
    element: <CategoriasPage />,
    state: "categoria",
    sidebarProps: {
      displayText: "Categorias",
      icon: <Category />,
    },
  },
  {
    path: "/admin-noticia",
    element: <NoticiasPage />,
    state: "noticia",
    sidebarProps: {
      displayText: "Noticias",
      icon: <Newspaper />,
    },
  },
];

export default appRoutes;
