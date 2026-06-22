import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    {
      name: 'ignore-well-known',
      configureServer(server) {
        server.middlewares.use('/.well-known', (req, res) => {
          res.statusCode = 204;
          res.setHeader('Content-Length', '0');
          res.end();
        });
      },
    },
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
