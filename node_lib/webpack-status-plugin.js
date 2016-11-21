var stripAnsi = require('strip-ansi');
var RequestShortener = require('webpack/lib/RequestShortener');
var requestShortener = new RequestShortener(process.cwd());

function formatError(e) {
  var showErrorDetails = true;
  var text = '';
  if (typeof e === 'string') {
    e = {
      message: e,
    };
  }
  if (e.chunk) {
    text += 'chunk ' + (e.chunk.name || e.chunk.id) +
      (e.chunk.entry ? ' [entry]' : e.chunk.initial ? ' [initial]' : '') + '\n';
  }
  if (e.file) {
    text += e.file + '\n';
  }
  if (e.module && e.module.readableIdentifier && typeof e.module.readableIdentifier === 'function') {
    text += e.module.readableIdentifier(requestShortener) + '\n';
  }
  text += e.message;
  if (showErrorDetails && e.details) text += "\n" + e.details;
  if (showErrorDetails && e.missing) text += e.missing.map(function(item) {
    return "\n[" + item + "]";
  }).join("");
  if (e.dependencies && e.origin) {
    text += "\n @ " + e.origin.readableIdentifier(requestShortener);
    e.dependencies.forEach(function(dep) {
      if(!dep.loc) return;
      if(typeof dep.loc === "string") return;
      if(!dep.loc.start) return;
      if(!dep.loc.end) return;
      text += " " + dep.loc.start.line + ":" + dep.loc.start.column + '-' +
        (dep.loc.start.line !== dep.loc.end.line ? dep.loc.end.line + ':' : '') + dep.loc.end.column;
    });
  }
  return text;
}

module.exports = function() {
  this.plugin('done', function (stats) {
    var status;
    var errors = stats.compilation.errors || [];
    errors = errors.filter(function(e) {
      return typeof(e.error) !== 'string';
    });
    if (errors.length > 0) {
      status = {
        status: 'failed',
        errors: errors.map(formatError).map(function(str) {
          str = str.split('\n');
          var header = str.shift();
          var footer = str.pop();
          if (!/^ @/.test(footer)) str.push(footer), footer = '';
          return {
            header: header,
            text: stripAnsi(str.join('\n')),
            footer: footer,
          };
        }),
      };
    } else {
      status = { status: 'ok' };
    }

    var fs = require('fs');
    fs.writeFile('tmp/webpack/status.json', JSON.stringify(status));
  });
};
