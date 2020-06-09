const gulp = require('gulp'),
      sass = require('gulp-sass');

gulp.task('sass', function () {
return gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('default',gulp.series('sass'));