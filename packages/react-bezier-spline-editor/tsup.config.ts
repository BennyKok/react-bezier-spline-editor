import { defineConfig } from 'tsup';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

export default defineConfig({
  // esbuildPlugins: [polyfillNode()],
  esbuildOptions(options, context) {
    // options.define.foo = '"bar"'
  },
  entry: {
    // index: './src/index.ts',
    'react/index': './src/react/index.ts',
    'core/index': './src/core/index.ts',
  },
  treeshake: true,
  sourcemap: true,
  minify: true,
  clean: true,
  shims: true,
  dts: true,
  platform: 'browser',
  splitting: true,
  // globalName: 'Avatars',
  format: ['cjs', 'iife', 'esm'],
  external: ['react', 'next'],
});
