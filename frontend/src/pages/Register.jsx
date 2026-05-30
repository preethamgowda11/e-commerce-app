import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center',
      justifyContent:'center', background:'#f7f8fa' }}>
      <div style={{ background:'#fff', padding:'40px', borderRadius:'12px',
        boxShadow:'0 2px 12px rgba(0,0,0,0.1)', width:'100%', maxWidth:'400px' }}>
        <h2 style={{ marginBottom:'24px', textAlign:'center' }}>Create Account</h2>
        {error && (
          <div style={{ background:'#fee2e2', color:'#b91c1c', padding:'10px',
            borderRadius:'6px', marginBottom:'16px' }}>{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          {[
            { key:'name', label:'Name', type:'text' },
            { key:'email', label:'Email', type:'email' },
            { key:'password', label:'Password', type:'password' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', marginBottom:'6px', fontWeight:'500' }}>{f.label}</label>
              <input type={f.type} value={form[f.key]} required
                onChange={e => setForm({...form, [f.key]: e.target.value})}
                style={{ width:'100%', padding:'10px', border:'1px solid #ddd',
                  borderRadius:'6px', fontSize:'14px' }} />
            </div>
          ))}
          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'12px', background:'#4f46e5', color:'#fff',
              border:'none', borderRadius:'6px', fontSize:'15px',
              cursor:'pointer', fontWeight:'500', marginTop:'8px' }}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'16px', color:'#666', fontSize:'14px' }}>
          Already have an account? <Link to="/login" style={{ color:'#4f46e5' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}