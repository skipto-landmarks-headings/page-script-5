const gulp         = require('gulp');
const exec         = require('child_process').exec;
const rollup       = require('rollup');
const {src, dest, task}  = require('gulp');
const {parallel, series}   = require('gulp');
const eslint       = require('gulp-eslint');
const minify       = require("gulp-minify");
 
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
        file: './downloads/js/skipto.js',
        format: 'es',
      });
    });
});

 gulp.task('compress', () => {
    return src('./downloads/js/skipto.js', { allowEmpty: true }) 
        .pipe(minify({
          ext: {
            min: '.min.js' // Set the file extension for minified files to .min.js
          },
          noSource: true
        }))
        .pipe(dest('./downloads'))
});

const linting  = task('linting');
const build    = task('build');
const compress = task('compress');

exports.default = series(linting, build, compress);