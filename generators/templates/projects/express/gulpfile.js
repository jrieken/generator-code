var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var mocha = require('gulp-mocha');

//************************
gulp.task('less', function () {
  return gulp.src('./public/stylesheets/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/stylesheets'));
});

//************************
gulp.task('test', function () {
    return gulp.src('./tests/test*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it 
        .pipe(mocha());
});

