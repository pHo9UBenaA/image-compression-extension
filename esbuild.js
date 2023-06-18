const srcDirName = 'src';
const distDirName = 'dist';

// esbuildオプションのentryPointsとoutdirを作成
const path = require('path');
const glob = require('glob');

const srcDir = path.join(__dirname, srcDirName);
const distDir = path.join(__dirname, distDirName);

const entryPoints = glob.sync(`${srcDir}/**/*.ts`);
const outdir = distDir;

// envプラグインの定義
// const dotenv = require('dotenv');
// const env = dotenv.config().parsed;
// const envPlugin = {
// 	name: 'env',
// 	setup(build) {
// 		build.onResolve({ filter: /^env$/ }, (args) => ({
// 			path: args.path,
// 			namespace: 'env-ns',
// 		}));
// 		build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
// 			contents: JSON.stringify(env),
// 			loader: 'json',
// 		}));
// 	},
// };

// copyプラグイン
const copyStaticFiles = require('esbuild-copy-static-files');

const gmailReceiveMailDir = 'gmail-receive-mail';
const copyGmailReceiveMailStaticFilesPlugin = copyStaticFiles({
	src: `./${srcDirName}/${gmailReceiveMailDir}/assets`,
	dest: `./${distDirName}/${gmailReceiveMailDir}`,
	dereference: true,
	errorOnExist: false,
});

const primeVideoHistoryDir = 'prime-video-history';
const copyPrimeVideoHistoryStaticFilesPlugin = copyStaticFiles({
	src: `./${srcDirName}/${primeVideoHistoryDir}/assets`,
	dest: `./${distDirName}/${primeVideoHistoryDir}`,
	dereference: true,
	errorOnExist: false,
});

// ビルド
const options = {
	entryPoints,
	outdir,
	outbase: `./${srcDirName}`,
	platform: 'browser',
	external: [],
	bundle: true,
	tsconfig: './tsconfig.json',
	plugins: [
		envPlugin,
		copyGmailReceiveMailStaticFilesPlugin,
		copyPrimeVideoHistoryStaticFilesPlugin,
	],
};

const { build } = require('esbuild');
build(options).catch((err) => {
	process.stderr.write(err.stderr);
	process.exit(1);
});
