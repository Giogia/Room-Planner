var path = require('path');

module.exports = {
    entry: [path.resolve(__dirname, 'src/canvas.js'),
        path.resolve(__dirname, 'src/utils.js')],
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: 'http://www.room_planner.com/build/',
        filename: 'canvas.js',
        sourceMapFilename: '[file].map',
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]?[loaders]',
    },
    devtool: 'source-map',
};