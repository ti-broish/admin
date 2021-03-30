const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = env => {
    return merge(baseConfig, {
        mode: 'development',
        devServer: {
            publicPath: '/',
            contentBase: [path.join(__dirname, '../dist')],
            historyApiFallback: true,
            port: 3000,
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('development'),
                    'API_HOST': JSON.stringify(env['API_HOST']),
                    'FIREBASE_API_KEY': JSON.stringify(env['FIREBASE_API_KEY']),
                    'FIREBASE_AUTH_DOMAIN': JSON.stringify(env['FIREBASE_AUTH_DOMAIN']),
                    'FIREBASE_DATABASE_URL': JSON.stringify(env['FIREBASE_DATABASE_URL']),
                    'FIREBASE_PROJECT_ID': JSON.stringify(env['FIREBASE_PROJECT_ID']),
                }
            }),
        ]
    });
};