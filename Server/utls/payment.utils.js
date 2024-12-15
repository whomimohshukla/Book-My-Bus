const Razorpay = require('razorpay');
const crypto = require('crypto');

// Check for required environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error('ERROR: Razorpay credentials not found in environment variables.');
  console.error('Please create a .env file in your Server directory with the following variables:');
  console.error('RAZORPAY_KEY_ID=your_key_id');
  console.error('RAZORPAY_KEY_SECRET=your_key_secret');
  console.error('You can get these credentials from your Razorpay dashboard.');
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

const createPaymentOrder = async (booking) => {
  const options = {
    amount: booking.totalAmount * 100, // Razorpay expects amount in paise
    currency: "INR",
    receipt: `booking_${booking._id}`,
    notes: {
      bookingId: booking._id.toString(),
      userId: booking.userId.toString(),
      scheduleId: booking.scheduleId.toString()
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, signature) => {
  const text = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');
  
  return expectedSignature === signature;
};

module.exports = {
  createPaymentOrder,
  verifyPaymentSignature,
  RAZORPAY_KEY_ID // Export for frontend use
};
