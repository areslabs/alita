/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './index.web.js',

    output: {
        path: path.resolve(__dirname, 'web-dist'),
        filename: 'bundle.js'
    },

    mode: 'development',

    resolve: {
        alias: {
            'react-native': 'react-native-web',
        },
        mainFields: ['browser', 'client', 'module', 'main'],
        extensions: ['.web.js', '.web.jsx', '.js', '.jsx', '.web.ts', '.web.tsx', '.ts', '.tsx', '.json']
    },

    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },

            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve('public', 'index.html'),
        })
    ],

    devServer: {
        port: 9000
    }

}