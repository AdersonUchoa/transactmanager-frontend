import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home/Home";
import Pessoas from "../pages/Pessoas/Pessoas";
import Categorias from "../pages/Categorias/Categorias";
import Transacoes from "../pages/Transacoes/Transacoes";
import PessoaDetalhes from "../pages/Pessoas/Detalhes/PessoasDetalhes";
import TransacaoDetalhes from "../pages/Transacoes/Detalhes/TransacoesDetalhes";
import { CategoriaDetalhes } from "../pages/Categorias/Detalhes/CategoriaDetalhes";
import NotFound from "../pages/NotFound/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "pessoas", element: <Pessoas /> },
      { path: "pessoas/:id", element: <PessoaDetalhes /> },
      { path: "categorias", element: <Categorias /> },
      { path: "categorias/:id", element: <CategoriaDetalhes /> },
      { path: "transacoes", element: <Transacoes /> },
      { path: "transacoes/:id", element: <TransacaoDetalhes /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);