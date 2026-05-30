import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ textAlign:'center', padding:'60px', color:'#666' }}>Loading products...</div>;

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'32px 16px' }}>
      <h1 style={{ marginBottom:'8px' }}>Products</h1>
      <input placeholder="Search products..." value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width:'100%', padding:'10px 14px', border:'1px solid #ddd', borderRadius:'8px',
          fontSize:'14px', marginBottom:'28px', boxSizing:'border-box' }} />

      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px', color:'#999' }}>No products found.</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'20px' }}>
          {filtered.map(p => (
            <Link to={`/product/${p._id}`} key={p._id} style={{ textDecoration:'none', color:'inherit' }}>
              <div style={{ background:'#fff', borderRadius:'12px', overflow:'hidden',
                boxShadow:'0 1px 6px rgba(0,0,0,0.08)', transition:'transform 0.2s',
                border:'1px solid #f0f0f0' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                <img src={p.image || 'https://via.placeholder.com/240x180?text=No+Image'}
                  alt={p.name} style={{ width:'100%', height:'180px', objectFit:'cover' }} />
                <div style={{ padding:'14px' }}>
                  <p style={{ margin:'0 0 4px', fontWeight:'600', fontSize:'15px' }}>{p.name}</p>
                  {p.category && <p style={{ margin:'0 0 8px', fontSize:'12px', color:'#888' }}>{p.category}</p>}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontWeight:'700', fontSize:'16px', color:'#4f46e5' }}>₹{p.price}</span>
                    <span style={{ fontSize:'12px', color: p.stock > 0 ? '#059669' : '#dc2626' }}>
                      {p.stock > 0 ? `${p.stock} left` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
