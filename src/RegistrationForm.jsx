import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function RegistrationForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/auth/register', { username, email, password });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='App'>
            <label>
                Username:
                <input type="name" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button type="submit">Register</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default RegistrationForm;