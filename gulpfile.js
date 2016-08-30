var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
// var series = require('gulp-series');

// gulp.task('build', () => {
//     return series('build-js', 'browserify-js');
// });

gulp.task('build-js', () => {
    return gulp.src(['./src/*.js', './src/**/*.js']).pipe(babel({
        presets: ['es2015']
    })).pipe(gulp.dest('dist'));
});

gulp.task('browserify-js', ['build-js'], () => {
    return gulp.src('./dist/app.js').pipe(browserify({
        insertGlobals: false,
        debug: true
    })).pipe(rename('app.build.js')).pipe(gulp.dest('./dist'));
});

gulp.task('watch', () => {
    return watch(['src/*.js', 'src/**/*.js'], () => {
        gulp.start('build');
    });
});

gulp.task('connect', () => {
    return connect.server({root: '.', fallback: 'index.html'});
});

gulp.task('build', ['build-js', 'browserify-js'])

gulp.task('default', ['build', 'connect', 'watch']);
