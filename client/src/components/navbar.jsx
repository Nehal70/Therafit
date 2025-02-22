import { useState, useEffect, useRef } from 'react';
import Wordmark from '../assets/wordmark.svg';
import { FaChevronDown } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { jwtDecode } from 'jwt-decode';
import { getUserProfile } from '../services/userService';

// Main navbar component
export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);

  // Fetch user's profile when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        if (userId) {
          getUserProfile(userId, token)
            .then(user => {
              setUserName(user.firstName + " " + user.lastName);
            })
            .catch(error => {
              console.error('Error fetching user profile:', error);
              setUserName('User'); // Fallback name if error
            });
        } else {
          setUserName('User'); // Fallback name if no userId
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUserName('User'); // Fallback name
      }
    }
  }, []); // Empty dependency array ensures this effect runs once on mount

  // Toggle dropdown visibility when clicked
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close the dropdown if the user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        dropdownButtonRef.current && !dropdownButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener('click', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  return (
    <div className='sticky top-0 bg-white flex items-center justify-between border-b px-5 py-3 border-gray-300'>
      <a href='/'><img className='max-w-[130px]' src={Wordmark} alt="Logo" /></a>
      
      <div 
        ref={dropdownButtonRef}
        className='cursor-pointer flex gap-3 justify-center items-center rounded-[100px] hover:bg-gray-100 px-5 py-2'
        onClick={toggleDropdown}
      >
        <p>{userName || 'User'}</p> {/* Display the user's name or fallback to 'User' */}
        <FaChevronDown />
      </div>
      
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          className='fixed top-13 right-3 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-40'
        >
          <ul className='py-2'>
            <li className='px-4 py-2 cursor-pointer hover:bg-gray-100'>
              <a className='flex items-center' href='/login'>
                <button>Logout</button>&nbsp;&nbsp;<ImExit />
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
