import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-1 px-8 py-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <footer className="bg-zinc-900 text-zinc-500 text-center text-xs py-4">
        TransactManager © {new Date().getFullYear()}
      </footer>
    </div>
  );
}