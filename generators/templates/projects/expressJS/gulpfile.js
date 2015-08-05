var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var mocha = require('gulp-mocha');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

gulp.task('less', function () {
    return gulp.src('./public/stylesheets/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('test', function () {
    return gulp.src('./tests/test*.js', { read: false })
    // gulp-mocha needs filepaths so you can't have any plugins before it 
        .pipe(mocha());
});

gulp.task('browser-sync', ['nodemon'], function () {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 7000,
    });
});

gulp.task('nodemon', function (cb) {
    var started = false;

    return nodemon({
        script: './bin/www',
        watch: ['*.js', 'bin/www', 'views/**/*.*', 'routes/**/*.js']
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