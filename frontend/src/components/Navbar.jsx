import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'12px 24px', background:'#1a1a2e', color:'#fff', position:'sticky',
      top:0, zIndex:100, boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
      <Link to="/" style={{ color:'#fff', textDecoration:'none', fontSize:'20px', fontWeight:'700' }}>
        🛍️ ShopApp
      </Link>
      <div style={{ display:'flex', gap:'16px', alignItems:'center' }}>
        <Link to="/" style={{ color:'#ccc', textDecoration:'none', fontSize:'14px' }}>Products</Link>
        {user && (
          <>
            <Link to="/orders" style={{ color:'#ccc', textDecoration:'none', fontSize:'14px' }}>My Orders</Link>
            <Link to="/cart" style={{ color:'#ccc', textDecoration:'none', fontSize:'14px', position:'relative' }}>
              🛒 Cart
              {count > 0 && (
                <span style={{ position:'absolute', top:'-8px', right:'-10px', background:'#e53e3e',
                  color:'#fff', borderRadius:'50%', width:'18px', height:'18px', fontSize:'11px',
                  display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700' }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
          </>
        )}
        {user?.isAdmin && (
          <Link to="/admin" style={{ color:'#f59e0b', textDecoration:'none', fontSize:'14px', fontWeight:'500' }}>
            ⚙ Admin
          </Link>
        )}
        {user ? (
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <Link to="/profile" style={{ display:'flex', alignItems:'center', gap:'6px',
              textDecoration:'none', color:'#ccc', fontSize:'14px' }}>
              <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'#4f46e5',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'13px', fontWeight:'600', color:'#fff' }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              {user.name}
            </Link>
            <button onClick={handleLogout}
              style={{ background:'#e53e3e', color:'#fff', border:'none',
                padding:'6px 14px', borderRadius:'6px', cursor:'pointer', fontSize:'13px' }}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" style={{ color:'#ccc', textDecoration:'none', fontSize:'14px' }}>Login</Link>
            <Link to="/register" style={{ background:'#4f46e5', color:'#fff', textDecoration:'none',
              padding:'6px 14px', borderRadius:'6px', fontSize:'14px', fontWeight:'500' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}