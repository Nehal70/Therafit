import Wordmark from '../assets/wordmark.svg';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMenuSharp, IoCloseSharp } from "react-icons/io5";

// Main navbar component
export default function Navbar() {


  return (
    <>
      <div className='sticky top-0 bg-white flex items-center justify-between border-b px-5 py-3 border-gray-300'>
        <a href='/'><img className='max-w-[130px]' src={Wordmark} /></a>
        <div className='flex gap-4 justify-center align-middle'>
          <a href='login'><button className='border border-[#1E1E1E] text-[#1E1E1E] px-5 py-2 rounded-[100px]'>Sign Up</button></a>
          <a href='login'><button className='bg-fit-orange px-5 py-2 rounded-[100px]'>Log In</button></a>
        </div>
      </div>
    </>
  );
}