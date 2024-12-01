import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import "./App.css";
import Navbar from "./components/Nav";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import About from "./components/About/About";
import FaqS from "./components/FAQs/FaqS";
import Contact from "./components/Contact/Contact";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login /Login";
import ScrollToTop from "./Utls/MOVETOP/ScrollToTop";
import TermsAndConditions from "./components/TermsAndConditions/TermsAndConditions";
import PrivacyPolicy from "./components/TermsAndConditions/PrivacyPolicy";
import TicketPolicies from "./components/TermsAndConditions/TicketPolicies";
import RefundPolicies from "./components/TermsAndConditions/RefundPolicies";
import TicketSearch from "./components/Ticket/TicketSearch";
import BusSeatSelection from "./components/Ticket/BusSeatSelection";
import BusSearch2 from "./components/BusSearch2";
import Profile from "./components/Profile/Profile";
import Bookings from "./components/Bookings/Bookings";
import Blogs from "./components/Blogs/Blogs";
import BlogPost from "./components/Blogs/BlogPost";
import Support from "./components/Support/Support";
import SearchPage from "./SearchPage/SearchPage";
import AdminLayout from './Admin/AdminLayout';
import BusManagement from './Admin/BusManagement';
import OperatorManagement from './Admin/OperatorManagement';
import RouteManagement from './Admin/RouteManagement';
import ScheduleManagement from './Admin/ScheduleManagement';
import CityManagement from './Admin/CityManagement';

// this is the main App component
function App() {
  const location = useLocation();

  // Condition to hide Footer on /signup or /login pages
  const shouldHideFooter =
    location.pathname === "/signup" || location.pathname === "/login";

  return (
    <AuthProvider>
      <div>
        <Navbar />
        <ScrollToTop /> {/* Add ScrollToTop component here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/FAQs" element={<FaqS />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<BusSearch2 />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<Bookings />} />
          
          <Route path="/searchBuses" element={<SearchPage />} />

          <Route path="/termsAndConditions" element={<TermsAndConditions />} />
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/TicketPolicies" element={<TicketPolicies />} />
          <Route path="/refunds" element={<RefundPolicies />} />
          <Route path="/ticket-Search" element={<TicketSearch />} />
          <Route path="/seatSelection" element={<BusSeatSelection />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogPost />} />
          <Route path="/support" element={<Support />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="buses" element={<BusManagement />} />
            <Route path="operators" element={<OperatorManagement />} />
            <Route path="routes" element={<RouteManagement />} />
            <Route path="schedules" element={<ScheduleManagement />} />
            <Route path="cities" element={<CityManagement />} />
          </Route>
        </Routes>
        {/* Conditionally render Footer */}
        {!shouldHideFooter && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
