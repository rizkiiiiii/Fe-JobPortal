import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const JobEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');

    useEffect(() => {
        fetchJobDetail();
    }, []);

    const fetchJobDetail = async () => {
        try {
            const response = await api.get(`/jobs`); 
            const job = response.data.data.find(j => j.id == id);
            
            if (job) {
                setTitle(job.title);
                setDescription(job.description);
                setLocation(job.location);
                setSalary(job.salary);
            }
        } catch (error) {
            alert("Gagal load data");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/jobs/${id}`, {
                title, description, location, salary
            });
            alert("Lowongan berhasil diupdate!");
            navigate('/dashboard');
        } catch (error) {
            alert("Gagal update");
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
            <h2>✏️ Edit Lowongan</h2>
            <form onSubmit={handleUpdate}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Judul Pekerjaan</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Lokasi</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Gaji (Rp)</label>
                    <input type="number" value={salary} onChange={e => setSalary(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Deskripsi</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows="5" required style={{ width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>Simpan Perubahan</button>
            </form>
        </div>
    );
};

export default JobEditPage;