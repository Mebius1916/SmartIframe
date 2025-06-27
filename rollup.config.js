import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';

const production = !process.env.ROLLUP_WATCH;

export default [
  // UMD构建 - 浏览器全局变量版本
  {
    input: 'src/index.js',
    output: {
      file: 'dist/smart-iframe.js',
      format: 'umd',
      name: 'SmartIframe',
      sourcemap: true
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: ['> 1%', 'last 2 versions', 'not ie <= 10']
            }
          }]
        ]
      })
    ]
  },

  // UMD压缩版本
  {
    input: 'src/index.js',
    output: {
      file: 'dist/smart-iframe.min.js',
      format: 'umd',
      name: 'SmartIframe',
      sourcemap: true
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: ['> 1%', 'last 2 versions', 'not ie <= 10']
            }
          }]
        ]
      }),
      terser({
        format: {
          comments: false
        },
        compress: {
          drop_console: production
        }
      })
    ]
  },

  // ES模块版本
  {
    input: 'src/index.js',
    output: {
      file: 'dist/smart-iframe.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: ['> 1%', 'last 2 versions', 'not ie <= 10']
            },
            modules: false
          }]
        ]
      })
    ]
  },

  // CommonJS版本
  {
    input: 'src/index.js',
    output: {
      file: 'dist/smart-iframe.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              node: '14'
            }
          }]
        ]
      })
    ]
  }
]; 