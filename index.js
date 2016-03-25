var fs = require("fs");
var path = require("path");
var merge = require('merge2');
var foldersFound = [];
var dirBase = "";

var readDirectory = function(dir, eachFile){
    var files = fs.readdirSync(dir);
    files.forEach(eachFile);
};
var recursiveReadFolder = function(dir, fileList){
    if(typeof fileList === "undefined"){
        fileList = [];
    }
    readDirectory(dir, function(fileName){
        var filePath = pathLibrary.join(dir, fileName);
        if(fs.statSync(filePath).isDirectory()){
            foldersFound.push({
                name:fileName,
                path:filePath,
                pathTarget : getPathTarget( filePath )
            });
            fileList = recursiveReadFolder(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    });
    return fileList;
};
var getPathTarget = function(path){
    return pathLibrary.relative(dirBase, path);
};
var getFolderBase = function(baseDir){
    var folder = {name: "", path: ""};
    readDirectory(baseDir, function(fileName){
        var fileTest = pathLibrary.join(baseDir, fileName);
        if(!fs.statSync(fileTest).isDirectory()){
            var pathExample = fileTest.split(pathLibrary.sep);
            folder.name = pathExample[pathExample.length - 2];
            folder.path = pathLibrary.join(baseDir, "");
            folder.pathTarget = getPathTarget(folder.path);
        }
    });
    return folder;
};
var taskSelf = function(dir, tasks){
    dirBase = dir;
    return function(done){
        var folderBase = getFolderBase(dir);
        if(folderBase.name){
            foldersFound.push(folderBase);
        }
        recursiveReadFolder(dir);
        var streams = foldersFound.map(tasks);
        if(streams.length === 0){
            done();
        }
        return merge(streams);
    }
};
module.exports = taskSelf;