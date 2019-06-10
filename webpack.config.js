const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = (env, argv) => {
  console.log(`Preparing ${argv.mode.toUpperCase()} build`);
  const isProduction = argv.mode === "production";
  return {
    context: __dirname,
    entry: path.join(__dirname, "src", "index.tsx"),
    devtool: isProduction ? "source-map" : "cheap-source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader"
        },
        {
          test: /\.(css|scss)$/,
          include: [path.join(__dirname, "src", "styles")],
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader"
            },
            {
              loader: "sass-loader"
            }
          ]
        }
      ]
    },
    optimization: {
      // minimizer: [new UglifyJSPlugin({ sourceMap: true, extractComments: true })]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      modules: ["node_modules", path.join(__dirname, "src")]
    },
    output: {
      path: path.join(__dirname, "lib"),
      filename: path.join("js", "[name].[chunkhash].js")
    },
    plugins: [
      new CleanWebpackPlugin({ verbose: true }),
      new HtmlWebpackPlugin({ title: "snaike" }),
      new MiniCssExtractPlugin({
        filename: path.join("css", `[name].[hash].css`),
        chunkFilename: path.join("css", `[id].[hash].css`)
      })
    ],
    devServer: {
      host: "localhost",
      port: 8080
    }
  };
};
