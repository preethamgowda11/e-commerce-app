import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const statusColor = { pending:'#f59e0b', processing:'#3b82f6', shipped:'#8b5cf6', delivered:'#10b981' };
const statusBg    = { pending:'#fef3c7', processing:'#dbeafe', shipped:'#ede9fe', delivered:'#d1fae5' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign:'center', padding:'60px', color:'#666' }}>Loading orders...</div>;

  if (orders.length === 0) return (
    <div style={{ maxWidth:'600px', margin:'80px auto', textAlign:'center', padding:'0 16px' }}>
      <div style={{ fontSize:'64px', marginBottom:'16px' }}>📦</div>
      <h2 style={{ marginBottom:'8px' }}>No orders yet</h2>
      <p style={{ color:'#666', marginBottom:'24px' }}>Your orders will appear here</p>
      <Link to="/" style={{ background:'#4f46e5', color:'#fff', padding:'12px 28px',
        borderRadius:'8px', textDecoration:'none', fontWeight:'500' }}>
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div style={{ maxWidth:'800px', margin:'32px auto', padding:'0 16px' }}>
      <h1 style={{ marginBottom:'24px' }}>My Orders</h1>
      <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
        {orders.map(order => (
          <div key={order._id} style={{ background:'#fff', borderRadius:'12px', padding:'20px',
            boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <div>
                <p style={{ fontWeight:'600', marginBottom:'2px' }}>
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p style={{ fontSize:'13px', color:'#888' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                </p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'13px', fontWeight:'500',
                  color: statusColor[order.status], background: statusBg[order.status] }}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span style={{ fontWeight:'700', color:'#4f46e5', fontSize:'16px' }}>
                  ₹{order.total.toLocaleString()}
                </span>
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px',
                  background:'#f9f9f9', borderRadius:'8px', padding:'8px 12px' }}>
                  <img src={item.image || 'https://placehold.co/36x36?text=?'} alt={item.name}
                    style={{ width:'36px', height:'36px', objectFit:'cover', borderRadius:'6px' }} />
                  <div>
                    <p style={{ fontSize:'13px', fontWeight:'500', marginBottom:'1px' }}>{item.name}</p>
                    <p style={{ fontSize:'12px', color:'#888' }}>Qty: {item.quantity} · ₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            {order.address?.street && (
              <p style={{ marginTop:'12px', fontSize:'13px', color:'#666' }}>
                📍 {order.address.street}, {order.address.city}, {order.address.country}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}