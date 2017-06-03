const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cssExtractTextPlugin = new ExtractTextPlugin("[name].css");
const htmlExtractTextPlugin = new ExtractTextPlugin("[name].html");


module.exports = {
    entry: './application.js',

    output: {
        filename: 'application.js',
        path: `${__dirname}/dist/out/`
    },

    devtool: 'source-map',

    resolve: {
        extensions: ['.js', '.css', '.scss', '.html']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: "awesome-typescript-loader",
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.js$/,
                loader: "source-map-loader",
                exclude: /(node_modules|bower_components)/
            },

            {
                test: /\.css$/,
                loader: cssExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader"})
            },
            {
                test: /\.scss$/,
                loader: cssExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader!sass-loader"})
            },

            {
                test: /\.html$/,
                loader: htmlExtractTextPlugin.extract({fallback: "html-loader", use: "html-loader"})
            },
        ],

    },

    plugins: [
        cssExtractTextPlugin, htmlExtractTextPlugin
    ],
};