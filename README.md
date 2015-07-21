# gulp-recursive-folder
Gulp plugin that work with folders treat them recursively

# Inspired and recommended of Amazing packages:

[gulp-files] ( https://www.npmjs.com/package/gulp-folders )
[gulp-recursive-concat] ( https://www.npmjs.com/package/gulp-recursive-concat )

# Example

Given the follow tree:

```
src
    modules
        submodules
            submodules1.js
            submodules2.js
        modules1.js
        modules2.js
            subsubmodules
                subsubmodules1.js
                subsubmodules2.js
    src1.js
    src2.js
```

generates

```
src
    modules
        submodules
            submodules.js
            subsubmodules
                subsubmodules.js
        modules.js
    src.js
```

or

```
src
    modules.js
    submodules.js
    subsubmodules.js
    src.js
```

Depends the usage, You can use the output value folderfound like the usage section

## Usage

```javascript
var gulp = require('gulp'),
	path = require('path'),
	recursiveFolder = require('gulp-recursive-folder'),
	pathToFolder = 'path/to/folder';

gulp.task('task', recursivefolder(pathToFolder, function(folderFound){
	//This will loop over all folders inside pathToFolder main, secondary
	//Return stream so gulp-folders can concatenate all of them
	//so you still can use safely use gulp multitasking

    //console.log('>>folderFound.name: ', folderFound.name);
    //console.log('>>folderFound.path: ', folderFound.path);
    //console.log('>>folderFound.pathTarget: ', options.target + folderFound.pathTarget);
    return gulp.src(folderFound.path + "/*.js")
        .pipe(concat(folderFound.name + ".js"))
        .pipe(gulp.dest(options.target + "/" + folderFound.pathTarget));
}));
```

