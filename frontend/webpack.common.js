const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    plugins: [
        new HtmlWebpackPlugin(
            {
                favicon: "src/assets/favicon.png",
                template: 'src/assets/index.html',
            }
        ),
        // new CopyPlugin({
        //     patterns: [
        //     //     {
        //     //     from: 'src/icons'
        //     // },
        //             // {
        //         // from: 'assets/'
        //     // }
        //     ],
        // }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: require.resolve('@svgr/webpack'),
                        options: {
                            ext: "tsx",
                            typescript: true,
                        },
                    },
                ],
                issuer: {
                    and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
                },
            },
            // new CopyPlugin({
            //     patterns: [
            //         {from: "src/abi/", to: "abi/"},
            //     ]
            // }),
            {
                test: /\.(png|jpg|jpeg|gif|ico)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader'
            }

        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            fs: false,
            // eslint-disable-next-line node/no-extraneous-require
            'stream': require.resolve('stream-browserify'),
            // eslint-disable-next-line node/no-extraneous-require
            // 'buffer': require.resolve('buffer/'),
            // eslint-disable-next-line node/no-extraneous-require
            // 'util': require.resolve('util/'),
            // 'assert': require.resolve('assert/'),
        },
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
};
