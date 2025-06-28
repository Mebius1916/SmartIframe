import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';

const production = !process.env.ROLLUP_WATCH;

export default [
  // ES模块版本 - 现代浏览器
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
            targets: { browsers: ['> 1%', 'last 2 versions'] },
            modules: false
          }]
        ]
      })
    ]
  },

  // UMD版本 - 兼容性
  {
    input: 'src/index.js',
    output: {
      file: production ? 'dist/smart-iframe.min.js' : 'dist/smart-iframe.js',
      format: 'umd',
      name: 'SmartIframe',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: { browsers: ['> 1%', 'last 2 versions'] }
          }]
        ]
      }),
      ...(production ? [
        terser({
          format: { comments: false },
          compress: { drop_console: true }
        })
      ] : [])
    ]
  }
]; 