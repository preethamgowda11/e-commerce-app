import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const cartItem = cart.find(i => i._id === product?._id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div style={{ textAlign:'center', padding:'60px', color:'#666' }}>Loading...</div>;
  if (!product) return null;

  return (
    <div style={{ maxWidth:'800px', margin:'40px auto', padding:'0 16px' }}>
      <button onClick={() => navigate(-1)}
        style={{ background:'none', border:'1px solid #ddd', padding:'8px 16px',
          borderRadius:'6px', cursor:'pointer', marginBottom:'24px', fontSize:'14px' }}>
        ← Back
      </button>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'40px',
        background:'#fff', borderRadius:'12px', padding:'32px',
        boxShadow:'0 1px 6px rgba(0,0,0,0.08)' }}>
        <img src={product.image || 'https://placehold.co/360x300?text=No+Image'}
          alt={product.name}
          style={{ width:'100%', borderRadius:'8px', objectFit:'cover' }} />
        <div>
          <h1 style={{ fontSize:'24px', marginBottom:'8px' }}>{product.name}</h1>
          {product.category && <p style={{ color:'#888', marginBottom:'16px', fontSize:'14px' }}>{product.category}</p>}
          <p style={{ fontSize:'30px', fontWeight:'700', color:'#4f46e5', marginBottom:'16px' }}>
            ₹{product.price.toLocaleString()}
          </p>
          <p style={{ color:'#444', lineHeight:'1.7', marginBottom:'20px', fontSize:'14px' }}>
            {product.description || 'No description available.'}
          </p>
          <p style={{ color: product.stock > 0 ? '#059669' : '#dc2626',
            fontWeight:'500', marginBottom:'20px', fontSize:'14px' }}>
            {product.stock > 0 ? `✓ In stock (${product.stock} available)` : '✗ Out of stock'}
          </p>
          {product.stock > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
              <label style={{ fontSize:'14px', fontWeight:'500' }}>Qty:</label>
              <select value={qty} onChange={e => setQty(Number(e.target.value))}
                style={{ padding:'6px 10px', border:'1px solid #ddd', borderRadius:'6px', fontSize:'14px' }}>
                {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}
          <button disabled={product.stock === 0} onClick={handleAddToCart}
            style={{ width:'100%', padding:'14px',
              background: added ? '#059669' : product.stock > 0 ? '#4f46e5' : '#ccc',
              color:'#fff', border:'none', borderRadius:'8px', fontSize:'16px',
              cursor: product.stock > 0 ? 'pointer' : 'not-allowed', fontWeight:'500',
              transition:'background 0.2s' }}>
            {added ? '✓ Added to Cart!' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
          {cartItem && (
            <p style={{ textAlign:'center', marginTop:'10px', fontSize:'13px', color:'#4f46e5' }}>
              {cartItem.quantity} already in cart
            </p>
          )}
        </div>
      </div>
    </div>
  );
}