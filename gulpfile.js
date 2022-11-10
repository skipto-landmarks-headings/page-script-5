const gulp         = require('gulp');
const exec         = require('child_process').exec;
const rollup       = require('rollup');
const {src, dest, task}  = require('gulp');
const {parallel, series}   = require('gulp');
const eslint       = require('gulp-eslint');
const minify       = require("gulp-minify");
const concat       = require("gulp-concat");

 
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
        file: './dist/skipto.js',
        format: 'es',
      });
    });
});


// output to downloads directory is to support previous versions of
// SkipTo that used downloads/js directory

 gulp.task('compress', () => {
    return src('./dist/skipto.js', { allowEmpty: true }) 
        .pipe(dest('./downloads/js'))        
        .pipe(minify({
          ext: {
            min: '.min.js' // Set the file extension for minified files to .min.js
          },
          noSource: true
        }))
        .pipe(dest('./dist'))
        .pipe(dest('./downloads/js'))        
});

// Add copyright information to skipto

 gulp.task('copyright', () => {
  return src([
    'src/copyright.js',
    'dist/skipto.js',
  ])
    .pipe(concat('skipto.js'))
    .pipe(dest('./dist')) 
    .pipe(dest('./downloads/js'));     
});

 gulp.task('copyrightMin', () => {
  return src([
    'src/copyright.js',
    'dist/skipto.min.js',
  ])
    .pipe(concat('skipto.min.js'))
    .pipe(dest('./dist')) 
    .pipe(dest('./downloads/js'));     
});


const linting      = task('linting');
const build        = task('build');
const compress     = task('compress');
const copyright    = task('copyright');
const copyrightMin = task('copyrightMin');

exports.default = series(linting, build, compress, copyright, copyrightMin);