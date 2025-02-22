import React, { useState } from "react";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Here you can implement the login logic (e.g., make API calls to check credentials)
        if (username === 'user' && password === 'password') {
            alert('Login successful!');
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <>
            <div>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='flex'>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className='border bg-green-400'
                        />
                    </div>
                    <div className='flex'>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}

                        />
                    </div>
                    {error && <div>{error}</div>}
                    <button type="submit">
                        Login
                    </button>
                </form>
            </div>
        </>

    )
}

export default Login