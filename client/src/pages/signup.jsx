import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCircleCheck } from "react-icons/fa6";
import { MdError } from "react-icons/md";
import Wordmark from '../assets/wordmark.svg';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate the form data
  const validateForm = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Birthday is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!formData.email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // No validation errors, proceed with registration API call
      try {
        // Send POST request to your back-end API
        const response = await axios.post('http://localhost:5001/api/users/register', formData);
        console.log('User registered:', response.data);

        // On success, clear form, set success message, and set a redirect message
        setErrorMessage('');
        setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', dateOfBirth: '' });

        // Show a message before redirect
        setSuccessMessage('Registration successful! Redirecting...');
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000); // 3-second delay for redirect

      } catch (error) {
        console.error('Error registering user:', error.response?.data?.error || error.message);
        setErrorMessage('Failed to register. Please try again.');
        setSuccessMessage('');
      }
    } else {
      setErrors(validationErrors);
    }
  };


  return (
    <div className="flex items-start justify-center w-screen h-screen fixed top-0 overflow-auto bg-[#F6F5F5]">
      <div className="max-w-[500px] w-full bg-white p-8 rounded-md border border-[#e0dfde] m-7">
        <a href='/'><img className='mb-5 max-w-[150px]' src={Wordmark} /></a>
        <h2 className="font-bold text-3xl text-fit-black mb-1">Create Account</h2>
        <p className='text-fit-gray mb-4'>Already have an account? <a className='underline' href='/login'>Log in</a>.</p>

        {/* Display success or error messages */}
        {successMessage && <div className='bg-[#1eab60] p-3 rounded-md flex mb-5 items-center'>
          <FaCircleCheck size={17} className='text-white mr-3' />
          <p className='text-white'>{successMessage}</p>
        </div>}
        {errorMessage && <div className='bg-[#cc4646] p-3 rounded-md flex mb-5 items-center'>
          <MdError size={17} className='text-white mr-3' />
          <p className='text-white'>{errorMessage}</p>
        </div>}

        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="flex flex-col mb-4">
            <label className="text-black">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div className="flex flex-col mb-4">
            <label className="text-black">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>

          {/* Birthday */}
          <div className="flex flex-col mb-4">
            <label className="text-black">Birthday:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col mb-4">
            <label className="text-black">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col mb-4">
            <label className="text-black">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col mb-6">
            <label className="text-black">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-fit-orange text-white py-2 rounded-md hover:bg-fit-orange-hover transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;