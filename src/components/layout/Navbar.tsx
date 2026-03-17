import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Pessoas", path: "/pessoas" },
  { label: "Categorias", path: "/categorias" },
  { label: "Transações", path: "/transacoes" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-zinc-900 text-white px-8 py-4 flex items-center justify-between shadow-md">
      <Link to="/" className="text-lg font-bold tracking-tight hover:text-emerald-400 transition-colors">
        TransactManager
      </Link>
      <ul className="flex gap-6">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-emerald-400 ${
                pathname === link.path ? "text-emerald-400" : "text-zinc-300"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}