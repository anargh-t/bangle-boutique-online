import express from 'express';
import path from 'path';
import helmet from 'helmet';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const distPath = path.join(__dirname, 'dist');

// Hide tech stack
app.disable('x-powered-by');

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "img-src": ["'self'", "data:", "blob:"],
        "connect-src": ["'self'"],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "frame-ancestors": ["'self'"],
        "frame-src": ["'self'", "https://www.instagram.com"]
      }
    },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'no-referrer' },
    xContentTypeOptions: true,
    xDnsPrefetchControl: { allow: false },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: false },
    noSniff: true,
    frameguard: { action: 'sameorigin' }
  })
);

// Serve static files from the dist directory
app.use(
  express.static(distPath, {
    etag: true,
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  })
);

// Health check
app.get('/health', (_req, res) => res.type('text/plain').send('ok'));

// SPA fallback: handle all routes by serving index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

