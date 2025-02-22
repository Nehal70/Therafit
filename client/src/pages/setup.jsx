import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Setup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    gender: '',
  });
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setMessage('❌ User not logged in.');
      return;
    }

    try {
      await axios.put(`http://localhost:5001/api/users/${userId}`, formData);
      setMessage('✅ Profile updated successfully! 🎉');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage('❌ Failed to update profile.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '450px', margin: '20px auto', textAlign: 'center' }}>
      <h2>👋 Welcome{userName ? `, ${userName}` : ''}!</h2>
      <p>Let’s personalize your experience. This helps us tailor your workouts just for you!</p>

      <div style={{ margin: '15px 0' }}>
        <strong>Step 1 of 1: Complete your profile</strong>
      </div>

      {message && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
        <label>
          Height (cm):
          <input
            type="number"
            name="height"
            placeholder="e.g., 175"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Weight (kg):
          <input
            type="number"
            name="weight"
            placeholder="e.g., 70"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="male">Male 🚹</option>
            <option value="female">Female 🚺</option>
          </select>
        </label>

        <button type="submit" style={{ cursor: 'pointer', padding: '10px 20px', fontWeight: 'bold' }}>
          Save & Continue 🚀
        </button>
      </form>
    </div>
  );
}

export default Setup;
