const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = env => {
    const { PROJECT_TYPE } = env || { PROJECT_TYPE: 'index' }
    return merge(common(PROJECT_TYPE), {
        devtool: false,
        mode: 'none',
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
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
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production'),
                'process.env.PROJECT_TYPE': JSON.stringify(PROJECT_TYPE === 'index' ? 'trivia' : PROJECT_TYPE),
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
        ],
    })
}
