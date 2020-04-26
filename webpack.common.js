const HtmlWebPackPlugin = require('html-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = projectType => ({
    entry: {
        main: `./src/${projectType}.js`,
    },
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({}),
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html',
            inject: false,
        }),
    ],
})
