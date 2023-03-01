const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');    

module.exports = {
    entry: './src/index.js',
    output: {
        publicPath: '/',
        path: path.join(__dirname, '../dist'),
        filename: 'bundle.[contenthash].js',
        chunkFilename: '[name].[contenthash].bundle.js',
    },
    module: {
        rules: [{
            test: /.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
                plugins: [
                    "@loadable/babel-plugin"
                ],
                presets: [
                    "@babel/preset-env",
                    "@babel/preset-react"
                ]
            }
        }, {
            test: /\.css$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }],
        }, {
            test: [/\.woff?$/, /\.woff2?$/, /\.otf?$/, /\.ttf?$/, /\.eot?$/, /\.svg?$/, /\.png?$/, /\.gif?$/],
            loader: 'url-loader'
        }, {
            test: /\.ejs$/,
            loader: 'ejs-loader',
            options: { variable: 'data' }
        }]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new LoadablePlugin(),
        new CopyWebpackPlugin({ patterns: [ { from: './static/' } ]}),
        new HtmlWebpackPlugin({ title: 
            'Преброителен център',
            template: 'src/index.ejs',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'API_HOST': JSON.stringify(process.env.API_HOST),
                'FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
                'FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
                'FIREBASE_DATABASE_URL': JSON.stringify(process.env.FIREBASE_DATABASE_URL),
                'FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
            },
        }),
    ],
};
