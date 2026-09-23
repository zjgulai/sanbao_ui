export default {
  entry: { main: 'src/main.tsx' },
  outDir: 'dist', format: 'esm', platform: 'browser', target: 'es2022',
  dts: false, sourcemap: true, clean: true,
  external: [], noExternal: [/.*/],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  outputOptions: { entryFileNames: 'main.js' },
};
