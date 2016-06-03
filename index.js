var fs = require("fs");
var pathLibrary = require("path");
var merge = require('merge2');
var foldersFound = [];
var dirBase = "";

var readDirectory = function(dir, eachFile) {
    var files = fs.readdirSync(dir);
    files.forEach(eachFile);
};
var recursiveReadFolder = function(dir, exclude, fileList) {
    if (typeof fileList === "undefined") {
        fileList = [];
    }
    readDirectory(dir, function(fileName) {
        var filePath = pathLibrary.join(dir, fileName);
        if (exclude.length < 1 || exclude.indexOf(fileName) < 0) {
            if (fs.statSync(filePath).isDirectory()) {
                foldersFound.push({
                    name: fileName,
                    path: filePath,
                    pathTarget: getPathTarget(filePath)
                });
                fileList = recursiveReadFolder(filePath, exclude, fileList);
            } else {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
};
var getPathTarget = function(path) {
    return pathLibrary.relative(dirBase, path);
};
var getFolderBase = function(baseDir) {
    var folder = { name: "", path: "" };
    readDirectory(baseDir, function(fileName) {
        var fileTest = pathLibrary.join(baseDir, fileName);
        if (!fs.statSync(fileTest).isDirectory()) {
            var pathExample = fileTest.split(pathLibrary.sep);
            folder.name = pathExample[pathExample.length - 2];
            folder.path = pathLibrary.join(baseDir, "");
            folder.pathTarget = getPathTarget(folder.path);
        }
    });
    return folder;
};
var taskSelf = function(options, tasks) {
    return function(done) {
        // set global variables
        dirBase = options.base;
        foldersFound = [];

        var folderBase = getFolderBase(options.base);
        if (folderBase.name) {
            foldersFound.push(folderBase);
        }
        recursiveReadFolder(options.base, options.exclude || []);
        var streams = foldersFound.map(tasks);
        if (streams.length === 0) {
            done();
        }
        return merge(streams);
    }
};
module.exports = taskSelf;