import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { PiHandWaving } from "react-icons/pi";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { getUserProfile } from '../services/userService';

function Setup() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    gender: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        if (decoded.userId) {
          getUserProfile(decoded.userId, token)
            .then(user => {
              setUserName(user.firstName);
            })
            .catch(error => {
              console.error('Error:', error);
              setUserName('User');
            });
        } else {
          setUserName('User');
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUserName('User');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('❌ User not logged in.');
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.userId;
  
      if (!userId) {
        setMessage('❌ Invalid user ID.');
        return;
      }
  
      // Convert height and weight to numbers
      const updatedData = {
        ...formData,
        height: Number(formData.height),
        weight: Number(formData.weight),
      };
  
      await axios.put(`http://localhost:5001/api/users/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setMessage('✅ Profile updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage('❌ Failed to update profile.');
    }
  };  

  return (
    <div className='max-w-[450px] mx-auto my-[20px] p-4'>
      <h2 className='font-bold text-fit-black text-4xl flex items-center mb-1'>
        <PiHandWaving />&nbsp;Welcome{userName ? `, ${userName}` : ''}!
      </h2>
      <p className='text-fit-gray mb-4'>
        Let&#8217;s personalize your experience. This helps us tailor your workouts just for you!
      </p>

      <div className='mb-4 text-fit-black'>
        <strong>Please complete your profile.</strong>
      </div>

      {message && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}

      <form onSubmit={handleSubmit} className='grid gap-4'>
        <label className="flex flex-col">
          Height (cm):
          <input
            type="number"
            name="height"
            placeholder="e.g., 175"
            value={formData.height}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2"
            required
          />
        </label>

        <label className="flex flex-col">
          Weight (kg):
          <input
            type="number"
            name="weight"
            placeholder="e.g., 70"
            value={formData.weight}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2"
            required
          />
        </label>

        <label className="flex flex-col mb-4">
          Gender:
          <select name="gender" required value={formData.gender}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>

        <button type="submit" className='cursor-pointer px-5 py-2 font-bold bg-fit-orange hover:bg-fit-orange-hover text-white hover:text-fit-white-hover rounded-[100px]'>
          Save & Continue
        </button>
      </form>
    </div>
  );
}

export default Setup;
