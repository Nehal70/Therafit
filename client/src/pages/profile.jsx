import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/userService';
import { jwtDecode } from 'jwt-decode';

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
    password: '',
  });

  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  // Fetch user's profile when the component mounts
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      getUserProfile(userId, token)
        .then((userData) => {
          setUserData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            height: userData.height || '',
            weight: userData.weight || '',
            gender: userData.gender || '',
            dateOfBirth: userData.dateOfBirth || '',
            password: userData.password || '',
          });
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
        });
    }
  }, []); // Empty dependency array ensures this effect runs once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // Include the token in the Authorization header
      await axios.put(
        `http://localhost:5001/api/users/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        }
      );

      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage('❌ Failed to update profile.');
    }
  };

  const [pwMessage, setPWMessage] = useState('');

  const [oldPW, setOldPW] = useState('');
  const [newPW, setNewPW] = useState('');
  const [confPW, setConfPW] = useState('');

  const handlePWSave = async () => {
    if (newPW !== confPW) {
      setPWMessage('❌ Passwords do not match.');
    } else if (oldPW !== userData.password) {
      setPWMessage('❌ Old password is incorrect.');
    } else {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
    
        // Make an API request to update the password
        await axios.put(
          `http://localhost:5001/api/users/${userId}`, // Assuming your API accepts a specific endpoint for password update
          {
            password: newPW,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );
    
        setPWMessage('✅ Password updated successfully!');
        setOldPW('');
        setNewPW('');
        setConfPW('');
    
        // Fetch only the password field to update the state
        const updatedUserData = await getUserProfile(userId, token);
        setUserData((prevData) => ({
          ...prevData, // Keep other fields as is
          password: updatedUserData.password || '', // Update only the password field
        }));
    
      } catch (err) {
        console.error('Error updating password:', err);
        setPWMessage('❌ Failed to update password.');
      }
    }
  };    


  return (
    <>
      <div className='max-w-[600px] my-8 mx-auto'>
        <h2 className='font-bold text-fit-black text-3xl mb-1'>Your Profile</h2>
        <p className='text-fit-gray'>Edit your account information.</p>
        {message && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}

        <div className='mt-5'>
          {Object.entries(userData).map(([key, value]) => {
            if (key == 'password') {
              return
            }
            return (
              <div key={key} className='flex flex-col'>
                <p className='mb-1 text-fit-black'>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
                </p>
                {key === 'gender' ? (
                  <select
                    name="gender"
                    value={userData.gender}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded-md mb-3"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <input
                    type={
                      key === 'dateOfBirth' ? 'date' :
                        key === 'height' || key === 'weight' ? 'number' : 'text' // Restrict height and weight to number
                    }
                    name={key}
                    value={
                      key === 'dateOfBirth' && value
                        ? new Date(value).toISOString().split('T')[0] // Format date correctly
                        : value || '' // Fallback for other fields
                    }
                    className="border border-gray-300 p-2 rounded-md mb-3"
                    onChange={handleChange}
                    min={key === 'height' || key === 'weight' ? '0' : undefined} // Optional: Prevent negative numbers
                    step={key === 'height' || key === 'weight' ? '0.1' : undefined} // Optional: Allow decimal values for height and weight
                  />
                )}
              </div>
            );
          })}

        </div>

        <button
          onClick={handleSave}
          className='cursor-pointer mt-2 px-10 py-2 text-lg font-medium bg-fit-orange text-white rounded-[100px]'
        >
          Save Profile
        </button>
      </div>

      <div className='max-w-[600px] my-8 mx-auto'>
        <h2 className='font-bold text-fit-black text-3xl mb-1'>Privacy and Security</h2>
        <p className='text-fit-gray mb-1'>Update your password.</p>
        {pwMessage && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{pwMessage}</p>}

        <div key='old_pw' className='flex flex-col'>
          <p className='mt-3 mb-1 text-fit-black'>Old Password</p>
          <input
            type='text'
            name='old_pw'
            value={oldPW}
            className="border border-gray-300 p-2 rounded-md mb-3"
            onChange={(e) => setOldPW(e.target.value)}
          />
        </div>

        <div key='new_pw' className='flex flex-col'>
          <p className='mb-1 text-fit-black'>New Password</p>
          <input
            type='text'
            name='new_pw'
            value={newPW}
            className="border border-gray-300 p-2 rounded-md mb-3"
            onChange={(e) => setNewPW(e.target.value)}
          />
        </div>

        <div key='conf_pw' className='flex flex-col'>
          <p className='mb-1 text-fit-black'>Confirm Password</p>
          <input
            type='text'
            name='conf_pw'
            value={confPW}
            className="border border-gray-300 p-2 rounded-md mb-3"
            onChange={(e) => setConfPW(e.target.value)}
          />
        </div>

        <button
          onClick={handlePWSave}
          className='cursor-pointer mt-2 px-10 py-2 text-lg font-medium bg-fit-orange text-white rounded-[100px]'
        >
          Update Password
        </button>
      </div>
    </>
  );
}

export default Profile;