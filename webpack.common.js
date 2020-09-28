const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = projectType => ({
    entry: {
        main: `./src/${projectType}.js`,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|json|node)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    {
                        loader: 'js-conditional-compile-loader',
                        options: {
                            isRankBattle: projectType === 'rank-battle',
                            isBeforeAfter: projectType === 'before-after',
                            isMemory: projectType === 'memory',
                            useUserDataForm: projectType !== 'rank-battle' && projectType !== 'before-after',
                            useTextOption:
                                projectType !== 'rank-battle' &&
                                projectType !== 'before-after' &&
                                projectType !== 'photostory' &&
                                projectType !== 'quotes' &&
                                projectType !== 'memory',
                            useProgress: projectType !== 'rank-battle' && projectType !== 'before-after',
                            useCollage: projectType === 'photostory' || projectType === 'quotes',
                        },
                    },
                ],
            },
            {
                test: /\.(css)$/,
                use: ['style-loader', 'css-loader'],
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
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html',
            inject: false,
        }),
    ],
})
