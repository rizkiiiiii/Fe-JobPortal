import React, { useState } from 'react';
import api from '../services/api'; 
import { useNavigate } from 'react-router-dom'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault(); 

        try {
            const response = await api.post('/login', {
                email: email,
                password: password
            });

            console.log("Login Berhasil:", response.data);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            alert("Login Berhasil! Selamat datang.");
            navigate('/dashboard');

        } catch (error) {
            console.error("Login Gagal:", error);
            alert("Login Gagal! Cek email atau password.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>🔐 Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label><br />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label><br />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <button 
                    type="submit" 
                    style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    MASUK SEKARANG
                </button>
            </form>
        </div>
    );
};

export default LoginPage;