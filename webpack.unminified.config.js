const { resolve } = require( 'path' )
const HtmlWebPackPlugin = require( 'html-webpack-plugin' )
const UglifyJSPlugin = require( 'uglifyjs-webpack-plugin' )
const externals = {
	jquery: 'jQuery',
	lodash: 'lodash',
	'@wordpress/autop': 'wp.autop',
	'@wordpress/wordcount': 'wp.wordcount',
	'@wordpress/hooks': 'wp.hooks',
}
const alias = {
	'@root': resolve( __dirname, './src' ),
	'@analysis': resolve( __dirname, './src/analysis' ),
	'@config': resolve( __dirname, './src/config' ),
	'@helpers': resolve( __dirname, './src/helpers' ),
	'@researches': resolve( __dirname, './src/researches' ),
}
// Adding our UglifyJS plugin
const uglifyjs = new UglifyJSPlugin(
	{
		uglifyOptions: {
			mangle: true,
			compress: {
				pure_getters: true,
				unsafe: true,
				unsafe_comps: true,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				if_return: true,
				join_vars: true,
			},
			output: {
				beautify: false,
				comments: false,
			},
		},
	}
)
const htmlwebpack = new HtmlWebPackPlugin(
	{
		inject: false,
		template: resolve( __dirname, './public/index.html' ),
		filename: resolve( __dirname, './dist/index.html' ),
	}
)
module.exports = function( env ) {
	const mode = ( env && env.environment ) || process.env.NODE_ENV || 'production'
	return {
		devtool: mode === 'development' ? 'cheap-module-eval-source-map' : false,
		entry: { analyzer: './src/library.js' },
		output: {
			path: resolve( __dirname, './dist' ),
			filename: '[name].js',
		},
		devServer: {
			contentBase: './dist',
			port: 3000,
		},
		resolve: {
			alias,
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
						presets: [ '@babel/preset-env' ],
					},
				},
				{
					test: /\.html$/,
					exclude: /(node_modules|bower_components)/,
					use: [
						{
							loader: 'html-loader',
							options: { minimize: true },
						},
					],
				},
			],
		},
		externals,
		optimization: {
			minimize: true,
			minimizer: [
				new UglifyJSPlugin( {
					uglifyOptions: {
						output: {
							comments: false,
							beautify: true,
						},
						mangle: false,
						compress: false,
					}
				} )
			]
		},
		plugins: [ htmlwebpack ],
	}
}