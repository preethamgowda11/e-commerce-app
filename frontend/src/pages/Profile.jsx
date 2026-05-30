import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', password: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const update = { name: form.name };
      if (form.password) update.password = form.password;
      const { data } = await api.put('/auth/me', update);
      login({ token: localStorage.getItem('token'), user: { ...user, name: data.name } });
      setSuccess('Profile updated successfully');
      setForm({ name: data.name, password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ maxWidth:'500px', margin:'40px auto', padding:'0 16px' }}>
      <h1 style={{ marginBottom:'24px' }}>My Profile</h1>
      <div style={{ background:'#fff', borderRadius:'12px', padding:'28px',
        boxShadow:'0 1px 4px rgba(0,0,0,0.06)', marginBottom:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'28px',
          paddingBottom:'20px', borderBottom:'1px solid #eee' }}>
          <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'#4f46e5',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontSize:'22px', fontWeight:'600' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight:'600', fontSize:'18px', marginBottom:'2px' }}>{user?.name}</p>
            <p style={{ color:'#888', fontSize:'14px' }}>{user?.email}</p>
            {user?.isAdmin && (
              <span style={{ fontSize:'12px', background:'#fef3c7',
                color:'#b45309', padding:'2px 8px', borderRadius:'10px' }}>Admin</span>
            )}
          </div>
        </div>
        {success && <div style={{ background:'#d1fae5', color:'#065f46', padding:'10px',
          borderRadius:'6px', marginBottom:'16px' }}>{success}</div>}
        {error && <div style={{ background:'#fee2e2', color:'#b91c1c', padding:'10px',
          borderRadius:'6px', marginBottom:'16px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', marginBottom:'6px', fontWeight:'500', fontSize:'14px' }}>Name</label>
            <input type="text" value={form.name} required
              onChange={e => setForm({...form, name: e.target.value})}
              style={{ width:'100%', padding:'10px', border:'1px solid #ddd',
                borderRadius:'6px', fontSize:'14px', boxSizing:'border-box' }} />
          </div>
          <div style={{ marginBottom:'24px' }}>
            <label style={{ display:'block', marginBottom:'6px', fontWeight:'500', fontSize:'14px' }}>
              New Password <span style={{ color:'#888', fontWeight:'400' }}>(leave blank to keep current)</span>
            </label>
            <input type="password" value={form.password} minLength={6}
              onChange={e => setForm({...form, password: e.target.value})}
              placeholder="Min 6 characters"
              style={{ width:'100%', padding:'10px', border:'1px solid #ddd',
                borderRadius:'6px', fontSize:'14px', boxSizing:'border-box' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'12px', background:'#4f46e5', color:'#fff',
              border:'none', borderRadius:'6px', fontSize:'15px', cursor:'pointer', fontWeight:'500' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
      <button onClick={handleLogout}
        style={{ width:'100%', padding:'12px', background:'#fff', color:'#dc2626',
          border:'1px solid #fecaca', borderRadius:'8px', fontSize:'15px',
          cursor:'pointer', fontWeight:'500' }}>
        Logout
      </button>
    </div>
  );
}