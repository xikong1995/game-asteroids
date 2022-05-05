const { merge } = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.common');

module.exports = merge(baseConfig, {
    mode: 'production',
    output: {
        filename: '[name].[contenthash:8].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: './',
    },
});
