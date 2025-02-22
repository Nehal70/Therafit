import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    height: '',
    weight: '',
    gender: '',
    dateOfBirth: '',
  });

  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setMessage('❌ User not logged in.');
      return navigate('/login');
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/users/${userId}`);
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setMessage('❌ Failed to load profile.');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    try {
      await axios.put(`http://localhost:5001/api/users/${userId}`, userData);
      setMessage('✅ Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage('❌ Failed to update profile.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '20px auto', textAlign: 'center' }}>
      <h2>👤 Your Profile</h2>
      {message && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}

      <div style={{ textAlign: 'left', marginTop: '20px' }}>
        {Object.entries(userData).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '15px' }}>
            <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:</strong>{' '}
            {isEditing ? (
              key === 'gender' ? (
                <select name="gender" value={userData.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="male">Male 🚹</option>
                  <option value="female">Female 🚺</option>
                </select>
              ) : (
                <input
                  type={key === 'dateOfBirth' ? 'date' : 'text'}
                  name={key}
                  value={value || ''}
                  onChange={handleChange}
                />
              )
            ) : (
              <span>{value || 'N/A'}</span>
            )}
          </div>
        ))}
      </div>

      {isEditing ? (
        <button
          onClick={handleSave}
          style={{ cursor: 'pointer', marginTop: '20px', padding: '10px 20px', fontWeight: 'bold' }}
        >
          💾 Save Changes
        </button>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          style={{ cursor: 'pointer', marginTop: '20px', padding: '10px 20px', fontWeight: 'bold' }}
        >
          ✏️ Edit Profile
        </button>
      )}
    </div>
  );
}

export default Profile;
