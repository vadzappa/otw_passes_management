/**
 * Author: Vadim
 * Date: 7/29/2015
 */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    globby = require('globby'),
    browserify = require('browserify'),
    through = require('through2'),
    brfs = require('brfs'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    del = require('del'),
    sass = require('gulp-sass'),
    es = require('event-stream'),
    clientJsFilesWildcard = './.web/**/*.js',
    clientScssFilesWildcard = './.web/**/*.scss',
    backendScssFilesWildcard = './.application/**/*.scss',
    vendorCssFilesWildcard = './vendor/**/*.css';

gulp.task('clean-js', function (cb) {
    return del(['./static/js/**/*.js'], cb);
});

gulp.task('clean-css', function (cb) {
    return del(['./static/css/**/*.css'], cb);
});

gulp.task('build-styles', function () {

    var sassStylesBuild = gulp.src([clientScssFilesWildcard, backendScssFilesWildcard])
        .pipe(plumber())
        .pipe(sass({
            errorLogToConsole: true
        }))
        .pipe(autoprefixer());

    var vendorStyles = gulp.src([vendorCssFilesWildcard]);

    return es.merge(sassStylesBuild, vendorStyles)
        .pipe(concat('main.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./static/css/'));

});

gulp.task('build-js', function () {
    var bundledStream = through();

    bundledStream
        // turns the output bundle stream into a stream containing
        // the normal attributes gulp plugins expect.
        .pipe(source('main.js'))
        // the rest of the gulp task, as you would normally write it.
        // here we're copying from the Browserify + Uglify2 recipe.
        .pipe(buffer())
        // Add gulp plugins to the pipeline here.
        //.pipe(uglify())
        .pipe(gulp.dest('./static/js/'));

    globby([clientJsFilesWildcard], function (err, entries) {
        // ensure any errors from globby are handled
        if (err) {
            bundledStream.emit('error', err);
            return;
        }

        // create the Browserify instance.
        var b = browserify({
            entries: entries,
            debug: true,
            transform: [brfs]
        });

        // pipe the Browserify stream into the stream we created earlier
        // this starts our gulp pipeline.
        b.bundle().pipe(bundledStream);
    });

    // finally, we return the stream, so gulp knows when this task is done.
    return bundledStream;
});


gulp.task('build', ['clean-js', 'build-js', 'clean-css', 'build-styles']);
gulp.task('js', ['clean-js', 'build-js']);
gulp.task('styles', ['clean-css', 'build-styles']);