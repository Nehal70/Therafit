import React, { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
  });

  // Update state when input fields change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Log form data on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <h1>User Registration</h1>
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
