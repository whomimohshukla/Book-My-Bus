import React, { useState } from 'react';
import { FaPlus, FaPhone, FaTrash, FaEdit, FaUser, FaUserPlus, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';

function EmergencyContacts({ userId }) {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Doe', phone: '+1234567890', email: 'john@example.com', relation: 'Father' },
    { id: 2, name: 'Jane Smith', phone: '+0987654321', email: 'jane@example.com', relation: 'Mother' },
  ]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    relation: ''
  });

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.relation) {
      toast.error('Please fill in all required fields');
      return;
    }

    const contact = {
      id: Date.now(),
      ...newContact
    };

    setContacts([...contacts, contact]);
    setNewContact({ name: '', phone: '', email: '', relation: '' });
    setIsAddingContact(false);
    toast.success('Emergency contact added successfully!');
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setNewContact(contact);
  };

  const handleUpdateContact = () => {
    const updatedContacts = contacts.map(c =>
      c.id === editingContact.id ? { ...newContact, id: c.id } : c
    );
    setContacts(updatedContacts);
    setEditingContact(null);
    setNewContact({ name: '', phone: '', email: '', relation: '' });
    toast.success('Contact updated successfully!');
  };

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
    toast.success('Contact deleted successfully!');
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Emergency Contacts</h2>
        <button
          onClick={() => setIsAddingContact(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaUserPlus className="mr-2" />
          Add Contact
        </button>
      </div>

      {/* Contact List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="text-center py-8">
            <FaUser className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-gray-500">No emergency contacts added yet</p>
            <button
              onClick={() => setIsAddingContact(true)}
              className="mt-4 text-red-600 hover:text-red-700"
            >
              Add your first contact
            </button>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                    <p className="text-gray-600 text-sm">{contact.relation}</p>
                    <p className="text-gray-500 text-sm">{contact.phone}</p>
                    {contact.email && (
                      <p className="text-gray-500 text-sm flex items-center">
                        <FaEnvelope className="mr-1" size={12} />
                        {contact.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleCall(contact.phone)}
                    className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors duration-300"
                    title="Call"
                  >
                    <FaPhone />
                  </button>
                  {contact.email && (
                    <button
                      onClick={() => handleEmail(contact.email)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-300"
                      title="Send Email"
                    >
                      <FaEnvelope />
                    </button>
                  )}
                  <button
                    onClick={() => handleEditContact(contact)}
                    className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition-colors duration-300"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors duration-300"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Contact Modal */}
      {(isAddingContact || editingContact) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Contact Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Email Address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship *
                </label>
                <input
                  type="text"
                  value={newContact.relation}
                  onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Relationship"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={editingContact ? handleUpdateContact : handleAddContact}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300"
                >
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </button>
                <button
                  onClick={() => {
                    setIsAddingContact(false);
                    setEditingContact(null);
                    setNewContact({ name: '', phone: '', email: '', relation: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmergencyContacts;