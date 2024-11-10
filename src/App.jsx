import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Nav";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import About from "./components/About/About";
import FaqS from "./components/FAQs/FaqS";
import Contact from "./components/Contact/Contact";
import BookMyTicket from "./components/BookMyTicket/BookMyTicket";
import Signup from "./components/Signup/Signup";

function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();

  // Condition to hide Footer on the /signup page
  const shouldHideFooter = location.pathname === "/signup";

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/FAQs" element={<FaqS />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/getTicket" element={<BookMyTicket />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      {/* Conditionally render Footer */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
