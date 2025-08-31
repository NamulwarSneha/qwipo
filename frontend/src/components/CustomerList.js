import React from 'react';
import { Link } from 'react-router-dom';
import './CustomerList.css';

const CustomerList = ({ customers, onDelete, loading }) => {
  const handleDelete = (customerId, customerName) => {
    if (window.confirm(`Are you sure you want to delete ${customerName}?`)) {
      onDelete(customerId);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading customers...</div>
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="no-customers">
        <p>No customers found.</p>
        <Link to="/customers/new" className="btn btn-primary">
          Add Your First Customer
        </Link>
      </div>
    );
  }

  return (
    <div className="customer-list-container">
      <div className="table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="customer-row">
                <td>{customer.id}</td>
                <td>
                  <Link 
                    to={`/customers/${customer.id}`} 
                    className="customer-name-link"
                  >
                    {customer.first_name} {customer.last_name}
                  </Link>
                </td>
                <td>{customer.phone_number}</td>
                <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                <td className="actions">
                  <Link 
                    to={`/customers/${customer.id}`} 
                    className="btn btn-small btn-primary"
                  >
                    View
                  </Link>
                  <Link 
                    to={`/customers/${customer.id}/edit`} 
                    className="btn btn-small btn-secondary"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(customer.id, `${customer.first_name} ${customer.last_name}`)}
                    className="btn btn-small btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;