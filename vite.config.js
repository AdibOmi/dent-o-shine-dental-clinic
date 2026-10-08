import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Link-preview tags need the site's absolute address. When a custom domain is added,
// set SITE_URL (e.g. https://dentoshine.com) under the Pages project's build variables.
const siteUrl = (process.env.SITE_URL || 'https://dent-o-shine.pages.dev').replace(/\/$/, '');

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'site-url',
      transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
      // Same "/admin" address in dev as on Cloudflare Pages
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin.html';
          next();
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: { main: 'index.html', admin: 'admin.html' },
    },
  },
});
