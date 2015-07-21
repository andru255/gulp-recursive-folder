var gulp = require("gulp");
var concat = require("gulp-concat");
var recursiveFolder = require("./index.js");
var options = {
    src: "./test/src/",
    target: "test/build/"
};

gulp.task("recursive-concat", recursiveFolder(options.src, function(folderFound){
        return gulp.src(folderFound.path + "/*.js")
                    .pipe(concat(folderFound.name + ".js"))
                    .pipe(gulp.dest(options.target + "/" + folderFound.pathTarget));
}));

gulp.task("default", ["recursive-concat"]);
