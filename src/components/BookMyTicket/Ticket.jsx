import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthProvider";
import { toast } from "react-toastify";

const Ticket = () => {
  const { user } = useAuth(); // Get the logged-in user from context
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle ticket booking
  const handleBookTicket = async () => {
    if (!user) {
      toast.error("Please log in to book a ticket.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/bookticket",
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Include the token in the request
          },
        }
      );
      toast.success("Ticket booked successfully!");
      setTicket(response.data); // Store the booked ticket
    } catch (err) {
      setError("Error booking ticket: " + err.response?.data?.message);
      toast.error("Error booking ticket.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch ticket details after login
  useEffect(() => {
    if (!user) {
      setError("Please log in to see your ticket.");
      return;
    }

    const fetchTicket = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/v1/getticket", {
          headers: {
            Authorization: `Bearer ${user.token}`, // Include the token in the request
          },
        });
        setTicket(response.data); // Set the ticket data
      } catch (err) {
        setError("Error fetching ticket: " + err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      {error && <p className="text-red-500">{error}</p>}

      {/* Book ticket button */}
      {!ticket && !loading && (
        <div className="text-center mb-4">
          <button
            onClick={handleBookTicket}
            className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md"
          >
            Book Ticket
          </button>
        </div>
      )}

      {/* Ticket details */}
      {ticket ? (
        <div>
          <h3>Your Ticket</h3>
          <p>Ticket Details: {ticket.details}</p>
          <p>Bus Route: {ticket.route}</p>
          <p>Departure: {ticket.departure}</p>
          <p>Arrival: {ticket.arrival}</p>
        </div>
      ) : (
        <p>No ticket available yet.</p>
      )}
    </div>
  );
};

export default Ticket;
