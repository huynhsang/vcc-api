const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        server: './start.js'
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/',
        filename: 'server.js'
    },
    mode: 'production',
    target: 'node',
    node: {
        // Need this when working with express, otherwise the build fails
        __dirname: false,   // if you don't put this is, __dirname
        __filename: false   // and __filename return blank or /
    },
    externals: [nodeExternals()], // Need this to avoid error when working with Express
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            })
        ]
    },
    module: {
        rules: [
            {
                // Transpiles ES6-8 into ES5
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin()
    ],
    devtool: 'source-map'
};
