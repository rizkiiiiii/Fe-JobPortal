import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">
                JobQuest
            </Link>

            <div className="nav-links">
                <Link to="/" className="nav-item">Home</Link>
                
                {user ? (
                    <>
                        <Link to="/dashboard" className="nav-item">Dashboard</Link>
                        <span style={{color:'#ccc'}}>|</span>
                        <span style={{fontWeight:'bold', color:'#4F46E5'}}>Hi, {user.name}</span>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-item">Login</Link>
                        <Link to="/register" className="btn-primary" style={{textDecoration:'none'}}>Daftar Sekarang</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;