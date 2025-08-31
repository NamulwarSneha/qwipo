import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CustomerList from '../components/CustomerList';
import SearchFilters from '../components/SearchFilters';
import Pagination from '../components/Pagination';
import './CustomerListPage.css';

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    state: '',
    pin_code: '',
    special: ''
  });
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('ASC');

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        sortBy,
        sortOrder
      });

      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.city) {
        params.append('city', filters.city);
      }
      if (filters.state) {
        params.append('state', filters.state);
      }
      if (filters.pin_code) {
        params.append('pin_code', filters.pin_code);
      }

      let url = `http://localhost:5000/api/customers?${params.toString()}`;

      // Handle special filters
      if (filters.special === 'multiple-addresses') {
        url = 'http://localhost:5000/api/customers-with-multiple-addresses';
      } else if (filters.special === 'single-address') {
        url = 'http://localhost:5000/api/customers-single-address';
      }

      const response = await axios.get(url);
      
      if (filters.special) {
        // Special endpoints return different data structure
        setCustomers(response.data.data);
        setPagination(prev => ({
          ...prev,
          totalItems: response.data.data.length,
          totalPages: 1,
          currentPage: 1
        }));
      } else {
        setCustomers(response.data.data);
        setPagination(prev => ({
          ...prev,
          totalItems: response.data.pagination.totalItems,
          totalPages: response.data.pagination.totalPages,
          currentPage: response.data.pagination.currentPage
        }));
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage, filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleClear = () => {
    setFilters({
      search: '',
      city: '',
      state: '',
      pin_code: '',
      special: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (itemsPerPage) => {
    setPagination(prev => ({ 
      ...prev, 
      itemsPerPage, 
      currentPage: 1 
    }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await axios.delete(`http://localhost:5000/api/customers/${customerId}`);
      // Refresh the current page
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete customer');
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchCustomers} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="customer-list-page">
      <div className="page-header">
        <h1>Customer Management</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Add New Customer
        </Link>
      </div>

      <SearchFilters
        onSearch={handleSearch}
        onClear={handleClear}
        onFilterChange={handleFilterChange}
        filters={filters}
      />

      <div className="sorting-controls">
        <label>Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          className="sort-select"
        >
          <option value="id">ID</option>
          <option value="first_name">First Name</option>
          <option value="last_name">Last Name</option>
          <option value="phone_number">Phone Number</option>
          <option value="created_at">Created Date</option>
        </select>
        <button
          onClick={() => handleSort(sortBy)}
          className="sort-order-btn"
        >
          {sortOrder === 'ASC' ? '↑' : '↓'}
        </button>
      </div>

      <CustomerList
        customers={customers}
        onDelete={handleDeleteCustomer}
        loading={loading}
      />

      {!filters.special && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default CustomerListPage;