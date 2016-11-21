if(process.argv[1].indexOf("webpack-dev-server") > -1) {
  const spawn = require('child_process').spawn;
  const rails = spawn('bin/rails', ['s']);

  rails.stdout.on('data', (data) => {
    process.stdout.write(data.toString());
  });
}

const fs = require('fs');
const webpack = require("webpack");
const path = require("path");
const product = require("cartesian");

// Plugins
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const StatusPlugin = require('./node_lib/webpack-status-plugin');

// Fingerprint only in production to improve performance
const prod = process.argv.indexOf('-p') !== -1;
const css_output_template = prod ? "[name]-[chunkhash].css" : "[name].css";
const js_output_template = prod ? "[name]-[chunkhash].js" : "[name].js";
const asset_output_template = prod ? "[name]-[hash].[ext]" : "[name].[ext]";

const outputFolder = prod ? "/public/assets" : "/tmp/webpack/assets";

const asset_folders = ["./app/assets", "./lib/assets", "./vendor/assets"];
const asset_subfolders = ["/javascripts", "/stylesheets", "/lol"];

const asset_paths = product([asset_folders, asset_subfolders])
  .map(x => path.resolve(x[0] + x[1]))
  .filter(p => fs.existsSync(p))
  .concat([path.resolve('node_modules')]);

module.exports = {
  context: __dirname + "/app/assets",
  entry: {
    application: ["./javascripts/application.js", "./stylesheets/application.scss"]
  },

  output: {
    path: __dirname + outputFolder,
    publicPath: "/assets/",
    filename: js_output_template
  },

  watch: true,

  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:3000',
        secure: false
      }
    }
  },

  module: {
    loaders: [
      // JS + Babel
      {
        test: /\.(js|es6)(.erb)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      // CoffeeScript
      {
        test: /\.coffee(.erb)?$/,
        exclude: /node_modules/,
        loader: "coffee-loader"
      },
      // CSS
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      // Sass/SCSS
      {
         test: /\.s(a|c)ss$/,
         loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
      },
      // images and fonts
      {
        test: /\.(jpe?g|png|gif|svg|ttf|eot|woff2?)$/,
        loader: "file-loader?name=" + asset_output_template
      }
    ],
    preLoaders: [
      // erb
      {
        test: /\.erb$/,
        loader: 'rails-erb-loader'
      }
    ]
  },

  resolve: {
    extensions: [
      '', '.js', '.json', '.scss', '.css', '.coffee',
    ],
    root: asset_paths,
    packageMains: ["style", "main"]
  },
  plugins: [
    new ExtractTextPlugin(css_output_template),
    new ManifestPlugin(),
    StatusPlugin,
  ]
};
