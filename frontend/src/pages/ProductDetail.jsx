import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ textAlign:'center', padding:'60px' }}>Loading...</div>
  );
  if (!product) return null;

  return (
    <div style={{ maxWidth:'800px', margin:'40px auto', padding:'0 16px' }}>
      <button onClick={() => navigate(-1)}
        style={{ background:'none', border:'1px solid #ddd', padding:'8px 16px',
          borderRadius:'6px', cursor:'pointer', marginBottom:'24px' }}>
        ← Back
      </button>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'40px',
        background:'#fff', borderRadius:'12px', padding:'32px',
        boxShadow:'0 1px 6px rgba(0,0,0,0.08)' }}>
        <img
          src={product.image || 'https://placehold.co/360x300?text=No+Image'}
          alt={product.name}
          style={{ width:'100%', borderRadius:'8px', objectFit:'cover' }} />
        <div>
          <h1 style={{ fontSize:'24px', marginBottom:'8px' }}>{product.name}</h1>
          {product.category && (
            <p style={{ color:'#888', marginBottom:'16px' }}>{product.category}</p>
          )}
          <p style={{ fontSize:'28px', fontWeight:'700', color:'#4f46e5', marginBottom:'16px' }}>
            ₹{product.price}
          </p>
          <p style={{ color:'#444', lineHeight:'1.6', marginBottom:'24px' }}>
            {product.description || 'No description available.'}
          </p>
          <p style={{ color: product.stock > 0 ? '#059669' : '#dc2626',
            fontWeight:'500', marginBottom:'24px' }}>
            {product.stock > 0 ? `✓ In stock (${product.stock} available)` : '✗ Out of stock'}
          </p>
          <button disabled={product.stock === 0}
            style={{ width:'100%', padding:'14px',
              background: product.stock > 0 ? '#4f46e5' : '#ccc',
              color:'#fff', border:'none', borderRadius:'8px', fontSize:'16px',
              cursor: product.stock > 0 ? 'pointer' : 'not-allowed', fontWeight:'500' }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}