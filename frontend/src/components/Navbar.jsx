import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'12px 24px', background:'#1a1a2e', color:'#fff' }}>
      <Link to="/" style={{ color:'#fff', textDecoration:'none', fontSize:'20px', fontWeight:'600' }}>
        🛍️ ShopApp
      </Link>
      <div style={{ display:'flex', gap:'16px', alignItems:'center' }}>
        <Link to="/" style={{ color:'#ccc', textDecoration:'none' }}>Products</Link>
        {user?.isAdmin && (
          <Link to="/admin" style={{ color:'#f59e0b', textDecoration:'none' }}>Admin</Link>
        )}
        {user ? (
          <>
            <span style={{ color:'#ccc', fontSize:'14px' }}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={{ background:'#e53e3e', color:'#fff',
              border:'none', padding:'6px 14px', borderRadius:'6px', cursor:'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color:'#ccc', textDecoration:'none' }}>Login</Link>
            <Link to="/register" style={{ background:'#4f46e5', color:'#fff',
              textDecoration:'none', padding:'6px 14px', borderRadius:'6px' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}