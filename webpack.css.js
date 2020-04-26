const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

/**
 * CSS extracting module, it's used to extract all css files into one.
 * Also it generates extra JS file witch should be erased and replaced with another one from webpack.common.js.
 * The reason is that we want to have both inline-css in <style> tag inside of our static html file - it's done by using 'style-loader'.
 * And all css files in one separate file - it's done by using 'MiniCssExtractPlugin'.
 * The thing is that they can not be stored inside one module together.
 * That's why build task should be look like this -> webpack --config webpack.css.js && webpack --env.PROJECT_TYPE={ project name } --config webpack.dev.js
 * @type {{mode: string, optimization: {minimizer: [*, *]}, plugins: [MiniCssExtractPlugin], module: {rules: [{test: RegExp, use: {loader: string}, exclude: RegExp}, {test: RegExp, use: [string, string]}]}}}
 */
module.exports = {
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    plugins: [new MiniCssExtractPlugin({ filename: `main.css` })],
    mode: 'development',
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
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
}