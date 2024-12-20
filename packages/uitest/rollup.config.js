import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { defineRollupConfig } from '@krak/rollup-config';

export default defineRollupConfig({
  entry: 'src/**/*.{js,jsx,ts,tsx,css}',
  exclude: [/\/types\.ts$/],
  packageDir: dirname(fileURLToPath(import.meta.url)),
});
