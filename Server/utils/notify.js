const Notification = require('../models/Notification.model/notification.model');

async function notify(userId, payload, io) {
  if (!io) throw new Error('Socket.IO instance required');
  const doc = await Notification.create({ userId, ...payload });
  io.to(userId.toString()).emit('NOTIFICATION', doc);
  return doc;
}

module.exports = notify;
