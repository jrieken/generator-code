var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var mocha = require('gulp-mocha');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var cp = require('child_process');

/**
 * watch for any TypeScript or LESS file changes
 * if a file change is detected, run the TypeScript compile or LESS compile gulp tasks
 */
gulp.task('watch', function() {
    gulp.watch('**/*.ts', ['tsc']);
    gulp.watch('styles/**/*.less', ['less']);
}); 

/**
 * compile less files from the ./styles folder
 * into css files to the ./public/stylesheets folder
 */
gulp.task('less', function () {
    return gulp.src('./styles/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./public/stylesheets'));
});

/**
 * run mocha tests in the ./tests folder
 */
gulp.task('test', function () {
    return gulp.src('./tests/test*.js', { read: false })
    // gulp-mocha needs filepaths so you can't have any plugins before it 
        .pipe(mocha());
});

/**
 * run browser-sync on for client changes
 */
gulp.task('browser-sync', ['nodemon', 'watch'], function () {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["public/**/*.*", "views/**/*.*"],
        browser: "google chrome",
        port: 7000,
    });
});

/**
 * run nodemon on server file changes
 */
gulp.task('nodemon', function (cb) {
    var started = false;

    return nodemon({
        script: './bin/www',
        watch: ['*.js']
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    }).on('restart', function onRestart() {
        setTimeout(function reload() {
            browserSync.reload({
                stream: false
            });
        }, 500);  // browserSync reload delay
    });
});


/**
 * compile TypeScript files based on tsconfig.json in root
 */
gulp.task('tsc', function (done) {
    runTSC('.', done);
});

function runTSC(directory, done) {
    var tscjs = path.join(process.cwd(), 'node_modules/typescript/bin/tsc.js');
    var childProcess = cp.spawn('node', [tscjs, '-p', directory], { cwd: process.cwd() });
    childProcess.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    childProcess.stderr.on('data', function (data) {
        console.log(data.toString());
    });
    childProcess.on('close', function () {
        done();
    });
}

gulp.task('default', ['browser-sync']);
