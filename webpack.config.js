/**
 * Copyright (c) 2016 - 2017
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this 
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
 * to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies 
 * or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const pkg = require(path.resolve(process.cwd(), 'package.json'));

const babelQuery = {
    presets: ['babel-preset-es2015', 'babel-preset-react'],
    plugins: [
        'transform-class-properties',
        ["transform-react-jsx", { "pragma": "h" }]
    ]
};

module.exports = {
    entry: path.join(process.cwd(), './src/index.js'),
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        publicPath: '/'
    },
    // Don't use hashes in dev mode for better performance
    output: {
        path: './dist',
        filename: 'main.js'
    },
    plugins: [],
    module: {
        preLoaders: [],
        loaders: [
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/, query: babelQuery },
            { test: /\.css$/, exclude: /node_modules/, loaders: ['raw-loader'] }
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['', '.js', '.jsx']
    },
    target: 'web',
    progress: true,
    debug: false
};