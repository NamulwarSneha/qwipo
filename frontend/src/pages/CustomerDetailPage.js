import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './CustomerDetailPage.css';

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      const [customerRes, addressesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/customers/${id}`),
        axios.get(`http://localhost:5000/api/customers/${id}/addresses`)
      ]);

      setCustomer(customerRes.data.data);
      setAddresses(addressesRes.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch customer data');
    } finally {
      setLoading(false);
    }
  }, [id]); // id is a dependency

  // ✅ Now safely reference the stable function
  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);
  const handleDeleteCustomer = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete customer');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(`http://localhost:5000/api/addresses/${addressId}`);
      fetchCustomerData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete address');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Customers
        </button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="error-container">
        <p className="error-message">Customer not found</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="customer-detail-page">
      <div className="page-header">
        <h1>Customer Details</h1>
        <div className="header-actions">
          <Link to={`/customers/${id}/edit`} className="btn btn-secondary">
            Edit Customer
          </Link>
          <button 
            onClick={() => setShowDeleteConfirm(true)} 
            className="btn btn-danger"
          >
            Delete Customer
          </button>
        </div>
      </div>

      <div className="customer-info">
        <h2>{customer.first_name} {customer.last_name}</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Phone Number:</label>
            <span>{customer.phone_number}</span>
          </div>
          <div className="info-item">
            <label>Customer ID:</label>
            <span>{customer.id}</span>
          </div>
          <div className="info-item">
            <label>Created:</label>
            <span>{new Date(customer.created_at).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <label>Last Updated:</label>
            <span>{new Date(customer.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="addresses-section">
        <div className="section-header">
          <h3>Addresses ({addresses.length})</h3>
          <Link to={`/customers/${id}/addresses/new`} className="btn btn-primary">
            Add Address
          </Link>
        </div>

        {addresses.length === 0 ? (
          <p className="no-addresses">No addresses found for this customer.</p>
        ) : (
          <div className="addresses-grid">
            {addresses.map((address) => (
              <div key={address.id} className="address-card">
                <div className="address-content">
                  <p className="address-details">{address.address_details}</p>
                  <div className="address-location">
                    <span>{address.city}, {address.state} {address.pin_code}</span>
                  </div>
                </div>
                <div className="address-actions">
                  <Link 
                    to={`/addresses/${address.id}/edit`} 
                    className="btn btn-small btn-secondary"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDeleteAddress(address.id)}
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

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this customer? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteCustomer} 
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailPage;