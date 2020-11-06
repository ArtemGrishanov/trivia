const path = require('path')
const fs = require('fs')

const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const PROJECTS_PATH = path.resolve(__dirname, './src/projects')

const getProjectEntries = () => {
    const dir = fs.readdirSync(PROJECTS_PATH)

    return Object.fromEntries(
        dir
            .filter(entry => path.extname(entry) === '.js')
            .map(entry => {
                const ext = path.extname(entry)

                return [entry.replace(ext, ''), `${PROJECTS_PATH}/${entry}`]
            }),
    )
}

module.exports = {
    mode: 'production',
    entry: getProjectEntries(),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|json|node)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['@babel/plugin-proposal-optional-chaining'],
                        },
                    },
                    // {
                    //     loader: 'js-conditional-compile-loader',
                    //     options: {
                    //         isRankBattle: projectType === 'rank-battle',
                    //         isBeforeAfter: projectType === 'before-after',
                    //         isMemory: projectType === 'memory',
                    //         useUserDataForm: projectType !== 'rank-battle' && projectType !== 'before-after',
                    //         useTextOption:
                    //             projectType !== 'rank-battle' &&
                    //             projectType !== 'before-after' &&
                    //             projectType !== 'photostory' &&
                    //             projectType !== 'quotes' &&
                    //             projectType !== 'memory',
                    //         useProgress: projectType !== 'rank-battle' && projectType !== 'before-after',
                    //         useCollage: projectType === 'photostory' || projectType === 'quotes',
                    //     },
                    // },
                ],
            },
            {
                test: /\.css$/i,
                sideEffects: true,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
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
    optimization: {
        minimizer: [
            new TerserJSPlugin({
                extractComments: false,
                terserOptions: {
                    ecma: 5,
                    warnings: false,
                    parse: {},
                    compress: {},
                    mangle: {
                        eval: false,
                    },
                    module: false,
                    toplevel: false,
                    nameCache: null,
                    keep_classnames: true,
                    keep_fnames: true,
                    safari10: true,
                },
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
        splitChunks: {
            // include all types of chunks
            chunks: 'all',
            name: 'remix',
            cacheGroups: {
                styles: {
                    name: 'remix',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
        concatenateModules: true,
        noEmitOnErrors: true,
    },
    plugins: [
        new MiniCssExtractPlugin({
            ignoreOrder: true,
        }),
        new HtmlWebPackPlugin({
            template: './src/projects/index.html',
            filename: './index.html',
            inject: false,
        }),
    ],
}
