import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div style={{ maxWidth:'600px', margin:'80px auto', textAlign:'center', padding:'0 16px' }}>
      <div style={{ fontSize:'64px', marginBottom:'16px' }}>🛒</div>
      <h2 style={{ marginBottom:'8px' }}>Your cart is empty</h2>
      <p style={{ color:'#666', marginBottom:'24px' }}>Add some products to get started</p>
      <Link to="/" style={{ background:'#4f46e5', color:'#fff', padding:'12px 28px',
        borderRadius:'8px', textDecoration:'none', fontWeight:'500' }}>
        Browse Products
      </Link>
    </div>
  );

  return (
    <div style={{ maxWidth:'900px', margin:'32px auto', padding:'0 16px' }}>
      <h1 style={{ marginBottom:'24px' }}>Shopping Cart ({cart.length} items)</h1>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'24px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {cart.map(item => (
            <div key={item._id} style={{ background:'#fff', borderRadius:'12px', padding:'16px',
              display:'flex', gap:'16px', alignItems:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <img src={item.image || 'https://placehold.co/80x80?text=?'} alt={item.name}
                style={{ width:'80px', height:'80px', objectFit:'cover', borderRadius:'8px' }} />
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:'600', marginBottom:'4px' }}>{item.name}</p>
                <p style={{ color:'#4f46e5', fontWeight:'700', marginBottom:'8px' }}>₹{item.price.toLocaleString()}</p>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    style={{ width:'28px', height:'28px', border:'1px solid #ddd', borderRadius:'6px',
                      cursor:'pointer', background:'#f9f9f9', fontSize:'16px' }}>−</button>
                  <span style={{ minWidth:'24px', textAlign:'center', fontWeight:'500' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    style={{ width:'28px', height:'28px', border:'1px solid #ddd', borderRadius:'6px',
                      cursor:'pointer', background:'#f9f9f9', fontSize:'16px',
                      opacity: item.quantity >= item.stock ? 0.4 : 1 }}>+</button>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontWeight:'700', fontSize:'16px', marginBottom:'8px' }}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
                <button onClick={() => removeFromCart(item._id)}
                  style={{ background:'#fff0f0', color:'#dc2626', border:'1px solid #fecaca',
                    padding:'4px 12px', borderRadius:'6px', cursor:'pointer', fontSize:'13px' }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button onClick={clearCart}
            style={{ alignSelf:'flex-start', background:'none', border:'1px solid #ddd',
              padding:'8px 16px', borderRadius:'6px', cursor:'pointer', color:'#666', fontSize:'13px' }}>
            Clear Cart
          </button>
        </div>

        <div style={{ background:'#fff', borderRadius:'12px', padding:'24px',
          boxShadow:'0 1px 4px rgba(0,0,0,0.06)', height:'fit-content', position:'sticky', top:'72px' }}>
          <h2 style={{ marginBottom:'20px', fontSize:'18px' }}>Order Summary</h2>
          {cart.map(item => (
            <div key={item._id} style={{ display:'flex', justifyContent:'space-between',
              marginBottom:'8px', fontSize:'14px', color:'#555' }}>
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ borderTop:'1px solid #eee', marginTop:'16px', paddingTop:'16px',
            display:'flex', justifyContent:'space-between', fontWeight:'700', fontSize:'18px' }}>
            <span>Total</span>
            <span style={{ color:'#4f46e5' }}>₹{total.toLocaleString()}</span>
          </div>
          <button onClick={() => user ? navigate('/checkout') : navigate('/login')}
            style={{ width:'100%', padding:'14px', background:'#4f46e5', color:'#fff',
              border:'none', borderRadius:'8px', fontSize:'15px', cursor:'pointer',
              fontWeight:'500', marginTop:'20px' }}>
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
          <Link to="/" style={{ display:'block', textAlign:'center', marginTop:'12px',
            color:'#666', fontSize:'13px', textDecoration:'none' }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}