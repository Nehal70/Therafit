import { useState, useEffect, useRef } from 'react';
import Wordmark from '../assets/wordmark.svg';
import { FaChevronDown } from "react-icons/fa";
import { ImExit } from "react-icons/im";

// Main navbar component
export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);

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
        setIsDropdownOpen(false); // Close dropdown if clicked outside
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
    <>
      <div className='sticky top-0 bg-white flex items-center justify-between border-b px-5 py-3 border-gray-300'>
        <a href='/'><img className='max-w-[130px]' src={Wordmark} /></a>
        
        <div 
          ref={dropdownButtonRef}
          className='cursor-pointer flex gap-3 justify-center items-center rounded-[100px] hover:bg-gray-100 px-5 py-2'
          onClick={toggleDropdown}
        >
          <p>Jane Smith</p>
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
                <a className='flex items-center' href='/login'><button>Logout</button>&nbsp;&nbsp;<ImExit /></a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
