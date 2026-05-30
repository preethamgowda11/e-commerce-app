import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street:'', city:'', country:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cart.length === 0) { navigate('/'); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const items = cart.map(i => ({
        product: i._id, name: i.name,
        price: i.price, quantity: i.quantity, image: i.image
      }));
      await api.post('/orders', { items, address, total });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth:'800px', margin:'32px auto', padding:'0 16px' }}>
      <h1 style={{ marginBottom:'24px' }}>Checkout</h1>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'24px' }}>
        <div style={{ background:'#fff', borderRadius:'12px', padding:'28px',
          boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ marginBottom:'20px', fontSize:'18px' }}>Delivery Address</h2>
          {error && <div style={{ background:'#fee2e2', color:'#b91c1c', padding:'10px',
            borderRadius:'6px', marginBottom:'16px' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            {[
              { key:'street', label:'Street Address' },
              { key:'city',   label:'City' },
              { key:'country',label:'Country' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:'16px' }}>
                <label style={{ display:'block', marginBottom:'6px', fontWeight:'500', fontSize:'14px' }}>
                  {f.label}
                </label>
                <input type="text" required value={address[f.key]}
                  onChange={e => setAddress({...address, [f.key]: e.target.value})}
                  style={{ width:'100%', padding:'10px', border:'1px solid #ddd',
                    borderRadius:'6px', fontSize:'14px', boxSizing:'border-box' }} />
              </div>
            ))}
            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'14px', background:'#4f46e5', color:'#fff',
                border:'none', borderRadius:'8px', fontSize:'15px', cursor:'pointer',
                fontWeight:'500', marginTop:'8px' }}>
              {loading ? 'Placing Order...' : `Place Order — ₹${total.toLocaleString()}`}
            </button>
          </form>
        </div>

        <div style={{ background:'#fff', borderRadius:'12px', padding:'24px',
          boxShadow:'0 1px 4px rgba(0,0,0,0.06)', height:'fit-content' }}>
          <h2 style={{ marginBottom:'16px', fontSize:'18px' }}>Order Summary</h2>
          {cart.map(item => (
            <div key={item._id} style={{ display:'flex', justifyContent:'space-between',
              marginBottom:'10px', fontSize:'14px' }}>
              <div>
                <p style={{ fontWeight:'500', marginBottom:'2px' }}>{item.name}</p>
                <p style={{ color:'#888', fontSize:'12px' }}>Qty: {item.quantity}</p>
              </div>
              <span style={{ fontWeight:'600' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ borderTop:'1px solid #eee', marginTop:'12px', paddingTop:'12px',
            display:'flex', justifyContent:'space-between', fontWeight:'700' }}>
            <span>Total</span>
            <span style={{ color:'#4f46e5' }}>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}