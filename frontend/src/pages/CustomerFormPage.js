import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AddressForm from '../components/AddressForm';
import './CustomerFormPage.css';

const API_URL = 'https://qwipo-kxtt.onrender.com/api/customers';
const ADDRESS_URL = 'https://qwipo-kxtt.onrender.com/api/addresses';

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

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const [customerRes, addressesRes] = await Promise.all([
        axios.get(`${API_URL}/${id}`),
        axios.get(`${API_URL}/${id}/addresses`)
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
  }, [id]);

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
    if (!formData.first_name.trim()) return setError('First name is required'), false;
    if (!formData.last_name.trim()) return setError('Last name is required'), false;
    if (!formData.phone_number.trim()) return setError('Phone number is required'), false;
    if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ''))) return setError('Please enter a valid 10-digit phone number'), false;
    if (addresses.length === 0) return setError('At least one address is required'), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        await axios.put(`${API_URL}/${id}`, formData);
        setSuccess('Customer updated successfully!');
      } else {
        const customerRes = await axios.post(API_URL, formData);
        const customerId = customerRes.data.id;

        for (const address of addresses) {
          await axios.post(`${API_URL}/${customerId}/addresses`, address);
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
        await axios.put(`${ADDRESS_URL}/${editingAddress.id}`, addressData);
        setAddresses(prev =>
          prev.map(addr =>
            addr.id === editingAddress.id ? { ...addr, ...addressData } : addr
          )
        );
        setEditingAddress(null);
      } else {
        if (isEditing) {
          const response = await axios.post(`${API_URL}/${id}/addresses`, addressData);
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
          await axios.delete(`${ADDRESS_URL}/${addressId}`);
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

      {success && <div className="success-message">{success}</div>}

      {/* Form fields remain unchanged */}
      {/* ... */}
    </div>
  );
};

export default CustomerFormPage;
