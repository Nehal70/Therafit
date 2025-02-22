import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Wordmark from '../assets/wordmark.svg';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Here you can implement the login logic (e.g., make API calls to check credentials)
        if (username === 'user' && password === 'pw') {
            navigate("/welcome");
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <>
            <div className='flex items-center justify-center w-screen h-screen bg-[#F6F5F5] fixed top-0'>
                <div className='max-w-[500px] w-full bg-white p-8 rounded-md border border-[#e0dfde]'>
                    <img className='mb-5 max-w-[150px]' src={Wordmark} />
                    <h2 className='font-bold text-3xl text-fit-black mb-1'>Welcome back</h2>
                    <p className='text-fit-gray mb-4'>Please enter your login details.</p>
                    <form onSubmit={handleSubmit}>
                        <div className='flex flex-col rounded-lg'>
                            <label className='text-fit-black'>Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='border border-gray-300 rounded-md p-2 mb-3'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='text-fit-black'>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='border border-gray-300 rounded-md p-2'
                            />
                        </div>
                        {error && <div className='text-fit-black'>{error}</div>}
                        <button className='mt-6 bg-fit-orange rounded-[100px] px-10 text-white py-2 text-lg font-medium hover:bg-fit-orange-hover hover:text-fit-white-hover' type="submit">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>

    )
}

export default Login