import { Routes, Route, useLocation } from "react-router-dom";

// умовний хедер
import ConditionalHeader from "./components/ConditionalHeader";

// сторінки
import Home from "./pages/Home";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import Book from "./pages/Book";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";

import Footer from "./components/Footer";
import BackToTopButton from "./components/BackToTopButton";
import DevCheck from "./pages/DevCheck";
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminDashboard from "./components/dashboards/AdminDashboard";

/// Login 
import AdminLayout from "./components/dashboards/AdminLayout";
import Clients from "./components/dashboards/Clients";
// import AdminCalendar from "./components/dashboards/AdminCalendar";
import AdminBigCalendar from "./components/dashboards/AdminBigCalendar";
import Settings from "./components/dashboards/Settings";

import ClientDetails from "./components/dashboards/ClientDetails";

export default function AppContent() {
  const location = useLocation();

  // тут перелік роутів, де хедер ховаємо (адаптуй під себе)
  const shouldHideHeader =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/auth") ||
    location.pathname.startsWith("/checkout");

    const shouldHideFooter = shouldHideHeader;

  return (
    <div>
      {!shouldHideHeader && <ConditionalHeader />}
      <div className={shouldHideHeader ? "" : "mt-10"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<Book />} />

          {/* логін */}
          <Route path="/login" element={<Login />} />

          {/* <Route path="/dev-check" element={<DevCheck />} /> */}

       <Route
  path="/admin/*"
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<AdminDashboard />} />
  <Route path="clients" element={<Clients />} />
  <Route path="calendar" element={<AdminBigCalendar />} />
  <Route path="settings" element={<Settings />} />
  <Route path="clients" element={<Clients />} />
<Route path="clients/:id" element={<ClientDetails />} />
</Route>
        </Routes>

        <BackToTopButton />

              {!shouldHideFooter && <Footer />}

      </div>


    </div>
  );
}
