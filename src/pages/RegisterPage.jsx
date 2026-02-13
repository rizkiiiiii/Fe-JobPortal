import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [role, setRole] = useState('job_seeker');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            alert("Konfirmasi password tidak cocok!");
            return;
        }

        try {
            const response = await api.post('/register', {
                name: name,
                email: email,
                password: password,
                password_confirmation: passwordConfirm,
                role: role
            });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            alert("Registrasi Berhasil! Selamat datang.");
            navigate('/dashboard');

        } catch (error) {
            console.error(error);
            alert("Registrasi Gagal: " + (error.response?.data?.message || "Cek koneksi internet"));
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>📝 Daftar Akun Baru</h2>
            <form onSubmit={handleRegister}>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Nama Lengkap:</label>
                    <input 
                        type="text" value={name} onChange={e => setName(e.target.value)} required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input 
                        type="email" value={email} onChange={e => setEmail(e.target.value)} required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input 
                        type="password" value={password} onChange={e => setPassword(e.target.value)} required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Ulangi Password:</label>
                    <input 
                        type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Saya mendaftar sebagai:</label>
                    <select 
                        value={role} onChange={e => setRole(e.target.value)} 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                        <option value="job_seeker">👷 Pencari Kerja</option>
                        <option value="company">🏢 Perusahaan (Penyedia Kerja)</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    DAFTAR SEKARANG
                </button>
            </form>

            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Sudah punya akun? <Link to="/login">Login di sini</Link>
            </p>
        </div>
    );
};

export default RegisterPage;