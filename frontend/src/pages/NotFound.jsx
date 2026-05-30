import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 16px' }}>
      <div style={{ fontSize:'80px', marginBottom:'16px' }}>404</div>
      <h1 style={{ marginBottom:'8px', fontSize:'28px' }}>Page Not Found</h1>
      <p style={{ color:'#666', marginBottom:'28px' }}>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ background:'#4f46e5', color:'#fff', padding:'12px 28px',
        borderRadius:'8px', textDecoration:'none', fontWeight:'500' }}>
        Go Home
      </Link>
    </div>
  );
}