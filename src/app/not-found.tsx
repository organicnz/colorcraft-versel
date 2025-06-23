export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found | ColorCraft</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 1rem;
            }
            .container {
              text-align: center;
              max-width: 28rem;
            }
            .title {
              font-size: clamp(2rem, 8vw, 4rem);
              font-weight: 300;
              color: #1e293b;
              margin-bottom: 1.5rem;
              line-height: 1.2;
            }
            .brand {
              color: #c99460;
              font-weight: 500;
            }
            .description {
              font-size: 1.125rem;
              color: #475569;
              margin-bottom: 2rem;
              line-height: 1.6;
            }
            .buttons {
              display: flex;
              flex-direction: column;
              gap: 1rem;
              align-items: center;
            }
            .btn {
              display: inline-block;
              padding: 0.75rem 2rem;
              text-decoration: none;
              font-weight: 500;
              border-radius: 0.375rem;
              transition: background-color 0.2s;
              min-width: 140px;
              text-align: center;
            }
            .btn-primary {
              background-color: #c99460;
              color: white;
            }
            .btn-primary:hover {
              background-color: #b87940;
            }
            .btn-secondary {
              background-color: white;
              color: #1e293b;
              border: 1px solid #cbd5e1;
            }
            .btn-secondary:hover {
              background-color: #f1f5f9;
            }
          `
        }} />
      </head>
      <body>
        <div className="container">
          <h1 className="title">
            <span className="brand">404</span> | Page Not Found
          </h1>
          <p className="description">
            We are sorry, but the page you are looking for does not exist or has been moved.
          </p>
          <div className="buttons">
            <a href="/" className="btn btn-primary">
              Return Home
            </a>
            <a href="/contact" className="btn btn-secondary">
              Contact Us
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
