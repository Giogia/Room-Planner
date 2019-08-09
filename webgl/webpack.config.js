var path = require('path');

module.exports = {
    entry: [path.resolve(__dirname, 'src/app.js'),
        path.resolve(__dirname, 'src/utils.js')],
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: 'http://www.room_planner.com/build/',
        filename: 'app.js',
        sourceMapFilename: '[file].map',
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]?[loaders]',
    },
    devtool: 'source-map',
};