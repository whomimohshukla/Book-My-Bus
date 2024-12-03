const PaymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["Card", "UPI", "NetBanking"],
    required: true,
  },
  transactionId: { type: String, required: true },
  status: {
    type: String,
    enum: ["Success", "Failed", "Pending"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
