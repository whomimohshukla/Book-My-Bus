// services/emergency.service.js
import api from "../../../../utils/api";

export const emergencyService = {
  triggerSOS: async (data) => {
    return api.post("/emergency/sos", data);
  },

  getNearbyHospitals: async (latitude, longitude, radius = 5000) => {
    return api.get(
      `/emergency/nearby-hospitals?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
    );
  },

  getEmergencyContacts: async (userId) => {
    return api.get(`/emergency/contacts/${userId}`);
  },

  updateEmergencyContacts: async (userId, contacts) => {
    return api.put(`/emergency/contacts/${userId}`, { contacts });
  },
};
