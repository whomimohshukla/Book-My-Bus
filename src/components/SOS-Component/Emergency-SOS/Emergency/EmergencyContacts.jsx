import React, { useState, useEffect } from 'react';
import { FaPlus, FaPhone, FaTrash, FaEdit, FaUser, FaUserPlus, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { emergencyService } from '../services/emergency.service';

function EmergencyContacts({ userId }) {
  const [contacts, setContacts] = useState([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newContact, setNewContact] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    relationship: '',
    isActive: true
  });

  // Fetch contacts when component mounts
  useEffect(() => {
    const fetchContacts = async () => {
      if (!userId) {
        setError('User ID is required');
        setLoading(false);
        return;
      }

      try {
        const response = await emergencyService.getEmergencyContacts(userId);
        console.log('Fetched contacts:', response.data);
        if (response.data && response.data.data && response.data.data.contacts) {
          setContacts(response.data.data.contacts);
        }
      } catch (error) {
        console.error('Error fetching emergency contacts:', error);
        setError('Failed to load emergency contacts');
        toast.error('Failed to load emergency contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [userId]);

  const validateContact = (contact) => {
    if (!contact.name || contact.name.trim() === '') {
      throw new Error('Name is required');
    }
    if (!contact.phoneNumber || contact.phoneNumber.trim() === '') {
      throw new Error('Phone number is required');
    }
    if (!contact.relationship || contact.relationship.trim() === '') {
      throw new Error('Relationship is required');
    }
    // Email is optional, but if provided should be valid
    if (contact.email && !contact.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new Error('Invalid email format');
    }
    // Phone number validation (basic)
    if (!contact.phoneNumber.match(/^\+?[\d\s-]{10,}$/)) {
      throw new Error('Invalid phone number format');
    }
  };

  const handleAddContact = async () => {
    try {
      validateContact(newContact);

      const response = await emergencyService.addEmergencyContact(userId, newContact);
      
      if (response.data && response.data.success) {
        setContacts(prev => [...prev, response.data.data]);
        setNewContact({
          name: '',
          phoneNumber: '',
          email: '',
          relationship: '',
          isActive: true
        });
        setIsAddingContact(false);
        toast.success('Emergency contact added successfully!');
      }
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      toast.error(error.message || 'Failed to add emergency contact');
    }
  };

  const handleEditContact = async (contact) => {
    try {
      validateContact(contact);

      const updatedContacts = contacts.map(c => 
        c._id === editingContact._id ? { ...contact, isActive: true } : c
      );
      
      const response = await emergencyService.updateEmergencyContacts(userId, updatedContacts);
      
      if (response.data && response.data.success) {
        setContacts(updatedContacts);
        setEditingContact(null);
        toast.success('Emergency contact updated successfully!');
      }
    } catch (error) {
      console.error('Error updating emergency contact:', error);
      toast.error(error.message || 'Failed to update emergency contact');
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      const response = await emergencyService.deleteEmergencyContact(userId, contactId);
      
      if (response.data && response.data.success) {
        setContacts(prev => prev.filter(c => c._id !== contactId));
        toast.success('Emergency contact deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting emergency contact:', error);
      toast.error('Failed to delete emergency contact');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Emergency Contacts</h2>
        {!isAddingContact && (
          <button
            onClick={() => setIsAddingContact(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FaUserPlus className="mr-2" />
            Add Contact
          </button>
        )}
      </div>

      {/* Add/Edit Contact Form */}
      {(isAddingContact || editingContact) && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            {editingContact ? 'Edit Contact' : 'Add New Contact'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={editingContact ? editingContact.name : newContact.name}
                onChange={(e) => 
                  editingContact 
                    ? setEditingContact({...editingContact, name: e.target.value})
                    : setNewContact({...newContact, name: e.target.value})
                }
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Contact Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={editingContact ? editingContact.phoneNumber : newContact.phoneNumber}
                onChange={(e) =>
                  editingContact
                    ? setEditingContact({...editingContact, phoneNumber: e.target.value})
                    : setNewContact({...newContact, phoneNumber: e.target.value})
                }
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editingContact ? editingContact.email : newContact.email}
                onChange={(e) =>
                  editingContact
                    ? setEditingContact({...editingContact, email: e.target.value})
                    : setNewContact({...newContact, email: e.target.value})
                }
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship *
              </label>
              <input
                type="text"
                value={editingContact ? editingContact.relationship : newContact.relationship}
                onChange={(e) =>
                  editingContact
                    ? setEditingContact({...editingContact, relationship: e.target.value})
                    : setNewContact({...newContact, relationship: e.target.value})
                }
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Family Member, Friend, etc."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={() => {
                setIsAddingContact(false);
                setEditingContact(null);
                setNewContact({
                  name: '',
                  phoneNumber: '',
                  email: '',
                  relationship: '',
                  isActive: true
                });
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => editingContact ? handleEditContact(editingContact) : handleAddContact()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              {editingContact ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No emergency contacts added yet
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FaUser className="mr-2 text-red-600" />
                    {contact.name}
                    <span className="ml-2 text-sm text-gray-500">({contact.relationship})</span>
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-600 flex items-center">
                      <FaPhone className="mr-2" />
                      {contact.phoneNumber}
                    </p>
                    {contact.email && (
                      <p className="text-gray-600 flex items-center">
                        <FaEnvelope className="mr-2" />
                        {contact.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingContact(contact)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteContact(contact._id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EmergencyContacts;