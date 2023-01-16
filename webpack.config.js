// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

const config = {
    entry: "./src/index.ts",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        libraryTarget: "umd",
        isExternalLibraryImport: "dgraph-ts",
        umdNamedDefine: true,
    },
    // Enable debugging
    devtool: "source-map",
    // devServer: {
    //     open: true,
    //     host: "localhost",
    // },
    plugins: [// Add your plugins here
        // // Learn more about plugins from https://webpack.js.org/configuration/plugins/
        // new webpack.optimize.UglifyJsPlugin({
        //     minimize: true,
        //     sourceMap: true,
        //     include: /\.min\.js$/,
        // })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/i,
                exclude: /node_modules/,
                loader: "babel-loader",
                // options: {
                //     presets: ["@babel/preset-env", "@babel/preset-typescript"],
                // }
            },
            {
                test: /\.js$/i,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    }, resolve: {
        // extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
        extensions: [".ts", ".js"]
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";
    } else {
        config.mode = "development";
    }
    return config;
};
