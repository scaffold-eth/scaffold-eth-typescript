import esbuild from 'esbuild';
// Automatically exclude all node_modules from the bundled version
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import path from 'path';

function tsPathResolver(content) {
  const relativePath = path.relative(path.dirname(this.resourcePath), path.resolve(__dirname, '../src'));

  return content.replaceAll(`from "~~/`, `from "${relativePath ? relativePath + '/' : './'}`);
}

esbuild
  .build({
    entryPoints: [
      './src/index.ts',
      './src/models/index.ts',
      './src/constants/index.ts',
      './src/functions/index.ts',
    ],
    outdir: 'lib',
    bundle: true,
    minifyWhitespace: true,
    minifySyntax: true,
    minifyIdentifiers: false,
    platform: 'browser',
    sourcemap: true,
    target: ['node16', 'esnext'],
    splitting: true,
    format: 'esm',
    inject: ['esbuild.shim.js'],
    plugins: [nodeExternalsPlugin()],
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
