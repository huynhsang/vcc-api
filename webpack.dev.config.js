const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const shell = require('shelljs');
const glob = require('glob');

const sources = glob.sync('./common/*/*.js');

// const entries = ['webpack/hot/poll?1000', './start.js'].concat(sources);
const entries = {
    server: ['webpack/hot/poll?1000', './start.js'],
    sources
};

module.exports = {
    name: 'server',
    entry: entries,
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/',
        filename: '[name].js'
    },
    mode: 'development',
    target: 'node',
    watch: true,
    node: {
        // Need this when working with express, otherwise the build fails
        __dirname: false,   // if you don't put this is, __dirname
        __filename: false   // and __filename return blank or /
    },
    externals: [nodeExternals({
        whitelist: ['webpack/hot/poll?1000']
    })], // Need this to avoid error when working with Express
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    emitWarning: true,
                    failOnError: false,
                    failOnWarning: false
                }
            },
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
        new webpack.DefinePlugin({
            'process.env': {
                TARGET_ENV: JSON.stringify('development'),
                LOG_DIR: JSON.stringify(__dirname + '/logs')
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        {
            apply: (compiler) => {
                compiler.hooks.done.tap('StartServerPlugin', () => {
                    shell.exec('"./node_modules/.bin/nodemon" --inspect build/server.js', function() {});
                    /* shell.exec('pid=$(lsof -i:3000 -t) && kill $pid && false || node build/server/server.js',
                    () => {});*/
                });
            }
        }
    ],
    devtool: '#eval-source-map'
};
