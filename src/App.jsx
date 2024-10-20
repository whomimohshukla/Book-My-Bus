import { useState } from "react";

import "./App.css";
// import BusSearch from "./components/BusSearch";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Nav";
import Home from "./components/Home/Home";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/FAQs" element={<FAQs />} />
        <Route path="/Blogs" element={<Blogs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/bus-search" element={<BusSearch />} />
        <Route path="/bus-details/:busId" element={<BusDetails />} />
        <Route path="/bus-booking/:busId" element={<BusBooking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/my-wallet" element={<MyWallet />} />
        <Route */}
      </Routes>
    </div>
  );
}

export default App;
