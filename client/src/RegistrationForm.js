import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Update state when input fields change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to your back-end API
      const response = await axios.post('http://localhost:5001/api/users/register', formData);
      console.log('User registered:', response.data);
      setSuccessMessage('Registration successful! You can now log in.');
      setErrorMessage('');
      setFormData({ firstName: '', lastName: '', email: '', password: '', dateOfBirth: '' }); // Clear form
    } catch (error) {
      console.error('Error registering user:', error.response?.data?.error || error.message);
      setErrorMessage('Failed to register. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <h1>User Registration</h1>

      {/* Display success or error message */}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <form id="userForm" onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '20px auto' }}>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          required
          value={formData.firstName}
          onChange={handleChange}
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          required
          value={formData.lastName}
          onChange={handleChange}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
        />

        <label htmlFor="dateOfBirth">Date of Birth:</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          required
          value={formData.dateOfBirth}
          onChange={handleChange}
        />

        <input type="submit" value="Submit" style={{ marginTop: '15px', cursor: 'pointer' }} />
      </form>
    </div>
  );
};

export default RegistrationForm;

