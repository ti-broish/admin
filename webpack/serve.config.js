const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
    mode: 'development',
    devServer: {
        publicPath: '/',
        contentBase: [path.join(__dirname, '../dist')],
        historyApiFallback: true,
        port: 3000,
    },
});