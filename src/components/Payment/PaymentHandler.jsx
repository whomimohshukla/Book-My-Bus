import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentHandler = ({ bookingId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        const response = await axios.post('/api/bookings/initiate-payment', {
          bookingId
        });

        const { data } = response.data;

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: "BookMyBus",
          description: `Bus Booking from ${data.bookingInfo.source} to ${data.bookingInfo.destination}`,
          order_id: data.orderId,
          prefill: {
            name: data.userInfo.name,
            email: data.userInfo.email,
            contact: data.userInfo.contact
          },
          notes: {
            bookingId: data.bookingId
          },
          theme: {
            color: "#3399cc"
          },
          handler: async function (response) {
            try {
              // Verify payment on frontend
              await axios.post('/api/bookings/verify-payment', {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              });

              toast.success('Payment successful! Redirecting to booking details...');
              navigate(`/bookings/${bookingId}`);
            } catch (error) {
              console.error('Payment verification failed:', error);
              toast.error('Payment verification failed. Please contact support.');
              navigate('/bookings');
            }
          },
          modal: {
            ondismiss: function() {
              toast.warning('Payment cancelled. Your booking will expire soon if not completed.');
              navigate('/bookings');
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        setLoading(false);
      } catch (error) {
        console.error('Error initiating payment:', error);
        setError('Failed to initiate payment. Please try again.');
        setLoading(false);
      }
    };

    initiatePayment();
  }, [bookingId, navigate]);

  if (loading) {
    return <div className="text-center p-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Initializing payment...</p>
    </div>;
  }

  if (error) {
    return <div className="alert alert-danger m-4" role="alert">
      {error}
      <button 
        className="btn btn-link"
        onClick={() => navigate('/bookings')}
      >
        Return to Bookings
      </button>
    </div>;
  }

  return null;
};

export default PaymentHandler;
