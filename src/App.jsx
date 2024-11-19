import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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
// import Ticket from "./components/BookMyTicket/Ticket";
// import { AuthProvider } from "./contexts/AuthProvider";

function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();

  // Condition to hide Footer on /signup or /login pages
  const shouldHideFooter =
    location.pathname === "/signup" || location.pathname === "/login";

  return (
    <div>
      <Navbar />
      <ScrollToTop /> {/* Add ScrollToTop component here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/FAQs" element={<FaqS />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/termsAndConditions" element={<TermsAndConditions />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/TicketPolicies" element={<TicketPolicies />} />
        <Route path="/refunds" element={<RefundPolicies />} />
        <Route path="/ticket-Search" element={<TicketSearch />} />
        <Route path="/seatSelection" element={<BusSeatSelection />} />
      </Routes>
      {/* Conditionally render Footer */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
