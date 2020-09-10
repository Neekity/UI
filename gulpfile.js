//
// Gulpfile
//
var gulp                   = require('gulp'),
    sass                   = require('gulp-sass'),
    changed                = require('gulp-changed'),
    autoprefixer           = require('gulp-autoprefixer'),
    rename                 = require('gulp-rename'),
    del                    = require('del'),
    concat                 = require('gulp-concat'),
    cssnano                = require('gulp-cssnano'),
    uglify                 = require('gulp-uglifyjs'),
    cache                  = require('gulp-cache'),
    imagemin               = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    pngquant               = require('imagemin-pngquant'),
    browserSync            = require('browser-sync').create();


//
// Gulp plumber error handler - displays if any error occurs during the process on your command
//
function errorLog(error) {
  console.error.bind(error);
  this.emit('end');
}


//
// SASS - Compile SASS files into CSS
//
gulp.task('sass', function () {
 // Theme
 gulp.src('./assets/include/scss/**/*.scss')
  .pipe(changed('./assets/css/'))
  .pipe(sass({ outputStyle: 'expanded' }))
  .on('error', sass.logError)
  .pipe(autoprefixer([
      "last 1 major version",
      ">= 1%",
      "Chrome >= 45",
      "Firefox >= 38",
      "Edge >= 12",
      "Explorer >= 10",
      "iOS >= 9",
      "Safari >= 9",
      "Android >= 4.4",
      "Opera >= 30"], { cascade: true }))
  .pipe(gulp.dest('./assets/css/'))
  .pipe(browserSync.stream());
});


//
// BrowserSync (live reload) - keeps multiple browsers & devices in sync when building websites
//
//
gulp.task('serve', function() {
  browserSync.init({
    files: "./*.html",
    startPath: "./demo-crypto/dashboards/",
    server: {
      baseDir: "./",
    },
  })
});


//
// Gulp Watch and Tasks
//
//
gulp.task('watch', function() {
  gulp.watch('./assets/include/scss/**/*.scss', ['sass']);
  gulp.watch('./html/**/*.html').on('change', browserSync.reload);
  gulp.watch('./starter/**/*.html').on('change', browserSync.reload);
  gulp.watch('./documentation/**/*.html').on('change', browserSync.reload);
});

// Gulp Tasks
gulp.task('default', ['watch', 'sass', 'serve'])


//
// CSS minifier - merges and minifies the below given list of Front libraries into one theme.min.css
//
gulp.task('minCSS', function() {
  return gulp.src([
    './assets/css/theme.css',
  ])
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./dist/css/'));
});


//
// JavaSript minifier - merges and minifies the below given list of Front libraries into one theme.min.js
//
gulp.task('minJS', function() {
  return gulp.src([
    './assets/js/hs.core.js',
    './assets/js/components/**/*',
    './assets/js/custom-theme.js',
  ])
  .pipe(concat('theme.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js/'));
});


//
// Image minifier - compresses images
//
gulp.task('minIMG', function() {
  return gulp.src('./assets/img/**/*')
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imageminJpegRecompress({
        loops: 5,
        min: 65,
        max: 70,
        quality:'medium'
      }),
      imagemin.svgo(),
      imagemin.optipng({optimizationLevel: 3}),
      pngquant({quality: '65-70', speed: 5})
    ],{
      verbose: true
    })))
    .pipe(gulp.dest('./dist/img/'));
});


//
// Copy Vendors - a utility to copy client-side dependencies into a folder
//
gulp.task('copyVendors', function() {
  gulp.src([
    './node_modules/*animate.css/**/*',
    './node_modules/*chartist/**/*',
    './node_modules/*clipboard/**/*',
    './node_modules/*datatables/**/*',
    './node_modules/*flatpickr/**/*',
    './node_modules/*jquery/**/*',
    './node_modules/*jquery-migrate/**/*',
    './node_modules/*jquery-validation/**/*',
    './node_modules/select2/**/*.*',
    './node_modules/*popper.js/**/*',
  ])
  .pipe(gulp.dest('./dist/vendor/'))
});

gulp.task('dist', ['copyVendors', 'minCSS', 'minJS', 'minIMG']);