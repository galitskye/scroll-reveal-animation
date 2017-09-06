var gulp         = require('gulp'),
    browserSync  = require('browser-sync').create(),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('server', function() {

    browserSync.init({
        port: 9999,
        server: "./src",
        notify: false
    });
});

gulp.task('sass', function() {
    return gulp.src("src/scss/*.scss")
      .pipe(sass())
      .pipe(autoprefixer({
          browsers: ['last 20 versions'],
          cascade: true
      }))
      .pipe(gulp.dest("src/css"))
      .pipe(browserSync.stream());
});

gulp.task('default', ['server'], function(){
    gulp.watch("src/scss/*.scss", ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch("src/js/*.js").on('change', browserSync.reload);
});