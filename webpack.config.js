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

// Plugins
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');

// Fingerprint only in production to improve performance
const prod = process.argv.indexOf('-p') !== -1;
const css_output_template = prod ? "[name]-[chunkhash].css" : "[name].css";
const js_output_template = prod ? "[name]-[chunkhash].js" : "[name].js";
const asset_output_template = prod ? "[name]-[hash].[ext]" : "[name].[ext]"

module.exports = {
  context: __dirname + "/app/assets",
  entry: {
    application: ["./javascripts/application.js", "./stylesheets/application.scss"]
  },

  output: {
    path: __dirname + "/public/assets",
    publicPath: "/assets/",
    filename: js_output_template
  },

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
        test: /\.js(.erb)?$/,
        exclude: /node_modules/,
        loader: 'babel',
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
    packageMains: ["style", "main"]
  },
  plugins: [
    new ExtractTextPlugin(css_output_template),
    new ManifestPlugin()
  ]
};
