import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AddressForm from '../components/AddressForm';
import './CustomerFormPage.css';

const CustomerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: ''
  });

  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // ✅ Use useCallback to make fetchCustomer stable
  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const [customerRes, addressesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/customers/${id}`),
        axios.get(`http://localhost:5000/api/customers/${id}/addresses`)
      ]);

      const customer = customerRes.data.data;
      setFormData({
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone_number: customer.phone_number
      });
      setAddresses(addressesRes.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch customer');
    } finally {
      setLoading(false);
    }
  }, [id]); // `id` is a dependency

  // ✅ Include fetchCustomer in dependencies
  useEffect(() => {
    if (isEditing) {
      fetchCustomer();
    }
  }, [isEditing, fetchCustomer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.first_name.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.last_name.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.phone_number.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (addresses.length === 0) {
      setError('At least one address is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/customers/${id}`, formData);
        setSuccess('Customer updated successfully!');
      } else {
        const customerRes = await axios.post('http://localhost:5000/api/customers', formData);
        const customerId = customerRes.data.id;

        for (const address of addresses) {
          await axios.post(`http://localhost:5000/api/customers/${customerId}/addresses`, address);
        }
        setSuccess('Customer created successfully!');
      }

      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (addressData) => {
    try {
      if (editingAddress) {
        await axios.put(`http://localhost:5000/api/addresses/${editingAddress.id}`, addressData);
        setAddresses(prev =>
          prev.map(addr =>
            addr.id === editingAddress.id ? { ...addr, ...addressData } : addr
          )
        );
        setEditingAddress(null);
      } else {
        if (isEditing) {
          const response = await axios.post(`http://localhost:5000/api/customers/${id}/addresses`, addressData);
          setAddresses(prev => [...prev, { ...addressData, id: response.data.id }]);
        } else {
          setAddresses(prev => [...prev, addressData]);
        }
      }
      setShowAddressForm(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save address');
    }
  };

  const handleAddressEdit = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleAddressDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        if (isEditing) {
          await axios.delete(`http://localhost:5000/api/addresses/${addressId}`);
        }
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete address');
      }
    }
  };

  const handleAddressCancel = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  if (loading && isEditing) {
    return <div className="loading">Loading customer data...</div>;
  }

  return (
    <div className="customer-form-page">
      <div className="page-header">
        <h1>{isEditing ? 'Edit Customer' : 'Add New Customer'}</h1>
        <Link to="/" className="btn btn-secondary">
          Back to Customers
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="error-close">
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="customer-form">
        <div className="form-section">
          <h3>Customer Information</h3>

          <div className="form-group">
            <label htmlFor="first_name">First Name *</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="Enter first name"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last Name *</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Enter last name"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Phone Number *</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder="Enter 10-digit phone number"
              required
              className="form-input"
              pattern="[0-9]{10}"
            />
            <small className="form-help">Enter a 10-digit phone number</small>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Addresses *</h3>
            <button
              type="button"
              onClick={() => setShowAddressForm(true)}
              className="btn btn-primary"
            >
              Add Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <p className="no-addresses">No addresses added yet. At least one address is required.</p>
          ) : (
            <div className="addresses-list">
              {addresses.map((address, index) => (
                <div key={address.id || index} className="address-item">
                  <div className="address-content">
                    <p className="address-details">{address.address_details}</p>
                    <p className="address-location">{address.city}, {address.state} {address.pin_code}</p>
                  </div>
                  <div className="address-actions">
                    <button
                      type="button"
                      onClick={() => handleAddressEdit(address)}
                      className="btn btn-small btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddressDelete(address.id)}
                      className="btn btn-small btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showAddressForm && (
          <AddressForm
            address={editingAddress}
            onSubmit={handleAddressSubmit}
            onCancel={handleAddressCancel}
            isEditing={Boolean(editingAddress)}
          />
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Customer' : 'Create Customer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerFormPage;
