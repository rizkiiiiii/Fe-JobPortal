import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

// IMPORT LIBRARY ICONS & ALERT
import {
    FaTrash, FaEdit, FaDownload, FaBriefcase, FaUsers,
    FaChartPie, FaHome, FaSignOutAlt, FaPlus, FaUserShield,
    FaBan, FaCheckCircle, FaTimesCircle, FaClock, FaPaperPlane
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    //ADMIN
    const [adminStats, setAdminStats] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [pendingJobs, setPendingJobs] = useState([]); 

    // COMPANY
    const [company, setCompany] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [myJobs, setMyJobs] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [companyDesc, setCompanyDesc] = useState('');

    //SEEKER
    const [applications, setApplications] = useState([]);


    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const userStored = JSON.parse(localStorage.getItem('user'));
            setUser(userStored);
            if (!userStored) return navigate('/login');

            //Load Data sesuai role
            if (userStored.role === 'admin') {
                // Load semua data admin 
                await Promise.all([
                    fetchAdminStats(),
                    fetchAllUsers(),
                    fetchAllJobs(),
                    fetchPendingJobs()
                ]);
            } else if (userStored.role === 'company') {
                await Promise.all([
                    checkCompanyProfile(),
                    fetchApplicants(),
                    fetchMyJobs()
                ]);
            } else {
                await fetchMyApplications();
            }
        } catch (error) {
            console.error("Error loading dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    //Manggil API ADMIN
    const fetchAdminStats = async () => { try { const res = await api.get('/admin/stats'); setAdminStats(res.data); } catch (e) { } };
    const fetchAllUsers = async () => { try { const res = await api.get('/admin/users'); setAllUsers(res.data.data); } catch (e) { } };
    const fetchAllJobs = async () => { try { const res = await api.get('/admin/jobs'); setAllJobs(res.data.data); } catch (e) { } };
    const fetchPendingJobs = async () => { try { const res = await api.get('/admin/jobs/pending'); setPendingJobs(res.data.data); } catch (e) { } };

    // Action Menerima Job
    const handleApproveJob = async (id) => {
        try {
            // Pakai method PUT sesuai route backend
            await api.put(`/admin/jobs/${id}/approve`);

            Swal.fire('Approved!', 'Lowongan berhasil ditayangkan.', 'success');

            // Refresh data biar update otomatis
            fetchPendingJobs();
            fetchAllJobs();
            fetchAdminStats();
        } catch (error) {
            Swal.fire('Gagal', 'Terjadi kesalahan saat approve.', 'error');
        }
    };

    // Action Banned User
    const handleAdminDeleteUser = async (id) => {
        const result = await Swal.fire({
            title: 'Banned User?', text: "User ini akan dihapus permanen!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya, Banned!'
        });
        if (result.isConfirmed) {
            try { await api.delete(`/admin/users/${id}`); Swal.fire('Deleted!', 'User musnah.', 'success'); fetchAllUsers(); fetchAdminStats(); } catch (e) { }
        }
    };

    // Action Hapus Job 
    const handleAdminDeleteJob = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus/Tolak Lowongan?', text: "Data ini akan dihapus.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Hapus!'
        });
        if (result.isConfirmed) {
            try { await api.delete(`/admin/jobs/${id}`); Swal.fire('Deleted!', 'Lowongan dihapus.', 'success'); fetchAllJobs(); fetchPendingJobs(); fetchAdminStats(); } catch (e) { }
        }
    };

    // Manggil API (COMPANY & SEEKER)
    const checkCompanyProfile = async () => { try { const res = await api.get('/company/me'); setCompany(res.data.data); } catch (e) { } };
    const fetchApplicants = async () => { try { const res = await api.get('/company/applicants'); setApplicants(res.data.data); } catch (e) { } };
    const fetchMyJobs = async () => { try { const res = await api.get('/my-jobs'); setMyJobs(res.data.data); } catch (e) { } };
    const fetchMyApplications = async () => { try { const res = await api.get('/my-applications'); setApplications(res.data.data); } catch (e) { } };

    const handleCreateCompany = async (e) => { e.preventDefault(); try { await api.post('/company', { name: companyName, description: companyDesc }); checkCompanyProfile(); } catch (e) { } };
    const handleUpdateStatus = async (appId, newStatus) => { try { await api.post(`/applications/${appId}/status`, { status: newStatus }); fetchApplicants(); Swal.fire({ icon: 'success', title: 'Status Updated', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 }); } catch (e) { } };
    const handleDeleteJob = async (id) => { if ((await Swal.fire({ title: 'Hapus?', icon: 'warning', showCancelButton: true })).isConfirmed) { try { await api.delete(`/jobs/${id}`); Swal.fire('Terhapus', '', 'success'); fetchMyJobs(); } catch (e) { } } };
    const handleLogout = () => { localStorage.clear(); navigate('/login'); };


    // HELPERS
    const getStatusBadge = (status) => {
        switch (status) {
            case 'applied':
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', background: '#EEF2FF', color: '#4F46E5', fontSize: '13px', fontWeight: '600', border: '1px solid #C7D2FE' }}>
                    <FaPaperPlane size={12} /> Applied
                </span>;
            case 'hired':
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', background: '#D1FAE5', color: '#065F46', fontSize: '13px', fontWeight: '600', border: '1px solid #A7F3D0' }}>
                    <FaCheckCircle size={12} /> Hired
                </span>;
            case 'rejected':
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', background: '#FEE2E2', color: '#991B1B', fontSize: '13px', fontWeight: '600', border: '1px solid #FECACA' }}>
                    <FaTimesCircle size={12} /> Rejected
                </span>;
            default:
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', background: '#F3F4F6', color: '#374151', fontSize: '13px', fontWeight: '600', border: '1px solid #E5E7EB' }}>
                    <FaClock size={12} /> {status}
                </span>;
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Dashboard...</div>;

    return (
        <div className="dashboard-layout">

            {/* Sidebar */}
            <aside className="sidebar">
                <div style={{ marginBottom: '30px', fontSize: '1.4rem', fontWeight: 'bold', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    JobQuest <span style={{ fontSize: '0.7rem', background: '#333', color: 'white', padding: '3px 8px', borderRadius: '10px' }}>{user.role.toUpperCase()}</span>
                </div>

                <button onClick={() => setActiveTab('overview')} className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px' }}>
                    <FaChartPie /> Overview
                </button>

                {/* MENU ADMIN */}
                {user.role === 'admin' && (
                    <>
                        <button onClick={() => setActiveTab('approvals')} className={`sidebar-link ${activeTab === 'approvals' ? 'active' : ''}`} style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px' }}>
                            <FaUserShield /> Moderasi Job
                            {pendingJobs.length > 0 && <span style={{ background: '#EF4444', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', marginLeft: 'auto' }}>{pendingJobs.length}</span>}
                        </button>
                        <button onClick={() => setActiveTab('manage_users')} className={`sidebar-link ${activeTab === 'manage_users' ? 'active' : ''}`} style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px' }}>
                            <FaUsers /> Manage Users
                        </button>
                        <button onClick={() => setActiveTab('manage_jobs')} className={`sidebar-link ${activeTab === 'manage_jobs' ? 'active' : ''}`} style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px' }}>
                            <FaBriefcase /> Manage Jobs
                        </button>
                    </>
                )}

                {/* MENU COMPANY */}
                {user.role === 'company' && (
                    <>
                        <button onClick={() => setActiveTab('jobs')} className={`sidebar-link ${activeTab === 'jobs' ? 'active' : ''}`} style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px' }}>
                            <FaBriefcase /> Lowongan Saya
                        </button>
                        <button onClick={() => setActiveTab('applicants')} className={`sidebar-link ${activeTab === 'applicants' ? 'active' : ''}`} style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px' }}>
                            <FaUsers /> Pelamar Masuk
                        </button>
                    </>
                )}

                {/* MENU SEEKER */}
                {user.role === 'job_seeker' && (
                    <button onClick={() => setActiveTab('history')} className={`sidebar-link ${activeTab === 'history' ? 'active' : ''}`} style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px' }}>
                        <FaBriefcase /> Riwayat Lamaran
                    </button>
                )}

                <div style={{ marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                    <Link to="/" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaHome /> Ke Home
                    </Link>
                    <button onClick={handleLogout} className="sidebar-link" style={{ color: '#dc3545', width: '100%', textAlign: 'left', border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="dashboard-content">
                <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ margin: 0 }}>
                            {activeTab === 'overview' && 'Dashboard Overview'}
                            {activeTab === 'approvals' && '🛡️ Moderasi Lowongan (Pending)'}
                            {activeTab === 'manage_users' && 'Manajemen User'}
                            {activeTab === 'manage_jobs' && 'Manajemen Semua Lowongan'}
                            {activeTab === 'jobs' && 'Lowongan Saya'}
                            {activeTab === 'applicants' && 'Pelamar Masuk'}
                            {activeTab === 'history' && 'Lamaran Saya'}
                        </h2>
                        <p style={{ color: '#666', margin: 0 }}>Selamat datang, <b>{user.name}</b>!</p>
                    </div>
                    {user.role === 'company' && activeTab === 'jobs' && (
                        <button onClick={() => navigate('/create-job')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaPlus /> Posting Baru</button>
                    )}
                </header>

                <div className="card">

                    {/* OVERVIEW (ADMIN) */}
                    {activeTab === 'overview' && user.role === 'admin' && adminStats && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <div style={{ padding: '20px', background: '#EEF2FF', borderRadius: '8px', textAlign: 'center' }}>
                                <h3 style={{ fontSize: '2rem', color: '#4F46E5', margin: 0 }}>{adminStats.total_users}</h3><p>User</p>
                            </div>
                            <div style={{ padding: '20px', background: '#ECFDF5', borderRadius: '8px', textAlign: 'center' }}>
                                <h3 style={{ fontSize: '2rem', color: '#10B981', margin: 0 }}>{adminStats.total_companies}</h3><p>Company</p>
                            </div>
                            <div style={{ padding: '20px', background: '#FEF3C7', borderRadius: '8px', textAlign: 'center' }}>
                                <h3 style={{ fontSize: '2rem', color: '#F59E0B', margin: 0 }}>{adminStats.total_jobs}</h3><p>Jobs</p>
                            </div>
                            <div style={{ padding: '20px', background: '#FEE2E2', borderRadius: '8px', textAlign: 'center', border: pendingJobs.length > 0 ? '2px solid red' : 'none' }}>
                                <h3 style={{ fontSize: '2rem', color: '#EF4444', margin: 0 }}>{pendingJobs.length}</h3><p>Pending Approval</p>
                            </div>
                        </div>
                    )}

                    {/* OVERVIEW (USER BIASA) */}
                    {activeTab === 'overview' && user.role !== 'admin' && (
                        <div>
                            {user.role === 'company' && !company && (
                                <div style={{ padding: '15px', background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeeba', color: '#856404' }}>
                                    <h4>⚠️ Lengkapi Profil Perusahaan</h4>
                                    <form onSubmit={handleCreateCompany} style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                        <input className="form-control" placeholder="Nama PT" value={companyName} onChange={e => setCompanyName(e.target.value)} style={{ flex: 1, padding: '8px' }} />
                                        <input className="form-control" placeholder="Deskripsi" value={companyDesc} onChange={e => setCompanyDesc(e.target.value)} style={{ flex: 2, padding: '8px' }} />
                                        <button className="btn-primary">Simpan</button>
                                    </form>
                                </div>
                            )}
                            <p style={{ marginTop: '20px' }}>Gunakan menu di sidebar untuk mulai.</p>
                        </div>
                    )}

                    {/* MODERASI JOBS (ADMIN) */}
                    {activeTab === 'approvals' && user.role === 'admin' && (
                        <div>
                            {pendingJobs.length === 0 ? <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Aman! Tidak ada lowongan pending.</p> : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead><tr style={{ textAlign: 'left', background: '#FFF7ED', color: '#C2410C' }}><th style={{ padding: '10px' }}>Posisi</th><th>Perusahaan</th><th>Posted</th><th>Aksi</th></tr></thead>
                                    <tbody>
                                        {pendingJobs.map(j => (
                                            <tr key={j.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px', fontWeight: 'bold' }}>{j.title}</td>
                                                <td>{j.company?.name || '-'}</td>
                                                <td>{new Date(j.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <button onClick={() => handleApproveJob(j.id)} style={{ background: '#10B981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', marginRight: '8px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                        <FaCheckCircle /> Setujui
                                                    </button>
                                                    <button onClick={() => handleAdminDeleteJob(j.id)} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                        <FaTimesCircle /> Tolak
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* MANAGE USERS (ADMIN) */}
                    {activeTab === 'manage_users' && user.role === 'admin' && (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead><tr style={{ textAlign: 'left', background: '#f9fafb' }}><th style={{ padding: '10px' }}>Nama</th><th>Email</th><th>Role</th><th>Aksi</th></tr></thead>
                            <tbody>
                                {allUsers.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td><span style={{ padding: '2px 8px', borderRadius: '10px', background: u.role === 'company' ? '#FEF3C7' : '#E5E7EB', fontSize: '12px' }}>{u.role}</span></td>
                                        <td>
                                            <button onClick={() => handleAdminDeleteUser(u.id)} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <FaBan /> Ban
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* MANAGE ALL JOBS (ADMIN) */}
                    {activeTab === 'manage_jobs' && user.role === 'admin' && (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead><tr style={{ textAlign: 'left', background: '#f9fafb' }}><th style={{ padding: '10px' }}>Judul</th><th>Perusahaan</th><th>Status</th><th>Aksi</th></tr></thead>
                            <tbody>
                                {allJobs.map(j => (
                                    <tr key={j.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{j.title}</td>
                                        <td>{j.company?.name || '-'}</td>
                                        <td>
                                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '12px', background: j.status === 'active' ? '#D1FAE5' : '#FEE2E2', color: j.status === 'active' ? '#065F46' : '#991B1B' }}>
                                                {j.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => handleAdminDeleteJob(j.id)} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* JOBS SAYA (COMPANY) */}
                    {activeTab === 'jobs' && user.role === 'company' && (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead><tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}><th style={{ padding: '15px' }}>Posisi</th><th>Status</th><th>Aksi</th></tr></thead>
                            <tbody>
                                {myJobs.map(job => (
                                    <tr key={job.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '15px' }}>
                                            <strong>{job.title}</strong><br />
                                            <small>{job.location}</small>
                                        </td>
                                        <td>
                                            <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: job.status === 'active' ? '#dcfce7' : '#ffedd5', color: job.status === 'active' ? 'green' : 'orange' }}>
                                                {job.status === 'active' ? 'Tayang' : 'Pending Review'}
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => navigate(`/edit-job/${job.id}`)} style={{ marginRight: '10px', color: 'orange', background: 'none', border: 'none', fontSize: '1.2rem' }}><FaEdit /></button>
                                            <button onClick={() => handleDeleteJob(job.id)} style={{ color: 'red', background: 'none', border: 'none', fontSize: '1.2rem' }}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Pelamar (COMPANY) */}
                    {activeTab === 'applicants' && user.role === 'company' && (
                        <table style={{ width: '100%' }}><thead><tr><th>Pelamar</th><th>Posisi</th><th>Status</th><th>Aksi</th></tr></thead>
                            <tbody>{applicants.map(app => (<tr key={app.id}><td>{app.user.name}</td><td>{app.job.title}</td><td>{app.status}</td><td><select onChange={(e) => handleUpdateStatus(app.id, e.target.value)} value={app.status}><option value="applied">Pending</option><option value="hired">Hire</option><option value="rejected">Tolak</option></select></td></tr>))}</tbody></table>
                    )}

                    {/* HISTORY (SEEKER) */}
                    {activeTab === 'history' && user.role === 'job_seeker' && (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #f3f4f6' }}>
                                        <th style={{ padding: '15px', color: '#6B7280' }}>Posisi</th>
                                        <th style={{ padding: '15px', color: '#6B7280' }}>Perusahaan</th>
                                        <th style={{ padding: '15px', color: '#6B7280' }}>Tanggal</th>
                                        <th style={{ padding: '15px', color: '#6B7280' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map(app => (
                                        <tr key={app.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '15px', fontWeight: '600', color: '#111827' }}>{app.job.title}</td>
                                            <td style={{ padding: '15px', color: '#4B5563' }}>{app.job.company?.name || '-'}</td>
                                            <td style={{ padding: '15px', color: '#6B7280' }}>{new Date(app.created_at).toLocaleDateString()}</td>
                                            <td style={{ padding: '15px' }}>
                                                {getStatusBadge(app.status)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {applications.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                                    Belum ada lamaran terkirim.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;