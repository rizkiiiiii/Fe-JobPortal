import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const JobCreatePage = () => {
    const navigate = useNavigate();
    
    // State untuk form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/jobs', {
                title,
                description,
                location,
                salary
            });
            alert("Lowongan berhasil dibuat! Menunggu verifikasi admin.");
            navigate('/dashboard'); // Balik ke dashboard
        } catch (error) {
            console.error(error);
            alert("Gagal posting job: " + error.response?.data?.message);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>📢 Posting Lowongan Baru</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Judul Pekerjaan (Posisi):</label>
                    <input 
                        type="text" 
                        value={title} onChange={e => setTitle(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        placeholder="Contoh: Senior React Developer"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Lokasi:</label>
                    <input 
                        type="text" 
                        value={location} onChange={e => setLocation(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        placeholder="Contoh: Jakarta Selatan (WFO)"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Gaji (Rp):</label>
                    <input 
                        type="number" 
                        value={salary} onChange={e => setSalary(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        placeholder="Contoh: 10000000"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Deskripsi & Syarat:</label>
                    <textarea 
                        value={description} onChange={e => setDescription(e.target.value)} 
                        required 
                        rows="5"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => navigate('/dashboard')} style={{ padding: '10px', background: '#ccc', border: 'none' }}>Batal</button>
                    <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none' }}>🚀 Posting Sekarang</button>
                </div>
            </form>
        </div>
    );
};

export default JobCreatePage;   