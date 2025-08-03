import React, { useState } from "react";
import api from "../utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUsers } from "react-icons/fa";

const GroupBookingPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { bus, seats } = state || {};

  const [passengers, setPassengers] = useState(() => seats ? seats.map(() => ({ name: "", age: "", gender: "" })) : []);
  const [contact, setContact] = useState({ email: "", phone: "" });
  const totalFarePerSeat = (bus?.fareDetails?.baseFare || 0) + (bus?.fareDetails?.tax || 0) + (bus?.fareDetails?.serviceFee || 0);
  const grandTotal = totalFarePerSeat * (seats?.length || 0);

  const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePassengerChange = (index, field, value) => {
    setPassengers(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const allFilled = passengers.every(p => p.name && p.age && p.gender) && contact.email && contact.phone;

  const handleGroupBook = async () => {
    try {
      // 1. create group booking (status pending)
      const createRes = await api.post("/booking/group", {
        scheduleId: bus.scheduleId?._id || bus._id,
        groupSize: seats.length,
        seatingPreference: "together",
        passengers: passengers.map(p => ({ name: p.name.trim(), age: parseInt(p.age), gender: p.gender })),
        contactDetails: { email: contact.email.trim(), phone: contact.phone.trim() }
      });
      const { bookingId, totalAmount } = createRes.data.data;

      // 2. get a razorpay order via retry-payment endpoint
      const retryRes = await api.post("/booking/retry-payment", { bookingId });
      const { razorpayOrderId, key, amount, currency } = retryRes.data.data;

      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const options = {
        key,
        amount: amount * 100,
        currency,
        order_id: razorpayOrderId,
        name: "Book My Bus",
        description: `Group Booking #${bookingId}`,
        handler: async function (response) {
          try {
            await api.post("/booking/confirm", {
              bookingId,
              razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            navigate("/bookings", { state: { success: true, message: "Group booking confirmed" } });
          } catch (err) {
            console.error(err);
            alert("Payment verification failed");
          }
        },
        prefill: { email: contact.email, contact: contact.phone },
        theme: { color: "#FFA500" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Group booking failed – please try again");
    }
  };

  if (!bus || !seats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <p className="text-lg mb-4">Group booking details are missing.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-Darkgreen text-white rounded-lg flex items-center gap-2 hover:bg-LightGreen"><FaArrowLeft /> Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-amber-600 flex items-center gap-2"><FaUsers /> Group Booking</h2>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">{seats.length} seats</span>
        </div>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Trip Summary</h3>
          <p className="text-gray-600">{bus.busName || bus.busId?.busName} • {bus.busType || bus.busId?.type}</p>
          <p className="text-gray-600">From <span className="font-medium">{bus.routeId?.source?.name}</span> to <span className="font-medium">{bus.routeId?.destination?.name}</span></p>
          <p className="text-gray-600">Seats: {seats.join(', ')}</p>
          <p className="text-gray-600">Date & Time: {new Date(bus.departureTime).toLocaleString()}</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Fare Breakdown</h3>
          <div className="flex justify-between text-gray-700"><span>Fare x {seats.length}</span><span>₹{totalFarePerSeat * seats.length}</span></div>
          <div className="flex justify-between font-semibold text-gray-900 border-t pt-2"><span>Total</span><span>₹{grandTotal}</span></div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Contact Details</h3>
          <input type="email" placeholder="Email" value={contact.email} onChange={e=> setContact({ ...contact, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:border-amber-600 focus:outline-none" />
          <input type="tel" placeholder="Phone" value={contact.phone} onChange={e=> setContact({ ...contact, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:border-amber-600 focus:outline-none" />
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Passenger Details</h3>
          {passengers.map((p, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-3">
              <input type="text" placeholder="Name" value={p.name} onChange={e=> handlePassengerChange(idx, "name", e.target.value)} className="px-3 py-2 border rounded-lg w-full" />
              <input type="number" placeholder="Age" value={p.age} onChange={e=> handlePassengerChange(idx, "age", e.target.value)} className="px-3 py-2 border rounded-lg w-full" />
              <select value={p.gender} onChange={e=> handlePassengerChange(idx, "gender", e.target.value)} className="px-3 py-2 border rounded-lg w-full">
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          ))}
        </section>

        <button disabled={!allFilled} onClick={handleGroupBook} className="w-full py-3 rounded-lg bg-amber-600 disabled:bg-gray-400 text-white font-semibold hover:bg-amber-700 transition">Pay & Confirm</button>
      </div>
    </div>
  );
};

export default GroupBookingPage;
