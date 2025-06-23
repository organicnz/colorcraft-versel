import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      fontFamily: 'sans-serif',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.1rem', color: '#666' }}>Sorry, the page you are looking for does not exist.</p>
      <Link href="/" style={{
        color: 'blue',
        textDecoration: 'underline',
        padding: '0.5rem 1rem',
        border: '1px solid blue',
        borderRadius: '5px'
      }}>
        Return to Homepage
      </Link>
    </div>
  );
}
