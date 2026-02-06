/**
 * ESBuild configuration for Cloudflare Workers
 * Handles bundling of worker.ts for deployment
 */

import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProduction = process.env.NODE_ENV === 'production';

const buildConfig = {
  entryPoints: [path.join(__dirname, 'worker.ts')],
  bundle: true,
  minify: isProduction,
  sourcemap: !isProduction,
  target: 'ES2022',
  platform: 'neutral',
  format: 'esm',
  outfile: path.join(__dirname, 'dist', 'worker.js'),
  external: ['__STATIC_CONTENT_MANIFEST'],
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`,
  },
};

export default buildConfig;
