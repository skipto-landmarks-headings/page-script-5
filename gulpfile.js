const gulp         = require('gulp');
const exec         = require('child_process').exec;
const rollup       = require('rollup');
const {src, dest, task}  = require('gulp');
const {parallel, series}   = require('gulp');
const eslint       = require('gulp-eslint');
const minify       = require("gulp-minify");
const concat       = require("gulp-concat");
const sass         = require('gulp-sass')(require('sass'));
 
gulp.task('linting', () => {
    return src(['src/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task('build', () => {
  return rollup
    .rollup({
      input: './src/skipto.js'
    })
    .then(bundle => {
      return bundle.write({
        file: './docs/dist/skipto.js',
        format: 'iife',
      });
    });
});


// output to downloads directory is to support previous versions of
// SkipTo that used downloads/js directory

 gulp.task('compress', () => {
    return src('./docs/dist/skipto.js', { allowEmpty: true })
        .pipe(minify({
          ext: {
            min: '.min.js' // Set the file extension for minified files to .min.js
          },
          noSource: true
        }))
        .pipe(dest('./docs/dist'))
});

// Add copyright information to skipto

 gulp.task('copyright', () => {
  return src([
    'src/copyright.js',
    'docs/dist/skipto.js',
  ])
    .pipe(concat('skipto.js'))
    .pipe(dest('src/extension-common'))
    .pipe(dest('docs/dist'));
});

gulp.task('copyrightMin', () => {
  return src([
    'src/copyright.js',
    'docs/dist/skipto.min.js',
  ])
    .pipe(concat('skipto.min.js'))
    .pipe(dest('docs/dist'));
});

// Update extension common code

 gulp.task('extensionsCode', () => {
  return src([
    'src/extension-common/*.js',
    'src/extension-common/*.css',
    'src/extension-common/*.html',
  ])
    .pipe(dest('src/extension-chrome'))
    .pipe(dest('src/extension-opera'))
    .pipe(dest('src/extension-firefox'));
});

gulp.task('extensionsLocales', () => {
  return src([
    'src/extension-common/_locales/en/*.json',
  ])
    .pipe(dest('src/extension-chrome/_locales/en'))
    .pipe(dest('src/extension-opera/_locales/en'))
    .pipe(dest('src/extension-firefox/_locales/en'));
});

gulp.task('extensionsImages', () => {
  return src([
    'src/extension-common/images',
  ])
    .pipe(dest('src/extension-chrome/images'))
    .pipe(dest('src/extension-opera/images'))
    .pipe(dest('src/extension-firefox/images'));
});


gulp.task('documentation', function (cb) {
  exec('node ./gen-documentation.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);  });
})

gulp.task('style', function () {
  return gulp.src('./src-docs/templates/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./docs/css'));
});

const linting           = task('linting');
const build             = task('build');
const compress          = task('compress');
const extensionsCode    = task('extensionsCode');
const extensionsLocales = task('extensionsLocales');
const extensionsImages  = task('extensionsImages');
const copyright         = task('copyright');
const copyrightMin      = task('copyrightMin');
const documentation     = task('documentation');
const style             = task('style');

exports.default = series(
  linting,
  build,
  compress,
  copyright,
  parallel(extensionsCode, extensionsLocales, extensionsImages),
  copyrightMin,
  documentation,
  style);
