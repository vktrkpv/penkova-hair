import Header from "../sections/Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-10">
        <Outlet />
      </main>
    </>
  );
}
