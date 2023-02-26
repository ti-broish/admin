const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = env => {
    console.log(env);
    return merge(baseConfig, {
        mode: 'production',
        plugins: [
            new webpack.LoaderOptionsPlugin({minimize: true}),
        ]
    });
};
