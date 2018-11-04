const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const TsConfigPlugin = require("./tsconfig-webpack-plugin");
const SourceMapFixPlugin = require("./source-map-fix-webpack-plugin");

module.exports = function (env, { mode }) {

	const production = (mode === 'production');

	const cssLoader = [
		MiniCssExtractPlugin.loader,
		{
			loader: 'css-loader',
			options: {
				url: false,
				modules: true,
				importLoaders: 2,
				...(production ? {} : { sourceMap: true })
			}
		},
		{
			loader: 'postcss-loader',
			options: {
				...(production ? {} : { sourceMap: true })
			}
		},
		{
			loader: 'sass-loader',
			options: {
				includePaths: [
					path.resolve(__dirname, "src/styles")
				],
				...(production ? {} : { sourceMap: true })
			}
		}
	];

	return {
		entry: {
			index: ["./src/index.tsx"],
		},
		output: {
			path: path.resolve(__dirname, "docs"),
			filename: "[name].js"
		},
		module: {
			rules: [
				{
					test: /(?<!\.jsx)\.pug$/,
					loader: "pug-loader"
				},
				{
					test: /\.jsx\.pug$/,
					use: require.resolve("./jsx-pug-loader")
				},
				{
					test: /\.tsx?$/,
					loader: "ts-loader",
					options: {
						compilerOptions: (production ? {} : { sourceMap: true })
					}
				},
				{
					test: /\.scss$/,
					loader: cssLoader
				},
				{
					test: /(?<!\.(?:html|css|js))$/,
					include: [path.resolve(__dirname, "docs")],
					type: 'javascript/auto',
					loader: "file-loader",
					options: {
						name: "[path][name].[ext]",
						outputPath: url => path.relative("docs", url),
						emitFile: false
					}
				}
			]
		},
		resolve: {
			extensions: [".tsx", ".ts", ".js", ".json"],
			alias: {
				"assets": path.resolve(__dirname, "docs")
			},
			plugins: [
				new TsConfigPlugin()
			]
		},
		resolveLoader: {
			plugins: [
				new SourceMapFixPlugin()
			]
		},
		devServer: {
			contentBase: "docs"
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: "[name].css"
			}),
			new HtmlWebpackPlugin({
				template: "./src/index.pug",
				templateParameters: { process: { env: { NODE_ENV: mode } } },
				inject: 'head'
			}),
			new ScriptExtHtmlWebpackPlugin({
				defaultAttribute: 'async'
			}),
			...(production ? [] : [new StylelintPlugin({ files: "src/**/*.scss" })])
		]
	}
}