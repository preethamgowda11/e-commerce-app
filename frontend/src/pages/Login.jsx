import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f7f8fa' }}>
      <div style={{ background:'#fff', padding:'40px', borderRadius:'12px',
        boxShadow:'0 2px 12px rgba(0,0,0,0.1)', width:'100%', maxWidth:'400px' }}>
        <h2 style={{ marginBottom:'24px', textAlign:'center' }}>Login</h2>
        {error && <div style={{ background:'#fee2e2', color:'#b91c1c', padding:'10px',
          borderRadius:'6px', marginBottom:'16px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', marginBottom:'6px', fontWeight:'500' }}>Email</label>
            <input type="email" value={form.email} required
              onChange={e => setForm({...form, email: e.target.value})}
              style={{ width:'100%', padding:'10px', border:'1px solid #ddd',
                borderRadius:'6px', fontSize:'14px', boxSizing:'border-box' }} />
          </div>
          <div style={{ marginBottom:'24px' }}>
            <label style={{ display:'block', marginBottom:'6px', fontWeight:'500' }}>Password</label>
            <input type="password" value={form.password} required
              onChange={e => setForm({...form, password: e.target.value})}
              style={{ width:'100%', padding:'10px', border:'1px solid #ddd',
                borderRadius:'6px', fontSize:'14px', boxSizing:'border-box' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'12px', background:'#4f46e5', color:'#fff',
              border:'none', borderRadius:'6px', fontSize:'15px', cursor:'pointer', fontWeight:'500' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'16px', color:'#666', fontSize:'14px' }}>
          No account? <Link to="/register" style={{ color:'#4f46e5' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
