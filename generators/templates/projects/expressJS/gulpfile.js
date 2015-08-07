var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var mocha = require('gulp-mocha');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

/**
 * task to compile less files from the ./styles folder
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
 * task to run mocha tests in the ./tests folder
 */
gulp.task('test', function () {
    return gulp.src('./tests/test*.js', { read: false })
    // gulp-mocha needs filepaths so you can't have any plugins before it 
        .pipe(mocha());
});

/**
 * task to run browser-sync on for client changes
 */
gulp.task('browser-sync', ['nodemon'], function () {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 7000,
    });
});

/**
 * task to run nodemon on server javascript file changes
 */
gulp.task('nodemon', function (cb) {
    var started = false;

    return nodemon({
        script: 'bin/www',
        watch: ['bin/www', '*.js', '*.jade']
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

gulp.task('default', ['less']);