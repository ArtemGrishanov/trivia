const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = env => {
    const { PROJECT_TYPE } = env || { PROJECT_TYPE: 'index' }
    const buildMode = 'development'
    return merge(common(PROJECT_TYPE), {
        mode: buildMode,
        devtool: 'inline-source-map',
        devServer: {
            contentBase: './dist',
        },
    })
}
