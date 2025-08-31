import React, { useState } from 'react';
import './SearchFilters.css';

const SearchFilters = ({ onSearch, onClear, onFilterChange, filters }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear();
  };

  const handleFilterChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  return (
    <div className="search-filters">
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search by name or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <button 
              type="button" 
              onClick={handleClear}
              className="btn btn-secondary"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="filters-section">
        <h3>Filter by Location</h3>
        <div className="filter-grid">
          <div className="filter-group">
            <label htmlFor="city-filter">City:</label>
            <input
              type="text"
              id="city-filter"
              placeholder="Enter city name"
              value={filters.city || ''}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="state-filter">State:</label>
            <input
              type="text"
              id="state-filter"
              placeholder="Enter state name"
              value={filters.state || ''}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="pin-filter">Pin Code:</label>
            <input
              type="text"
              id="pin-filter"
              placeholder="Enter pin code"
              value={filters.pin_code || ''}
              onChange={(e) => handleFilterChange('pin_code', e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button 
            onClick={handleClear}
            className="btn btn-outline"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      <div className="special-filters">
        <h3>Special Views</h3>
        <div className="special-filter-buttons">
          <button 
            onClick={() => onFilterChange('special', 'multiple-addresses')}
            className="btn btn-outline btn-special"
          >
            Multiple Addresses
          </button>
          <button 
            onClick={() => onFilterChange('special', 'single-address')}
            className="btn btn-outline btn-special"
          >
            Single Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;