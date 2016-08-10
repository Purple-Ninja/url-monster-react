var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var jeditor = require("gulp-json-editor");
var replace = require('gulp-replace');
var react = require('gulp-react');
var packageConfig = require('./package.json');

gulp.task('default', function() {
    gulp.start('build');
});

gulp.task('build', function() {
    gulp.src('src/**/*.html')
        .pipe(replace('GULP_REPLACE_VERSION', packageConfig.version))
        .pipe(gulp.dest('build'));

    gulp.src(['src/**/*.jsx','src/**/*.js'])
        .pipe(react())
        .pipe(gulp.dest('build'));

    gulp.src('src/images/*')
        .pipe(gulp.dest('build/images'));

    gulp.src('src/styles/*.css')
        .pipe(gulp.dest('build/styles'));

    gulp.src("src/manifest.json")
        .pipe(jeditor(function(json) {
                json.version = packageConfig.version;
                return json;
            }))
        .pipe(gulp.dest("build"));
});

gulp.task('watch', function () {
    watch('src/**/*', batch(function (events, done) {
        gulp.start('build', done);
    }));
});
