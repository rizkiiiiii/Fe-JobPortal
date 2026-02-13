import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaMoneyBillWave, FaBuilding, FaCode, FaChartLine, FaRocket, FaLaptop } from 'react-icons/fa';

const HomePage = () => {
    const navigate = useNavigate();
    
    // STATE
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async (keyword = '') => {
        setLoading(true);
        try {
            const url = keyword ? `/jobs?search=${keyword}` : '/jobs';
            const response = await api.get(url);
            setJobs(response.data.data);
        } catch (error) {
            console.error("Gagal ambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(searchTerm);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
            
            {/*Header Atas */}
            <div style={{ 
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', 
                padding: '80px 20px', 
                textAlign: 'center', 
                color: 'white',
                borderBottomRightRadius: '50px',
                borderBottomLeftRadius: '50px',
                boxShadow: '0 10px 30px rgba(79, 70, 229, 0.2)'
            }}>
                <div className="container" style={{ maxWidth: '900px', margin:'0 auto' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px', lineHeight:'1.2' }}>
                        Karir Impianmu <br/> Dimulai Di <span style={{color:'#FCD34D'}}>Sini.</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '40px' }}>
                        Ribuan lowongan teknologi, start-up, dan korporat menunggu lamaranmu.
                    </p>

                    {/* SEARCH BAR */}
                    <form onSubmit={handleSearch} style={{ 
                        background: 'white', 
                        padding: '10px', 
                        borderRadius: '60px', 
                        display: 'flex', 
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                        maxWidth: '700px',
                        margin: '0 auto'
                    }}>
                        <input 
                            type="text" 
                            placeholder="Cari posisi (contoh: React Developer, UI/UX)..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                border: 'none', 
                                outline: 'none', 
                                flex: 1, 
                                padding: '15px 25px', 
                                fontSize: '16px', 
                                borderRadius: '60px' 
                            }}
                        />
                        <button type="submit" style={{ 
                            background: '#4F46E5', 
                            color: 'white', 
                            border: 'none', 
                            padding: '15px 40px', 
                            borderRadius: '50px', 
                            fontSize: '16px', 
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: '0.3s'
                        }}>
                             Cari
                        </button>
                    </form>
                </div>
            </div>

            {/* KATEGORI (Shortcut Cepat) */}
            <div style={{ padding: '40px 0', background: 'white', borderBottom: '1px solid #eee' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', maxWidth:'1000px', margin:'0 auto' }}>
                    
                    {/* Item Kategori */}
                    {[
                        {icon: FaCode, text:'Programmer', color:'#3B82F6'}, 
                        {icon: FaChartLine, text:'Finance', color:'#10B981'}, 
                        {icon: FaRocket, text:'Startup', color:'#F59E0B'}, 
                        {icon: FaLaptop, text:'Remote', color:'#8B5CF6'}
                    ].map((cat, idx) => (
                        <div key={idx} 
                            onClick={() => fetchJobs(cat.text === 'Startup' ? '' : cat.text)}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '10px', 
                                padding:'10px 20px', borderRadius:'30px', border:'1px solid #eee',
                                cursor:'pointer', transition:'0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#F3F4F6'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                        >
                            <cat.icon color={cat.color} size={20} /> 
                            <span style={{fontWeight:'600', color:'#4B5563'}}>{cat.text}</span>
                        </div>
                    ))}

                </div>
            </div>

            {/* DAFTAR LOWONGAN (GRID VIEW) */}
            <div className="container" style={{ padding: '60px 20px', flex: 1, maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#1F2937', fontSize:'1.8rem' }}>🔥 Lowongan Terbaru</h2>
                    <span style={{color: '#6B7280', background:'#E5E7EB', padding:'5px 15px', borderRadius:'20px', fontSize:'0.9rem'}}>
                        {jobs.length} Pekerjaan
                    </span>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', fontSize:'1.2rem', color:'#666' }}>Sedang memuat data...</p>
                ) : jobs.length > 0 ? (
                    
                    <div className="job-grid"> 
                        {jobs.map((job) => (
                            <div key={job.id} style={{ 
                                background: 'white',
                                borderRadius: '16px',
                                padding: '25px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                border: '1px solid #F3F4F6',
                                transition: '0.3s',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                            }}
                            >
                                {/* Header Card */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <div style={{ 
                                        width: '50px', height: '50px', 
                                        background: '#EEF2FF', borderRadius: '12px', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '24px', color: '#4F46E5' 
                                    }}>
                                        <FaBuilding />
                                    </div>
                                    <span style={{ 
                                        background: '#D1FAE5', color: '#065F46', 
                                        padding: '5px 12px', borderRadius: '20px', 
                                        fontSize: '10px', fontWeight: 'bold', height:'fit-content' 
                                    }}>
                                        FULL TIME
                                    </span>
                                </div>

                                {/* Title & Company */}
                                <h3 style={{ fontSize: '1.25rem', fontWeight:'700', margin: '0 0 5px 0', color: '#111' }}>{job.title}</h3>
                                <p style={{ margin: '0 0 20px 0', color: '#6B7280', fontSize: '1rem' }}>{job.company?.name}</p>

                                {/* Details */}
                                <div style={{ marginTop: 'auto' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '0.9rem', marginBottom: '8px' }}>
                                        <FaMapMarkerAlt color="#9CA3AF" /> {job.location}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 'bold', color: '#10B981' }}>
                                        <FaMoneyBillWave /> 
                                        Rp {parseInt(job.salary).toLocaleString()}
                                    </div>
                                    
                                    <button 
                                        onClick={() => navigate(`/jobs/${job.id}`)}
                                        style={{ 
                                            width: '100%', marginTop: '20px', padding: '12px', 
                                            background: '#4F46E5', color: 'white', 
                                            border: 'none', borderRadius: '10px', 
                                            fontWeight: '600', cursor: 'pointer',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        Lihat Detail
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                ) : (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', border:'1px dashed #ccc' }}>
                        <h3 style={{color:'#666'}}>Yah, lowongan tidak ditemukan. 😔</h3>
                        <button onClick={() => { setSearchTerm(''); fetchJobs(''); }} style={{ marginTop: '15px', padding: '10px 20px', background: '#4F46E5', color:'white', border: 'none', borderRadius:'8px', cursor:'pointer' }}>
                            Reset Pencarian
                        </button>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <footer style={{ background: '#111827', color: 'white', padding: '60px 0', marginTop: 'auto' }}>
                <div className="container" style={{ maxWidth:'1200px', margin:'0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', padding:'0 20px' }}>
                    <div>
                        <h2 style={{ margin: '0 0 20px 0', color:'white' }}>JobQuest</h2>
                        <p style={{ opacity: 0.7, lineHeight: '1.6' }}>
                            Platform pencarian kerja terbaik untuk talenta digital Indonesia. Bangun karirmu hari ini.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 20px 0', color:'#F3F4F6' }}>Perusahaan</h4>
                        <ul style={{ listStyle: 'none', padding: 0, opacity: 0.7, lineHeight: '2.5' }}>
                            <li>Tentang Kami</li>
                            <li>Karir</li>
                            <li>Blog</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 20px 0', color:'#F3F4F6' }}>Bantuan</h4>
                        <ul style={{ listStyle: 'none', padding: 0, opacity: 0.7, lineHeight: '2.5' }}>
                            <li>Pusat Bantuan</li>
                            <li>Syarat & Ketentuan</li>
                            <li>Kebijakan Privasi</li>
                        </ul>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #374151', opacity: 0.5, fontSize: '0.9rem' }}>
                    &copy; 2026 JobQuest. All rights reserved.Created by Putri Tanjung
                </div>
            </footer>

        </div>
    );
};

export default HomePage;