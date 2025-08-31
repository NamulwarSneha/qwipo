import React, { useState, useEffect } from 'react';
import './AddressForm.css';

const AddressForm = ({ 
  address = null, 
  onSubmit, 
  onCancel, 
  customerId,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    address_details: '',
    city: '',
    state: '',
    pin_code: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData({
        address_details: address.address_details || '',
        city: address.city || '',
        state: address.state || '',
        pin_code: address.pin_code || ''
      });
    }
  }, [address]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.address_details.trim()) {
      newErrors.address_details = 'Address details are required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.pin_code.trim()) {
      newErrors.pin_code = 'Pin code is required';
    } else if (!/^\d{6}$/.test(formData.pin_code.replace(/\D/g, ''))) {
      newErrors.pin_code = 'Please enter a valid 6-digit pin code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting address:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-form-container">
      <h3>{isEditing ? 'Edit Address' : 'Add New Address'}</h3>
      
      <form onSubmit={handleSubmit} className="address-form">
        <div className="form-group">
          <label htmlFor="address_details">Address Details *</label>
          <textarea
            id="address_details"
            name="address_details"
            value={formData.address_details}
            onChange={handleInputChange}
            placeholder="Enter street address, building, apartment, etc."
            className={`form-input ${errors.address_details ? 'error' : ''}`}
            rows="3"
            required
          />
          {errors.address_details && (
            <span className="error-message">{errors.address_details}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter city name"
              className={`form-input ${errors.city ? 'error' : ''}`}
              required
            />
            {errors.city && (
              <span className="error-message">{errors.city}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="state">State *</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Enter state name"
              className={`form-input ${errors.state ? 'error' : ''}`}
              required
            />
            {errors.state && (
              <span className="error-message">{errors.state}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="pin_code">Pin Code *</label>
          <input
            type="text"
            id="pin_code"
            name="pin_code"
            value={formData.pin_code}
            onChange={handleInputChange}
            placeholder="Enter 6-digit pin code"
            className={`form-input ${errors.pin_code ? 'error' : ''}`}
            maxLength="6"
            required
          />
          {errors.pin_code && (
            <span className="error-message">{errors.pin_code}</span>
          )}
          <small className="form-help">Enter a 6-digit postal/ZIP code</small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
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
            {loading ? 'Saving...' : (isEditing ? 'Update Address' : 'Add Address')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;