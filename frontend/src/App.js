import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import CustomerListPage from './pages/CustomerListPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CustomerFormPage from './pages/CustomerFormPage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-logo">Qwipo CRM</h1>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Customers</Link>
              </li>
              <li className="nav-item">
                <Link to="/customers/new" className="nav-link">Add Customer</Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<CustomerListPage />} />
            <Route path="/customers/new" element={<CustomerFormPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
            <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;