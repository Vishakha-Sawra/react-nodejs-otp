import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function VerifyEmailForm() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/auth/verify', { email, otp_code: otp });
            console.log(response);
            if (response.data.result[0].message === 'Email is verified') {
                window.alert('Email verification successful');
            }
        } catch (error) {
            console.log(error.response);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='App'>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
                OTP:
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </label>
            <button type="submit">Verify Email</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default VerifyEmailForm;