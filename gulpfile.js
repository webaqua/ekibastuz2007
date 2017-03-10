var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
		minifycss    = require('gulp-minify-css'),
		rename       = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    pug = require('gulp-pug'),
    browserSync = require('browser-sync').create();

gulp.task('pug', function() {
    return gulp.src('./src/*.pug')
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('./src/app'));
});

gulp.task('sass', function () {
  return gulp.src('./src/sass/*.{scss,sass}')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(plumber())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write('.'))
  	.pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(minifycss({processImport: false}))
    .pipe(gulp.dest('./src/app/css'));
});

gulp.task('scripts', function () {
  return gulp.src(['./src/js/custom/*.js'])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('production.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./src/app/js'));
});

gulp.task('jshint', function () {
    return gulp.src(['./src/js/custom/*.js'])
            .pipe(jshint())
            .pipe(jshint.reporter(stylish));
});

gulp.task('compress', function() {
  return gulp.src('./src/js/custom/*.js')
    .pipe(uglify())
    .pipe(concat('production.min.js'))
    .pipe(gulp.dest('./src/app/js'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./src/app"
        }
    });
});


gulp.task('watch', function() {
  gulp.watch('./src/app/*.html').on('change', browserSync.reload);
  gulp.watch('./src/sass/**/*.scss', ['sass', browserSync.reload]);
  gulp.watch('./src/sass/**/*.sass', ['sass', browserSync.reload]);
  gulp.watch('./src/*.pug', ['pug', browserSync.reload]);
  gulp.watch('./src/js/**/*.js', ['scripts', browserSync.reload]);
});

gulp.task('default', function() {
    gulp.start('pug', 'sass', 'scripts', 'jshint', 'compress', 'browser-sync', 'watch');
});
