const path = require('path');
const webpack = require('webpack');
const outputFileName = 'bundle';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
    entry: [
        path.resolve(__dirname, './client/index.ts'),
        path.resolve(__dirname, './main.scss')
    ],

    output: {
        // output to './dist' folder
        path: path.resolve(__dirname, './dist'),

        // with filename
        filename: outputFileName + '.js',

        // mark /dist/ folder as a public path so index.html can reach it
        publicPath: '/dist/'
    },

    // webpack-dev-server config, see: https://webpack.github.io/docs/webpack-dev-server.html
    devServer: {
        contentBase: './',
        hot: true,
        inline: true,
        port: 8080,
        historyApiFallback: true
    },

    // http://webpack.github.io/docs/configuration.html#devtool
    devtool: '#eval-source-map',

    resolve: {
        extensions: ['.ts', '.js', '.jade'],
        alias: {
            'vue$': 'vue/dist/vue.js',
            'vue-router': 'vue-router/dist/vue-router.common.js'
        }
    },

    module: {
        loaders: [
            { test: /\.css$/, loader: 'css-loader' },
            { test: /\.html$/, loader: 'html' },
            { test: /\.vue$/, loader: 'vue-loader'},
            { test: /\.jade$/, loader: 'jade-loader' },
            {
                test: /\.ts?$/,
                include: /client/,
                exclude: [/node_modules/, /vendor/],
                loader: "ts-loader"
            },
            {
                test: /\.(sass|scss)$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            }
        ]
    },

    plugins: [
        // HMR issue, see: https://github.com/webpack/webpack/issues/1151
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        //new BundleAnalyzerPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: 'styles.css',
            allChunks: true
        }),
        new webpack.DefinePlugin({
            'LIONFORCE_HOST': '',
        }),

        new webpack.optimize.UglifyJsPlugin(), //minify everything
        new webpack.optimize.AggressiveMergingPlugin()//Merge chunks
    ]
};

module.exports = config;