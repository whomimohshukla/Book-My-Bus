const PDFDocument = require('pdfkit');


module.exports = function generateTicketPdf(booking, schedule) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });

      // Collect the generated PDF into a Buffer
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      /* ---------- PDF CONTENT ---------- */
      doc
        .fontSize(20)
        .fillColor('#16a34a')
        .text('BookMyBus – Ticket', { align: 'center' })
        .moveDown(1.5);

      doc
        .fontSize(12)
        .fillColor('#000')
        .text(`Booking ID : ${booking._id}`)
        .text(`Passenger  : ${booking.passengers?.[0]?.name || booking.userId?.name || 'N/A'}`)
        .text(`Status     : ${booking.status}`)
        .moveDown();

      doc.fontSize(14).text('Journey Details', { underline: true }).moveDown(0.5);

      doc
        .fontSize(12)
        .text(`Route      : ${schedule.routeId?.source?.name} → ${schedule.routeId?.destination?.name}`)
        .text(
          `Departure   : ${new Date(schedule.departureTime).toLocaleString()} (
Duration ${booking.duration || 'N/A'})`
        )
        .text(`Arrival    : ${new Date(schedule.arrivalTime).toLocaleString()}`)
        .text(`Bus No.    : ${schedule.busId?.busNumber} (${schedule.busId?.busName || ''})`)
        .moveDown();

      doc.fontSize(14).text('Fare Details', { underline: true }).moveDown(0.5);
      doc.fontSize(12).text(`Total Amount : ₹${booking.totalAmount}`);

      doc.moveDown(2);
      doc.fontSize(10).fillColor('#555').text('Thank you for travelling with BookMyBus!', {
        align: 'center',
      });

      /* ---------- END CONTENT ---------- */
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
