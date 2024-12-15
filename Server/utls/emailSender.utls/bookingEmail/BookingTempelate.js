// utils/emailTemplates.js
exports.getBookingConfirmationTemplate = (booking, schedule) => {
  // Debug logging
  console.log('Generating email template with data:', {
    bookingId: booking._id,
    scheduleData: {
      routeId: schedule.routeId,
      busId: schedule.busId,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime
    }
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3399cc; color: white; padding: 20px; text-align: center; }
            .details { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Booking Confirmation</h1>
                <p>Booking ID: ${booking._id}</p>
            </div>

            <div class="details">
                <h2>Journey Details</h2>
                <p><strong>From:</strong> ${schedule.routeId.source.name || schedule.routeId.source}</p>
                <p><strong>To:</strong> ${schedule.routeId.destination.name || schedule.routeId.destination}</p>
                <p><strong>Bus Number:</strong> ${schedule.busId.busNumber}</p>
                <p><strong>Departure:</strong> ${new Date(
                  schedule.departureTime
                ).toLocaleString()}</p>
                <p><strong>Arrival:</strong> ${new Date(
                  schedule.arrivalTime
                ).toLocaleString()}</p>
            </div>

            <div class="details">
                <h2>Passenger Details</h2>
                ${booking.passengers
                  .map(
                    (passenger) => `
                    <p><strong>Name:</strong> ${passenger.name}</p>
                    <p><strong>Seat:</strong> ${passenger.seatNumber}</p>
                `
                  )
                  .join("")}
            </div>

            <div class="details">
                <h2>Payment Details</h2>
                <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
                <p><strong>Status:</strong> ${booking.paymentStatus}</p>
            </div>

            <div class="footer">
                <p>Thank you for choosing BookMyBus!</p>
                <p>For support, contact us at support@bookmybus.com</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

exports.getPaymentConfirmationTemplate = (payment, booking) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            /* Same styles as above */
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Payment Confirmation</h1>
                <p>Payment ID: ${payment.razorpayPaymentId}</p>
            </div>

            <div class="details">
                <h2>Payment Details</h2>
                <p><strong>Amount Paid:</strong> ₹${payment.amount}</p>
                <p><strong>Status:</strong> ${payment.status}</p>
                <p><strong>Date:</strong> ${new Date(
                  payment.createdAt
                ).toLocaleString()}</p>
            </div>

            <div class="footer">
                <p>Payment processed successfully!</p>
                <p>Your booking confirmation has been sent separately.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

exports.getCancellationTemplate = (booking, refundDetails) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            /* Same styles as above */
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Booking Cancellation</h1>
                <p>Booking ID: ${booking._id}</p>
            </div>

            <div class="details">
                <h2>Cancellation Details</h2>
                <p><strong>Cancelled On:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Refund Amount:</strong> ₹${refundDetails.amount}</p>
                <p><strong>Refund Status:</strong> ${refundDetails.status}</p>
            </div>

            <div class="footer">
                <p>Your refund will be processed within 5-7 business days.</p>
                <p>We hope to serve you again soon!</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
