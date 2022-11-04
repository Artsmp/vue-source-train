const { resolve } = require('path');
const { build } = require('esbuild');
// 解析命令行参数
const args = require('minimist')(process.argv.slice(2));
console.log('args: ', args);

const target = args['_'][0] || 'reactivity';
const format = args['f'] || 'global';
// 获取到对应包的 package.json
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));
// 获取打包输出的格式
const outputFormat = format.startsWith('global')
  ? 'iife'
  : format === 'cjs'
  ? 'cjs'
  : 'esm';

// 打包后文件输出路径
const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`
);
build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true,
  sourcemap: true,
  format: outputFormat,
  globalName: pkg.buildOptions?.name,
  platform: format === 'cjs' ? 'node' : 'browser',
  watch: {
    // 监控文件变化
    onRebuild(error) {
      if (!error) console.log(`rebuilt~~~~`);
    },
  },
}).then(() => {
  console.log('watching~~~');
});
