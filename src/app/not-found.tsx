import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div style={{ maxWidth: '28rem', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: 'clamp(2rem, 8vw, 4rem)',
            fontWeight: '300',
            color: '#1e293b',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}
        >
          <span style={{ color: '#c99460', fontWeight: '500' }}>404</span> | Page Not Found
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: '#475569',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}
        >
          We are sorry, but the page you are looking for does not exist or has been moved.
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center'
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              backgroundColor: '#c99460',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '500',
              borderRadius: '0.375rem',
              transition: 'background-color 0.2s',
              minWidth: '140px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#b87940';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#c99460';
            }}
          >
            Return Home
          </Link>
          <Link
            href="/contact"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              backgroundColor: 'white',
              color: '#1e293b',
              textDecoration: 'none',
              fontWeight: '500',
              borderRadius: '0.375rem',
              border: '1px solid #cbd5e1',
              transition: 'background-color 0.2s',
              minWidth: '140px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
