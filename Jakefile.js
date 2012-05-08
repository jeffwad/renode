//  er, pinched runCmds from geddy. nicely done sir.
//  build a project, client, server and tests
var child_process   = require('child_process'),
    fs              = require('fs'),
    ujs             = require("uglify-js"),
    util            = require("util"),
    builtFiles      = {};



desc("Build app + tests");
task("default", ["build:app", "build:tests"], function() {

});

namespace("build", function() {
  desc("Build app");
  task("app", [], function() {

    var cmds = [
      "rm -r " + __dirname + "/htdocs",
      "mkdir -p " + __dirname + "/htdocs"
    ];

    runCmds(cmds, function() {

      copyAndMinifyFile(__dirname + "/src/require.js");
      //copyAndMinifyFile(__dirname + "/src/worker.js");
      copyFile(__dirname + "/src/index.html");
      //copyFile(__dirname + "/src/index.debug.html");
      buildFiles(__dirname + "/src/client.js");
      //buildFiles(__dirname + "/src/tests/modules.js");
      //copyFile(__dirname + "/src/tests/runner.html");

    });

  });


  desc("Builds a single file");
  task("file", [], function() {



  });

  desc("Build tests");
  task("tests", [], function() {

    var cmds = [
      //"rm -r " + __dirname + "/htdocs/tests",
      //"mkdir -p " + __dirname + "/htdocs",
      "mkdir -p " + __dirname + "/htdocs/tests/specs",
      "cp -r " + __dirname + "/src/tests/lib/ "  + __dirname + "/htdocs/tests/lib/"
    ];

    runCmds(cmds, function() {

      buildFiles(__dirname + "/src/tests/modules.js");
      copyFile(__dirname + "/src/tests/runner.html");

    });


  });
});


function copyFile(filename, callback) {

  fs.readFile(filename, "utf8", function(err, data) {

    //  write the file
    filename = filename.replace("/src/", "/htdocs/");
    console.log("copy: ", filename);

    //  create the folder if it doesn't exist
    var foldername = filename.split("/");
    foldername.pop();
    foldername = foldername.join("/");

    runCmds(["mkdir -p " + foldername], function() {

      fs.writeFile(filename, data, "utf8", function(err) {
        if(err) {
          console.error(err);
          return;
        }
        if(callback) {
          callback(filename);
        }
      });
    });
  });
}


function createMinifiedFile(filename) {

  var ast;

  fs.readFile(filename, "utf8", function(err, data) {

    ast = ujs.parser.parse(data);       // parse code and get the initial AST
    ast = ujs.uglify.ast_mangle(ast);   // get a new AST with mangled names
    ast = ujs.uglify.ast_squeeze(ast);  // get an AST with compression optimizations
    data = ujs.uglify.gen_code(ast);    // compressed code here

    //  write the file
    filename = filename.replace(".js", ".min.js");

    fs.writeFile(filename, data, "utf8", function(err) {
      if(err) {
        console.error(err);
      }
    });
  });

}


function createTransportFile(filename, callback) {

  fs.readFile(filename, "utf8", function(err, data) {

    var i, requires, transport, raw, start, foldername, buildFilename;

    requires = [];
    transport = [
      "define(\"" + filename.split(__dirname + "/src")[1].split(".js")[0] + "\",\n\n",
      "\tfunction(require, exports, module) {\n\n",
      "\t}\n\n",
      ");"
    ];

    //  does the module have any dependencies
    requires = data.match(/require\(["'](\w*|\/*|:*|-*|\.\w{2,3})+["']\)/g);
    requires = requires ? requires.map(function(dependency) {

      if(dependency === "require(\"events\")") {
        return "\"" + dependency.replace(/require\("/, "").replace(/"\)/, "") + "\"";
      }

      return "\"/" + dependency.replace(/require\("/, "").replace(/"\)/, "") + "\"";

    }) : false;

    //  split at the first end comment block
    raw = data.split("*/\n");

    //  find the line at which the module start
    start = raw[0].split("\n").length;

    //  stich the module back together
    raw.shift();
    data = raw.join("*/\n").replace(/\n/g, "\n\t\t");

    //  ensure we have leading /'s on our require statements'
    data = data.replace(/require\("/g, "require(\"/");
    data = data.replace(/require\("\/events/g, "require(\"events");

    //  insert raw module into transport
    transport.splice(2, 0, "\t\t" + data + "\n");

    //  insert the requires list and calculate the actual start position
    if(requires) {
      start = start - 6;
      transport.splice(1, 0, "\t[" + requires.join(",") + "],\n\n");
    }
    else {
      start = start - 4;
    }

    //  push the start position down. ensures line numbers match
    for(i = 0; i < start; i++) {
      transport.unshift("\n");
    }

    //  get the new file path
    buildFilename = filename.replace("/src/", "/htdocs/");

    //  create the folder if it doesn't exist
    foldername = buildFilename.split("/");
    foldername.pop();
    foldername = foldername.join("/");

    runCmds(["mkdir -p " + foldername], function() {

      //  write the file
      fs.writeFile(buildFilename, transport.join(""), "utf8", function(err) {
        if(err) {
          console.error(err);
          return true;
        }
        if(callback) {
          console.log("build: ", filename);
          callback(buildFilename);
        }

        //  recurse and build required files
        if(requires) {
          requires.forEach(function(module) {

            var filename;

            module = module.replace(/"/g, '');

            if(/.html$/.test(module)) {

              filename = __dirname + "/src" + module;

              copyFile(filename);

            }

            else if(/^\//.test(module)) {

              filename = __dirname + "/src" + module + ".js";

              if(typeof builtFiles[filename] === "undefined") {

                buildFiles(filename);

              }
            }

          });
        }
      });

    });

  });
}


function copyAndMinifyFile(filename) {

  fs.stat(filename, function(err, stats) {
    if(err) throw err;
    if(stats.isFile()) {
      copyFile(filename, function(filename) {
        createMinifiedFile(filename);
      });
    }
    else {
      console.log(filename + ": is not a file");
    }
  });

}



function buildFiles(filename) {

  fs.stat(filename, function(err, stats) {
    if(err) throw err;
    if(stats.isFile()) {
      builtFiles[filename] = filename;
      createTransportFile(filename, function(filename) {
        createMinifiedFile(filename);
      });
    }
    else {
      console.log(filename + ": is not a file");
    }
  });

}





// Runs an array of shell commands asynchronously, calling the
// next command off the queue inside the callback from child_process.exec.
// When the queue is done, call the final callback function.
function runCmds(arr, callback, printStdout) {
  var run = function (cmd) {
    child_process.exec(cmd, function (err, stdout, stderr) {
      if (err) {
        console.error('Error: ' + JSON.stringify(err));
      }
      else if (stderr) {
        console.error('Error: ' + stderr);
      }
      else {
        if (printStdout) {
          console.log(stdout);
        }
        if (arr.length) {
          var next = arr.shift();
          run(next);
        }
        else {
          if (callback) {
            callback();
          }
        }
      }
    });
  };
  run(arr.shift());
}
