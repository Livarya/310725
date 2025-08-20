import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading, user } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect otomatis kalau sudah login
  useEffect(() => {
    if (user) {
      if (user.role === 'superadmin') {
        navigate('/superadmin/dashboard', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedIn = await login(nip, password);
    if (loggedIn) {
      if (loggedIn.role === 'superadmin') {
        navigate('/superadmin/dashboard');
      } else if (loggedIn.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--light-blue)'}}>
      <div className="card" style={{maxWidth:380,width:'100%',padding:'36px 32px',margin:'32px 0'}}>
        <h2 style={{textAlign:'center',fontWeight:700,color:'var(--primary-blue)',marginBottom:24}}>Login</h2>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
          <input
            type="text"
            placeholder="NIP"
            value={nip}
            onChange={e => { if (/^\d{0,18}$/.test(e.target.value)) setNip(e.target.value); }}
            required
            minLength={18}
            maxLength={18}
            pattern="\d{18}"
            title="NIP harus 18 digit angka"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
          {error && <div style={{color:'red',marginTop:8}}>{error}</div>}
        </form>
        <p style={{marginTop:8,textAlign:'center'}}>
          <a href="/forgot-password" style={{color:'var(--accent-blue)',fontWeight:600}}>Lupa password?</a>
        </p>
        <p style={{marginTop:18,textAlign:'center',color:'#64748b'}}>
          Belum punya akun? <a href="/register" style={{color:'var(--accent-blue)',fontWeight:600}}>Daftar</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
