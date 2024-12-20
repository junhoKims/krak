import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { defineRollupSwcOption, swc } from 'rollup-plugin-swc3';
import { globSync } from 'glob';
import svgr from '@svgr/rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';

const EXTENSION_ESM = '.mjs';
const EXTENSION_CJS = '.cjs';

/**
 * rollup을 통해 빌드 수행 함수
 *
 * @param {object} options ds
 * @param {string} options.entry 빌드 포함될 경로
 * @param {string | undefined} options.output 번들링이 출력될 디렉토리
 * @param {RegExp[] | undefined} options.exclude 빌드 포함되는 entry 중에서 제외할 경로
 * @param {string} options.packageDir package.json이 있는 디렉토리 경로
 */
export const defineRollupConfig = async ({ entry, output = 'dist', exclude = [], packageDir }) => {
  const packagePath = path.join(packageDir, 'package.json');
  const packageJSON = JSON.parse(await readFile(new URL(packagePath, import.meta.url)));

  const outputCjs = `./${output}/index${EXTENSION_CJS}`;
  const outputEsm = `./${output}/index${EXTENSION_ESM}`;

  /**
   *
   * @param {string} filePath
   * @param {string[]} exclude
   */
  const isFileExcluded = (filePath, exclude) => {
    const EXCLUDED_PATTERNS = [
      /\.stories\.[t|j]sx?$/,
      /\.test\.[t|j]sx?$/,
      /\.spec\.[t|j]sx?$/,
      /__storybook__\/?$/,
      /\.md$/,
      ...exclude,
    ];
    return EXCLUDED_PATTERNS.some((pattern) => pattern.test(filePath));
  };

  /**
   *
   * @param {object} options
   * @param {string} options.input 번들링 입력 경로
   * @param {string} options.output 번들링 출력 경로
   * @param {'es' | 'cjs'} options.format 번들링 포맷
   * @returns {import('rollup').RollupOptions}
   */
  const bundle = (input, output, format) => {
    return {
      input: Object.fromEntries(
        globSync(input).reduce((acc, file) => {
          const excluded = isFileExcluded(path.join(packageDir, file), exclude);

          if (excluded) {
            return acc;
          }

          return [
            ...acc,
            [path.relative('src', file.slice(0, file.length - path.extname(file).length)), `${packageDir}/${file}`],
          ];
        }, [])
      ),
      output: {
        format,
        dir: path.dirname(output),
        entryFileNames: (chunkInfo) => {
          const EXT = chunkInfo.facadeModuleId.split('/').pop()?.split('.')?.pop() || '.js';
          const EXT_BUNDLED = format === 'es' ? EXTENSION_ESM : EXTENSION_CJS;
          const isChunkFile = ['js', 'jsx', 'ts', 'tsx'].includes(EXT);
          return isChunkFile ? `[name]${EXT_BUNDLED}` : `[name]`;
        },
        ...(format === 'es' && { preserveModules: true }),
      },
      external: (source) => {
        const dependencies = Object.keys(packageJSON.dependencies || {});
        const peerDependencies = Object.keys(packageJSON.peerDependencies || {});
        const externals = [...dependencies, ...peerDependencies];

        return externals.some((externalPkg) => {
          return source.startsWith(externalPkg);
        });
      },
      plugins: [
        commonjs(),
        nodeResolve(),
        json(),
        svgr({
          icon: true,
          memo: true,
          svgProps: { role: 'img' },
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
            ],
          },
        }),
        swc(
          defineRollupSwcOption({
            tsconfig: packageDir + '/tsconfig.build.json',
            minify: process.env.NODE_ENV === 'production',
            jsc: {
              target: 'esnext',
              parser: {
                syntax: 'typescript',
                tsx: true,
                decorators: false,
              },
              minify: {
                compress: true,
              },
            },
          })
        ),
      ],
    };
  };

  return [bundle(entry, outputEsm, 'es'), bundle(entry, outputCjs, 'cjs')];
};
