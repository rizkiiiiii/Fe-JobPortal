import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import { FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaArrowLeft, FaCloudUploadAlt, FaCheck, FaBriefcase, FaClock } from 'react-icons/fa';

const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [cvFile, setCvFile] = useState(null); 

    useEffect(() => {
        const userStored = localStorage.getItem('user');
        if (userStored) setUser(JSON.parse(userStored));
        fetchJobDetail();
    }, [id]);

    const fetchJobDetail = async () => {
        try {
            const response = await api.get('/jobs');
            const foundJob = response.data.data.find(j => j.id == id);
            
            if (foundJob) {
                setJob(foundJob);
            } else {
                Swal.fire('Error', 'Lowongan tidak ditemukan', 'error');
                navigate('/');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();

        if (!user) {
            Swal.fire({
                title: 'Login Dulu Yuk!',
                text: 'Kamu harus login sebagai pelamar untuk melamar kerja.',
                icon: 'info',
                confirmButtonText: 'Ke Halaman Login',
                confirmButtonColor: '#4F46E5'
            }).then((result) => {
                if(result.isConfirmed) navigate('/login');
            });
            return;
        }

        if (!cvFile) {
            Swal.fire('CV Belum Ada', 'Harap upload CV (PDF/DOC) sebelum melamar!', 'warning');
            return;
        }

        // Konfirmasi dengan SweetAlert
        const result = await Swal.fire({
            title: 'Kirim Lamaran?',
            text: `Anda akan melamar posisi ${job.title} di ${job.company?.name}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            confirmButtonText: '🚀 Ya, Kirim!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                const formData = new FormData();
                formData.append('cv', cvFile);

                await api.post(`/jobs/${id}/apply`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                Swal.fire('Berhasil!', 'Lamaran Anda telah terkirim. Good luck! 🍀', 'success')
                    .then(() => navigate('/dashboard'));
                
            } catch (error) {
                Swal.fire('Gagal', error.response?.data?.message || "Terjadi kesalahan.", 'error');
            }
        }
    };

    if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Memuat data...</div>;
    if (!job) return null;

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '40px 20px' }}>
            
            {/* Header */}
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto 30px' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '1rem', marginBottom: '20px', cursor:'pointer' }}>
                    <FaArrowLeft /> Kembali ke Daftar
                </button>

                <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ width: '80px', height: '80px', background: '#EEF2FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', color: '#4F46E5' }}>
                        <FaBuilding />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ margin: '0 0 5px 0', fontSize: '1.8rem', color: '#1F2937' }}>{job.title}</h1>
                        <p style={{ margin: 0, fontSize: '1.1rem', color: '#4F46E5', fontWeight: '500' }}>{job.company?.name}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                         <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#ECFDF5', color: '#065F46', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            <FaCheck /> Verified
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#EFF6FF', color: '#1E40AF', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            <FaBriefcase /> Full Time
                        </span>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                
                <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ borderBottom: '2px solid #F3F4F6', paddingBottom: '15px', marginBottom: '20px', color: '#1F2937' }}>Deskripsi Pekerjaan</h3>
                        
                        <div style={{ lineHeight: '1.8', color: '#4B5563', whiteSpace: 'pre-line', fontSize: '1rem' }}>
                            {job.description}
                        </div>

                        <h3 style={{ borderBottom: '2px solid #F3F4F6', paddingBottom: '15px', marginBottom: '20px', marginTop: '40px', color: '#1F2937' }}>Persyaratan</h3>
                        <ul style={{ lineHeight: '1.8', color: '#4B5563', paddingLeft: '20px' }}>
                            <li>Pengalaman minimal 1 tahun di bidang terkait.</li>
                            <li>Menguasai skill teknis yang dibutuhkan.</li>
                            <li>Mampu bekerja dalam tim maupun individu.</li>
                            <li>Memiliki kemampuan komunikasi yang baik.</li>
                        </ul>
                    </div>
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                    <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', position: 'sticky', top: '100px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Ringkasan</h3>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 'bold' }}>Gaji Penawaran</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 'bold', color: '#10B981', marginTop: '5px' }}>
                                <FaMoneyBillWave /> Rp {parseInt(job.salary).toLocaleString()}
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 'bold' }}>Lokasi Kantor</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: '#374151', marginTop: '5px' }}>
                                <FaMapMarkerAlt color="#EF4444" /> {job.location}
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 'bold' }}>Jam Kerja</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: '#374151', marginTop: '5px' }}>
                                <FaClock color="#F59E0B" /> 09:00 - 17:00
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

                        {!user ? (
                            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '12px', background: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                                Login untuk Melamar
                            </button>
                        ) : user.role === 'job_seeker' ? (
                            <form onSubmit={handleApply}>
                                {/* CUSTOM FILE UPLOAD */}
                                <div style={{ marginBottom: '15px' }}>
                                    <input 
                                        type="file" 
                                        id="cv-upload" 
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setCvFile(e.target.files[0])}
                                        style={{ display: 'none' }} 
                                    />
                                    <label htmlFor="cv-upload" style={{ 
                                        display: 'block', 
                                        padding: '20px', 
                                        border: '2px dashed #4F46E5', 
                                        borderRadius: '8px', 
                                        background: '#EEF2FF', 
                                        textAlign: 'center', 
                                        cursor: 'pointer',
                                        color: '#4F46E5',
                                        transition: '0.3s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#E0E7FF'}
                                    onMouseOut={(e) => e.currentTarget.style.background = '#EEF2FF'}
                                    >
                                        <FaCloudUploadAlt size={24} style={{ marginBottom: '5px' }} />
                                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                                            {cvFile ? cvFile.name : "Klik untuk Upload CV"}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '5px' }}>PDF / DOC (Max 2MB)</div>
                                    </label>
                                </div>

                                <button type="submit" style={{ width: '100%', padding: '15px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.3)' }}>
                                    🚀 Kirim Lamaran
                                </button>
                            </form>
                        ) : (
                            <div style={{ padding: '15px', background: '#F3F4F6', color: '#6B7280', textAlign: 'center', borderRadius: '8px', fontSize: '0.9rem' }}>
                                Akun Perusahaan tidak dapat melamar.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default JobDetailPage;