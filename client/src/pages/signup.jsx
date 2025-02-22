import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthday: '',
    email: '',
    gender: 'male',
    otherGender: '',
    currentEquipment: [], // Changed to an array
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate hook

  // List of equipment items to select
  const equipmentOptions = ['Treadmill', 'Dumbbells', 'Yoga Mat', 'Resistance Bands', 'None'];

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle equipment button click
  const handleEquipmentClick = (equipment) => {
    if (equipment === 'None') {
      // If "None" is selected, clear all other selections and set "None" as the only selected item
      setFormData({ ...formData, currentEquipment: ['None'] });
    } else {
      // If "None" was previously selected, deselect it
      if (formData.currentEquipment.includes('None')) {
        setFormData({ ...formData, currentEquipment: [equipment] });
      } else {
        // Toggle the equipment selection
        setFormData((prevState) => {
          const updatedEquipment = prevState.currentEquipment.includes(equipment)
            ? prevState.currentEquipment.filter((item) => item !== equipment) // Deselect
            : [...prevState.currentEquipment, equipment]; // Select

          return { ...prevState, currentEquipment: updatedEquipment };
        });
      }
    }
  };

  // Validate the form data
  const validateForm = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = 'First Name is required';
    if (!formData.lastName) errors.lastName = 'Last Name is required';
    if (!formData.birthday) errors.birthday = 'Birthday is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) errors.email = 'Invalid email address';
    if (formData.currentEquipment.length === 0 || formData.currentEquipment[0] === '') errors.currentEquipment = 'Please select at least one equipment';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // No errors, navigate to the /dashboard page
      console.log('Form submitted successfully', formData);
      navigate('/dashboard'); // Navigate to /dashboard
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className='flex items-start justify-center w-screen h-screen bg-[#F6F5F5] fixed top-0 overflow-auto'>
      <div className='max-w-[500px] w-full bg-white p-8 rounded-md border border-[#e0dfde] m-4'>
        <h2 className='font-bold text-3xl text-black mb-5'>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col mb-4'>
            <label className='text-black'>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className='border border-gray-300 rounded-md p-2'
            />
            {errors.firstName && <p className='text-red-500 text-sm'>{errors.firstName}</p>}
          </div>

          <div className='flex flex-col mb-4'>
            <label className='text-black'>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className='border border-gray-300 rounded-md p-2'
            />
            {errors.lastName && <p className='text-red-500 text-sm'>{errors.lastName}</p>}
          </div>

          <div className='flex flex-col mb-4'>
            <label className='text-black'>Birthday:</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className='border border-gray-300 rounded-md p-2'
            />
            {errors.birthday && <p className='text-red-500 text-sm'>{errors.birthday}</p>}
          </div>

          <div className='flex flex-col mb-4'>
            <label className='text-black'>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className='border border-gray-300 rounded-md p-2'
            />
            {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
          </div>

          <div className='flex flex-col mb-4'>
            <label className='text-black'>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className='border border-gray-300 rounded-md p-2'
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formData.gender === 'other' && (
              <input
                type="text"
                name="otherGender"
                value={formData.otherGender}
                onChange={handleChange}
                placeholder="Please specify"
                className='border border-gray-300 rounded-md p-2 mt-2'
              />
            )}
          </div>

          <div className='flex flex-col mb-4'>
            <label className='text-black'>Current Equipment:</label>
            <div className='flex gap-2'>
              {equipmentOptions.map((equipment) => (
                <button
                  key={equipment}
                  type="button"
                  onClick={() => handleEquipmentClick(equipment)}
                  className={`border p-2 rounded-md ${formData.currentEquipment.includes(equipment) ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                  {equipment}
                </button>
              ))}
            </div>
            {errors.currentEquipment && <p className='text-red-500 text-sm'>{errors.currentEquipment}</p>}
          </div>

          <div className='flex flex-col mb-4'>
            <label className='text-black'>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className='border border-gray-300 rounded-md p-2'
            />
            {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
          </div>

          <div className='flex flex-col mb-6'>
            <label className='text-black'>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className='border border-gray-300 rounded-md p-2'
            />
            {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className='w-full bg-fit-orange text-white py-2 rounded-md hover:bg-fit-orange-hover transition duration-300'
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;