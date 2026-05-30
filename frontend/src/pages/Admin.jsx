import { useEffect, useState } from 'react';
import api from '../api';

const empty = { name:'', description:'', price:'', image:'', category:'', stock:'' };

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/products').then(r => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editing) {
        await api.put(`/products/${editing}`, payload);
        setEditing(null);
      } else {
        await api.post('/products', payload);
      }
      setForm(empty);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving product');
    } finally { setLoading(false); }
  };

  const handleEdit = (p) => {
    setEditing(p._id);
    setForm({ name:p.name, description:p.description||'', price:p.price,
      image:p.image||'', category:p.category||'', stock:p.stock });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  const fields = [
    { key:'name',        label:'Product Name', type:'text' },
    { key:'price',       label:'Price (₹)',    type:'number' },
    { key:'stock',       label:'Stock',        type:'number' },
    { key:'category',    label:'Category',     type:'text' },
    { key:'image',       label:'Image URL',    type:'text' },
    { key:'description', label:'Description',  type:'text' },
  ];

  return (
    <div style={{ maxWidth:'900px', margin:'32px auto', padding:'0 16px' }}>
      <h1 style={{ marginBottom:'4px' }}>Admin Panel</h1>
      <p style={{ color:'#666', marginBottom:'32px' }}>Manage your product catalog</p>

      <div style={{ background:'#fff', borderRadius:'12px', padding:'28px',
        boxShadow:'0 1px 6px rgba(0,0,0,0.08)', marginBottom:'32px' }}>
        <h2 style={{ marginBottom:'20px', fontSize:'18px' }}>
          {editing ? 'Edit Product' : 'Add New Product'}
        </h2>
        {error && (
          <div style={{ background:'#fee2e2', color:'#b91c1c', padding:'10px',
            borderRadius:'6px', marginBottom:'16px' }}>{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ display:'block', marginBottom:'4px',
                  fontSize:'13px', fontWeight:'500' }}>{f.label}</label>
                <input type={f.type} value={form[f.key]}
                  required={['name','price','stock'].includes(f.key)}
                  onChange={e => setForm({...form, [f.key]: e.target.value})}
                  style={{ width:'100%', padding:'8px 10px', border:'1px solid #ddd',
                    borderRadius:'6px', fontSize:'14px' }} />
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
            <button type="submit" disabled={loading}
              style={{ padding:'10px 24px', background:'#4f46e5', color:'#fff',
                border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'500' }}>
              {loading ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm(empty); }}
                style={{ padding:'10px 24px', background:'#f3f4f6',
                  border:'1px solid #ddd', borderRadius:'6px', cursor:'pointer' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 style={{ marginBottom:'16px', fontSize:'18px' }}>
        All Products ({products.length})
      </h2>
      {products.length === 0 ? (
        <div style={{ textAlign:'center', padding:'40px', color:'#999',
          background:'#fff', borderRadius:'12px' }}>
          No products yet. Add one above.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {products.map(p => (
            <div key={p._id} style={{ background:'#fff', borderRadius:'10px',
              padding:'16px 20px', display:'flex', alignItems:'center', gap:'16px',
              boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <img
                src={p.image || 'https://placehold.co/56x56?text=?'}
                alt={p.name}
                style={{ width:'56px', height:'56px', objectFit:'cover', borderRadius:'8px' }} />
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:'600', marginBottom:'2px' }}>{p.name}</p>
                <p style={{ fontSize:'13px', color:'#888' }}>{p.category} · Stock: {p.stock}</p>
              </div>
              <span style={{ fontWeight:'700', color:'#4f46e5', marginRight:'16px' }}>
                ₹{p.price}
              </span>
              <button onClick={() => handleEdit(p)}
                style={{ padding:'6px 14px', background:'#f0f0ff', color:'#4f46e5',
                  border:'1px solid #c7d2fe', borderRadius:'6px', cursor:'pointer', marginRight:'8px' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(p._id)}
                style={{ padding:'6px 14px', background:'#fff0f0', color:'#dc2626',
                  border:'1px solid #fecaca', borderRadius:'6px', cursor:'pointer' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}