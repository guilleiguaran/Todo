# Yarn + Babel demo

This app demostrate how to use Yarn as package manager for Rails assets and using ES6 as default javascript engine.

## Yarn

In new apps the support for Yarn will be added using the --yarn option:

`rails new todo --yarn`

This install the dependencies defined by default in `package.json` for new apps, right now this include `jquery` and `jquery-ujs`


Also is possible to install the dependencies defined in package.json in an existing app:

`yarn`


To add new dependencies just use `yarn add` command:

`yarn add angular`

You can add a specify version of dependencies in the command:

`yarn add angular@^1.5.8`


To delete an unused dependency use the `yarn remove` command:

`yarn remove jquery-ujs`


The dependencies installed by Yarn can be used in Sprockets as long as they work exporting browser globals (most of the dependencies for browsers do this already), if you want to use CommonJS/AMD dependencies you need to have a CommonJS/AMD environment for Sprockets or a bundler like Webpack or Browserify.

For more info about Yarn read the [Getting Started](https://yarnpkg.com/en/docs/getting-started) guide.



## Babel

Support for Babel is added with the babel-rails gem, underneath this just add the babel-transpiler gem as dependency to the project, set babel as default javascript engine and add generators for ES2015 (.es6 files). 

Sprockets detects that babel-transpiler is included as dependency and register the Babel processor for .es6 files.

By default Babel transpiles ES2015 modules to CommonJS modules hence you will need a CommonJS environment for Sprockets or a bundler like Webpack or Browserify if you want to use ES2015 modules.

Check [Babel docs](http://babeljs.io/docs/learn-es2015/) to get more info about ES2015.